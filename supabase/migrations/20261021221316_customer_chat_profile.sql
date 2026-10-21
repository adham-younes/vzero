-- Additive customer chat and source visibility. No legacy content rewrite or retention purge.
set lock_timeout='3s';
set statement_timeout='30s';
alter table public.agents add column chat_profile text not null default 'grounded_v1' check(chat_profile in ('grounded_v1','customer_v1'));
alter table public.agent_runs add column retention_expires_at timestamptz;
create index agent_runs_conversation_scope on public.agent_runs(org_id,agent_id,actor_id,access_kind,conversation_id,created_at desc,id desc);
create function public.studio_normalize_search(value text) returns text language sql immutable strict parallel safe set search_path='' as $$
 select lower(regexp_replace(regexp_replace(normalize(value,NFKC),'([؀-ۿ])([A-Za-z0-9])','\1 \2','g'),'([A-Za-z0-9])([؀-ۿ])','\1 \2','g'))
$$;
revoke all on function public.studio_normalize_search(text) from public;
grant execute on function public.studio_normalize_search(text) to authenticated,service_role;
create index knowledge_chunks_terms_v2 on public.knowledge_chunks using gin(to_tsvector('simple',public.studio_normalize_search(content)));
create function public.search_agent_knowledge_v2(workspace uuid,agent uuid,source_ids uuid[],query text,history_query text default '') returns table(id uuid,source_id uuid,title text,content text,score real)
language sql security invoker set search_path='' as $$
 with q as (select websearch_to_tsquery('simple',public.studio_normalize_search(query)) current_q,websearch_to_tsquery('simple',public.studio_normalize_search(history_query)) history_q)
 select c.id,c.source_id,s.title,c.content,(ts_rank_cd(to_tsvector('simple',public.studio_normalize_search(c.content)),q.current_q)+0.25*ts_rank_cd(to_tsvector('simple',public.studio_normalize_search(c.content)),q.history_q))::real score
 from public.knowledge_chunks c join public.knowledge_sources s on s.id=c.source_id and s.org_id=c.org_id and s.agent_id=c.agent_id cross join q
 where c.org_id=workspace and c.agent_id=agent and c.source_id=any(source_ids) and s.status='ready'
 and (to_tsvector('simple',public.studio_normalize_search(c.content)) @@ q.current_q or to_tsvector('simple',public.studio_normalize_search(c.content)) @@ q.history_q)
 order by score desc,c.ordinal limit 6
$$;
revoke all on function public.search_agent_knowledge_v2(uuid,uuid,uuid[],text,text) from public,anon;
grant execute on function public.search_agent_knowledge_v2(uuid,uuid,uuid[],text,text) to authenticated,service_role;

-- Every source-derived output (including proposals/drafts) depends on the ORIGINAL chunks.
create function agynexa_private.run_content_current(r public.agent_runs) returns boolean language plpgsql stable security definer set search_path='' as $$
declare dep jsonb; c public.knowledge_chunks; src public.knowledge_sources; version public.agent_versions; publication public.agent_publications;
begin
 if r.retention_expires_at is not null and r.retention_expires_at<=now() then return false; end if;
 if r.status<>'succeeded' then return true; end if;
 if r.access_kind<>'studio' then
  select * into publication from public.agent_publications where agent_id=r.agent_id and org_id=r.org_id;
  if publication.agent_id is null or not publication.active or publication.version_id<>r.version_id or publication.generation<>coalesce((r.snapshot->>'generation')::integer,-1) then return false; end if;
  select * into version from public.agent_versions where id=r.version_id and agent_id=r.agent_id and org_id=r.org_id;
 end if;
 if r.snapshot ? 'chat_v2' then
  if jsonb_typeof(r.snapshot->'chat_v2'->'sourceDependencies') is distinct from 'array' then return false; end if;
  for dep in select * from jsonb_array_elements(r.snapshot->'chat_v2'->'sourceDependencies') loop
   select * into c from public.knowledge_chunks where id=(dep->>'chunkId')::uuid and source_id=(dep->>'sourceId')::uuid and agent_id=r.agent_id and org_id=r.org_id;
   select * into src from public.knowledge_sources where id=c.source_id and agent_id=r.agent_id and org_id=r.org_id and status='ready';
   if c.id is null or src.id is null or encode(sha256(convert_to(c.content,'UTF8')),'hex')<>dep->>'contentHash' then return false; end if;
   if not (src.id=any(array(select jsonb_array_elements_text(coalesce(r.snapshot->'sourceIds','[]'))::uuid))) then return false; end if;
   if r.access_kind='widget' and (not src.public_approved or not src.id=any(version.public_source_ids)) then return false; end if;
   if r.access_kind='api' and not src.id=any(version.source_ids) then return false; end if;
  end loop;
 else
  if jsonb_array_length(r.citations)=0 then return coalesce(r.usage->>'retrieval'='no_match' or r.usage->>'response_kind'='conversation',false); end if;
  for dep in select * from jsonb_array_elements(r.citations) loop
   select * into c from public.knowledge_chunks where id=(dep->>'chunkId')::uuid and source_id=(dep->>'sourceId')::uuid and agent_id=r.agent_id and org_id=r.org_id;
   select * into src from public.knowledge_sources where id=c.source_id and agent_id=r.agent_id and org_id=r.org_id and status='ready';
   if c.id is null or src.id is null or c.content is distinct from dep->>'quote' then return false; end if;
   if r.access_kind='widget' and (not src.public_approved or not src.id=any(version.public_source_ids)) then return false; end if;
   if r.access_kind='api' and not src.id=any(version.source_ids) then return false; end if;
  end loop;
 end if;
 return true;
exception when invalid_text_representation then return false;
end $$;
revoke all on function agynexa_private.run_content_current(public.agent_runs) from public,anon,authenticated;
grant execute on function agynexa_private.run_content_current(public.agent_runs) to service_role;

-- Transactional actor-scoped delete, sharing the agent lock used by source changes/approval/finalization.
create function agynexa_private.studio_delete_conversation(p_agent_id uuid,p_conversation_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare ag public.agents; n integer;
begin
 if auth.uid() is null or not agynexa_private.current_session_active() then raise exception 'sign_in_required' using errcode='42501'; end if;
 select * into ag from public.agents where id=p_agent_id for update;
 if ag.id is null or not exists(select 1 from public.memberships where org_id=ag.org_id and user_id=auth.uid() and role='owner') then raise exception 'not_found' using errcode='42501'; end if;
 delete from public.agent_runs where org_id=ag.org_id and agent_id=ag.id and actor_id=auth.uid() and access_kind='studio' and conversation_id=p_conversation_id;
 get diagnostics n=row_count;
 return jsonb_build_object('deleted',n>0);
end $$;
revoke all on function agynexa_private.studio_delete_conversation(uuid,uuid) from public,anon;
grant execute on function agynexa_private.studio_delete_conversation(uuid,uuid) to authenticated;
create function public.studio_delete_conversation(p_agent_id uuid,p_conversation_id uuid) returns jsonb language sql security invoker set search_path='' as $$select agynexa_private.studio_delete_conversation(p_agent_id,p_conversation_id)$$;
revoke all on function public.studio_delete_conversation(uuid,uuid) from public,anon;
grant execute on function public.studio_delete_conversation(uuid,uuid) to authenticated;

-- Retention policy is NOT approved: nullable marker only, no scheduled purge or legacy timer.
create or replace function agynexa_private.studio_mutate(a uuid, operation text, payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare ag public.agents; src public.knowledge_sources; v public.agent_versions; support public.support_requests; result jsonb; sid uuid; ver uuid; source_list uuid[]; public_list uuid[]; part text; n integer:=0;
begin
 if auth.uid() is null or not agynexa_private.current_session_active() then raise exception 'sign_in_required' using errcode='42501'; end if;
 select * into ag from public.agents where id=a for update;
 if ag.id is null or not exists(select 1 from public.memberships where org_id=ag.org_id and user_id=auth.uid() and role='owner') then raise exception 'not_found' using errcode='42501'; end if;
 if operation='source_add' then
  select * into src from public.knowledge_sources where agent_id=a and request_key=(payload->>'requestKey')::uuid;
  if src.id is not null then
   if src.title<>payload->>'title' or src.content<>payload->>'content' or src.public_approved<>(payload->>'publicApproved')::boolean or src.status<>'ready' then raise exception 'request_conflict' using errcode='23505'; end if;
   return to_jsonb(src)-'content';
  end if;
  insert into public.knowledge_sources(org_id,agent_id,request_key,title,content,public_approved) values(ag.org_id,a,(payload->>'requestKey')::uuid,payload->>'title',payload->>'content',(payload->>'publicApproved')::boolean) returning * into src;
  -- Fixed overlapping text windows. No external parser, URL fetch or embeddings.
  while n<char_length(src.content) loop
   part:=substr(src.content,n+1,1200);
   insert into public.knowledge_chunks(org_id,agent_id,source_id,ordinal,content) values(ag.org_id,a,src.id,n/1000,part);
   n:=n+1000;
  end loop;
  return to_jsonb(src)-'content';
 elsif operation='source_delete' then
  sid:=(payload->>'sourceId')::uuid;
  update public.knowledge_sources set status='deleted',content='[deleted]',public_approved=false where id=sid and agent_id=a;
  delete from public.knowledge_chunks where source_id=sid and agent_id=a;
  -- Active runs cannot release an answer containing a newly revoked source.
  update public.agent_runs set status='cancelled',answer=null,citations='[]',finished_at=now(),error_code='source_removed' where agent_id=a and status='running';
  return jsonb_build_object('deleted',true);
 elsif operation='publish' then
  select * into v from public.agent_versions where agent_id=a and request_key=(payload->>'requestKey')::uuid;
  if v.id is not null then
   if v.settings->>'revision'<>(payload->>'revision') then raise exception 'request_conflict' using errcode='23505'; end if;
   return to_jsonb(v);
  end if;
  if ag.revision<>(payload->>'revision')::integer then raise exception 'revision_conflict' using errcode='23505'; end if;
  select coalesce(array_agg(id),'{}'),coalesce(array_agg(id) filter(where public_approved),'{}') into source_list,public_list from public.knowledge_sources where agent_id=a and status='ready';
  if cardinality(source_list)=0 then raise exception 'sources_required' using errcode='22023'; end if;
  if (payload->>'widgetEnabled')::boolean and cardinality(public_list)=0 then raise exception 'public_sources_required' using errcode='22023'; end if;
  insert into public.agent_versions(org_id,agent_id,request_key,settings,source_ids,public_source_ids) values(ag.org_id,a,(payload->>'requestKey')::uuid,to_jsonb(ag),source_list,public_list) returning * into v;
  insert into public.agent_publications(agent_id,org_id,version_id,widget_enabled) values(a,ag.org_id,v.id,(payload->>'widgetEnabled')::boolean)
   on conflict(agent_id) do update set version_id=excluded.version_id,active=true,widget_enabled=excluded.widget_enabled,generation=public.agent_publications.generation+1,updated_at=now();
  return to_jsonb(v);
 elsif operation='unpublish' then
  update public.agent_publications set active=false,generation=generation+1,updated_at=now() where agent_id=a;
  update public.agent_runs set status='cancelled',finished_at=now(),error_code='unpublished' where agent_id=a and access_kind<>'studio' and status='running';
  return jsonb_build_object('active',false);
 elsif operation='key_revoke' then
  update public.agent_api_keys set revoked_at=now() where id=(payload->>'keyId')::uuid and agent_id=a;
  return jsonb_build_object('revoked',true);
 elsif operation='approval' then
  select * into support from public.support_requests where id=(payload->>'approvalId')::uuid and agent_id=a and requested_by=auth.uid() for update;
  if support.id is null then raise exception 'not_found' using errcode='42501'; end if;
  if payload->>'decision' not in ('approved','rejected') then raise exception 'invalid_input' using errcode='22023'; end if;
  -- Agent row is locked above, serializing source-delete and this decision.
  if not exists(select 1 from public.agent_runs r where r.id=support.run_id and r.org_id=ag.org_id and r.agent_id=a and r.actor_id=auth.uid() and r.access_kind='studio' and r.status='succeeded' and agynexa_private.run_content_current(r)) then
   update public.support_requests set status='expired',decided_at=now() where id=support.id returning * into support;
   return to_jsonb(support)-'title'-'details'||jsonb_build_object('title','[Knowledge changed]','details','[Knowledge changed]','historyState','knowledge_changed');
  end if;
  if support.status='pending' then
   update public.support_requests set status=case when expires_at<now() then 'expired' else payload->>'decision' end,decided_at=now() where id=support.id returning * into support;
  elsif support.status<>payload->>'decision' then raise exception 'request_conflict' using errcode='23505'; end if;
  return to_jsonb(support);
 elsif operation='cancel' then
  update public.agent_runs set status='cancelled',finished_at=now() where id=(payload->>'runId')::uuid and agent_id=a and actor_id=auth.uid() and access_kind='studio' and status='running';
  return jsonb_build_object('cancelled',true);
 end if;
 raise exception 'invalid_operation' using errcode='22023';
end $$;

create or replace function public.finish_agent_run(run_id uuid,result jsonb) returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.agent_runs; sid uuid; proposal jsonb;
begin
 select * into r from public.agent_runs where id=run_id;
 if r.id is null then raise exception 'not_found'; end if;
 perform 1 from public.agents where id=r.agent_id for update;
 select * into r from public.agent_runs where id=run_id for update;
 if r.status<>'running' then return to_jsonb(r); end if;
 if r.expires_at<now() then result:=jsonb_build_object('status','failed','error_code','execution_timeout'); end if;
 if result->>'status'='succeeded' then
  if result ? 'chat_v2' then r.snapshot:=r.snapshot||jsonb_build_object('chat_v2',result->'chat_v2'); end if; r.status:='succeeded'; r.usage:=coalesce(result->'usage','{}'); r.citations:=coalesce(result->'citations','[]');
  if not agynexa_private.run_content_current(r) then result:=jsonb_build_object('status','cancelled','error_code','source_removed'); end if;
  if exists(select 1 from jsonb_array_elements(coalesce(result->'citations','[]')) c where not exists(select 1 from public.knowledge_sources s where s.id=(c->>'sourceId')::uuid and s.agent_id=r.agent_id and s.status='ready')) then
   result:=jsonb_build_object('status','cancelled','error_code','source_removed');
  end if;
  if r.access_kind<>'studio' and not exists(select 1 from public.agent_publications p where p.agent_id=r.agent_id and p.active and p.version_id=r.version_id and p.generation=(r.snapshot->>'generation')::integer) then
   result:=jsonb_build_object('status','cancelled','error_code','unpublished');
  end if;
  if r.access_kind='api' and not exists(select 1 from public.agent_api_keys k where k.id=(r.snapshot->>'keyId')::uuid and k.revoked_at is null and k.expires_at>now()) then result:=jsonb_build_object('status','cancelled','error_code','key_revoked'); end if;
 end if;
 if result->>'status'<>'succeeded' then r.snapshot:=r.snapshot-'chat_v2'; end if;
 update public.agent_runs set snapshot=r.snapshot,status=result->>'status',answer=result->>'answer',citations=coalesce(result->'citations','[]'),usage=coalesce(result->'usage','{}'),error_code=result->>'error_code',finished_at=now() where id=run_id returning * into r;
 proposal:=result->'support';
 if r.status='succeeded' and r.access_kind='studio' and r.snapshot->>'template'='serviceflow' and proposal->>'propose'='true' then
  insert into public.support_requests(org_id,agent_id,run_id,requested_by,title,details) values(r.org_id,r.agent_id,r.id,r.actor_id,proposal->>'title',proposal->>'details') on conflict on constraint support_requests_run_id_key do nothing;
 end if;
 return to_jsonb(r);
end $$;

-- Raw-read grants are closed by the following migration AFTER compatible application deployment.
-- App routes read via server service client ONLY after exact actor/org/agent authorization.
-- Existing user-facing mutations remain authenticated RPCs with active-session checks.

grant insert(chat_profile) on public.agents to authenticated;
-- Bounded service-only listing; identity/org are supplied only by authenticated server routes.
create function public.studio_list_conversations(p_org uuid,p_agent uuid,p_actor uuid,p_before timestamptz default null,p_before_id uuid default null)
returns table(id uuid,title text,updated_at timestamptz) language sql stable security invoker set search_path='' as $$
 with grouped as (
 select r.conversation_id id,(array_agg(left(r.question,80) order by r.created_at,r.id))[1] title,max(r.created_at) updated_at
 from public.agent_runs r where r.org_id=p_org and r.agent_id=p_agent and r.actor_id=p_actor and r.access_kind='studio' and (r.retention_expires_at is null or r.retention_expires_at>now())
 group by r.conversation_id)
 select g.id,g.title,g.updated_at from grouped g where p_before is null or (g.updated_at,g.id)<(p_before,p_before_id) order by g.updated_at desc,g.id desc limit 51
$$;
revoke all on function public.studio_list_conversations(uuid,uuid,uuid,timestamptz,uuid) from public,anon,authenticated;
grant execute on function public.studio_list_conversations(uuid,uuid,uuid,timestamptz,uuid) to service_role;

-- Vercel route lifecycle is 300s; lease is the hosting envelope, not a response SLA.
alter table public.agent_runs alter column expires_at set default now()+interval '295 seconds';
create or replace function public.start_agent_run(run jsonb, concurrency_limit integer) returns jsonb language plpgsql security invoker set search_path='' as $$
declare existing public.agent_runs; org uuid:=(run->>'org_id')::uuid;
begin
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('runs:'||org::text,0));
 update public.agent_runs set status='failed',error_code='execution_timeout',finished_at=now() where org_id=org and status='running' and expires_at<now();
 select * into existing from public.agent_runs where agent_id=(run->>'agent_id')::uuid and access_kind=run->>'access_kind' and request_key=(run->>'request_key')::uuid;
 if existing.id is not null then
  if existing.input_hash<>run->>'input_hash' or existing.org_id<>org or existing.actor_id is distinct from (run->>'actor_id')::uuid or existing.conversation_id<>(run->>'conversation_id')::uuid or existing.snapshot->>'identity' is distinct from run->'snapshot'->>'identity' then raise exception 'request_conflict' using errcode='23505'; end if;
  return jsonb_build_object('existing',true,'run',to_jsonb(existing));
 end if;
 if (select count(*) from public.agent_runs where org_id=org and status='running')>=greatest(1,least(concurrency_limit,20)) then raise exception 'concurrency_limit' using errcode='53300'; end if;
 insert into public.agent_runs(id,org_id,agent_id,conversation_id,actor_id,access_kind,request_key,input_hash,snapshot,model,version_id,question)
 values((run->>'id')::uuid,org,(run->>'agent_id')::uuid,(run->>'conversation_id')::uuid,(run->>'actor_id')::uuid,run->>'access_kind',(run->>'request_key')::uuid,run->>'input_hash',run->'snapshot',run->>'model',(run->>'version_id')::uuid,run->>'question') returning * into existing;
 return jsonb_build_object('existing',false,'run',to_jsonb(existing));
end $$;
