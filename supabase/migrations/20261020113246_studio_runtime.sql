-- Studio C/D. Additive schema; user identity comes from Auth, not input metadata.
alter table public.agents drop constraint agents_model_check;
alter table public.agents add constraint agents_model_check check(model in ('openai/gpt-oss-120b','openai/gpt-oss-20b','qwen/qwen3.8-27b'));
create table public.knowledge_sources (
 id uuid primary key default gen_random_uuid(), org_id uuid not null, agent_id uuid not null,
 request_key uuid not null, title text not null check(char_length(title) between 1 and 160),
 content text not null check(octet_length(content) between 1 and 12000),
 public_approved boolean not null default false, status text not null default 'ready' check(status in ('ready','deleted')),
 created_at timestamptz not null default now(), unique(org_id,agent_id,id), unique(agent_id,request_key),
 foreign key(org_id,agent_id) references public.agents(org_id,id) on delete cascade
);
create table public.knowledge_chunks (
 id uuid primary key default gen_random_uuid(), org_id uuid not null, agent_id uuid not null, source_id uuid not null,
 ordinal integer not null, content text not null check(char_length(content) between 1 and 1400),
 search_terms tsvector generated always as(to_tsvector('simple',content)) stored,
 unique(source_id,ordinal), foreign key(org_id,agent_id,source_id) references public.knowledge_sources(org_id,agent_id,id) on delete cascade
);
create index knowledge_chunks_terms on public.knowledge_chunks using gin(search_terms);
create index knowledge_chunks_agent on public.knowledge_chunks(org_id,agent_id);
create table public.agent_versions (
 id uuid primary key default gen_random_uuid(), org_id uuid not null, agent_id uuid not null,
 request_key uuid not null, settings jsonb not null, source_ids uuid[] not null, public_source_ids uuid[] not null,
 created_at timestamptz not null default now(), unique(org_id,agent_id,id), unique(agent_id,request_key),
 foreign key(org_id,agent_id) references public.agents(org_id,id) on delete cascade
);
create table public.agent_publications (
 agent_id uuid primary key, org_id uuid not null, version_id uuid not null, active boolean not null default true,
 public_id uuid not null unique default gen_random_uuid(), widget_enabled boolean not null default false,
 generation integer not null default 1, updated_at timestamptz not null default now(),
 foreign key(org_id,agent_id,version_id) references public.agent_versions(org_id,agent_id,id) on delete cascade
);
create table public.agent_api_keys (
 id uuid primary key default gen_random_uuid(), org_id uuid not null, agent_id uuid not null,
 token_hash text not null unique, label text not null, created_at timestamptz not null default now(), revoked_at timestamptz,
 expires_at timestamptz not null default now()+interval '90 days',
 foreign key(org_id,agent_id) references public.agents(org_id,id) on delete cascade
);
create table public.agent_runs (
 id uuid primary key, org_id uuid not null, agent_id uuid not null, conversation_id uuid not null,
 actor_id uuid references auth.users(id) on delete set null, access_kind text not null check(access_kind in ('studio','api','widget')),
 request_key uuid not null, input_hash text not null, snapshot jsonb not null, model text not null,
 version_id uuid, status text not null default 'running' check(status in ('running','succeeded','failed','cancelled')),
 question text not null check(char_length(question) between 1 and 3000), answer text,
 citations jsonb not null default '[]', usage jsonb not null default '{}', error_code text,
 created_at timestamptz not null default now(), finished_at timestamptz, expires_at timestamptz not null default now()+interval '55 seconds',
 unique(org_id,agent_id,id), unique(agent_id,access_kind,request_key),
 foreign key(org_id,agent_id) references public.agents(org_id,id) on delete cascade,
 foreign key(org_id,agent_id,version_id) references public.agent_versions(org_id,agent_id,id)
);
create index agent_runs_org_time on public.agent_runs(org_id,created_at desc);
create table public.support_requests (
 id uuid primary key default gen_random_uuid(), org_id uuid not null, agent_id uuid not null, run_id uuid not null unique,
 requested_by uuid not null references auth.users(id) on delete cascade,
 title text not null check(char_length(title) between 1 and 160), details text not null check(char_length(details) between 1 and 3000),
 status text not null default 'pending' check(status in ('pending','approved','rejected','expired')),
 expires_at timestamptz not null default now()+interval '15 minutes', decided_at timestamptz, created_at timestamptz not null default now(),
 foreign key(org_id,agent_id,run_id) references public.agent_runs(org_id,agent_id,id) on delete cascade
);
create table agynexa_private.widget_sessions (
 token_hash text primary key, agent_id uuid not null references public.agents(id) on delete cascade,
 generation integer not null, expires_at timestamptz not null default now()+interval '10 minutes'
);
alter table agynexa_private.widget_sessions enable row level security;
grant all on agynexa_private.widget_sessions to service_role;
-- Never expose internal keys or arbitrary writes through PostgREST.
do $$ declare t text; begin
 foreach t in array array['knowledge_sources','knowledge_chunks','agent_versions','agent_publications','agent_api_keys','agent_runs','support_requests'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant all on public.%I to service_role',t);
  execute format('create policy member_read on public.%I for select to authenticated using (exists(select 1 from public.memberships m where m.org_id=%I.org_id and m.user_id=(select auth.uid())))',t,t);
 end loop;
end $$;
grant select on public.knowledge_sources,public.knowledge_chunks,public.agent_versions,public.agent_publications,public.agent_runs,public.support_requests to authenticated;
grant select(id,org_id,agent_id,label,created_at,revoked_at,expires_at) on public.agent_api_keys to authenticated;

create function agynexa_private.studio_mutate(a uuid, operation text, payload jsonb) returns jsonb
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
  if ag.model='qwen/qwen3.8-27b' then raise exception 'evaluation_model_only' using errcode='22023'; end if;
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
  if support.status='pending' then
   update public.support_requests set status=case when expires_at<now() then 'expired' else payload->>'decision' end,decided_at=now() where id=support.id returning * into support;
  elsif support.status<>payload->>'decision' then raise exception 'request_conflict' using errcode='23505'; end if;
  return to_jsonb(support);
 elsif operation='cancel' then
  update public.agent_runs set status='cancelled',finished_at=now() where id=(payload->>'runId')::uuid and agent_id=a and status='running';
  return jsonb_build_object('cancelled',true);
 end if;
 raise exception 'invalid_operation' using errcode='22023';
end $$;
revoke all on function agynexa_private.studio_mutate(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function agynexa_private.studio_mutate(uuid,text,jsonb) to authenticated;
create function public.studio_mutate(agent uuid,operation text,payload jsonb) returns jsonb language sql security invoker set search_path='' as $$select agynexa_private.studio_mutate(agent,operation,payload)$$;
revoke all on function public.studio_mutate(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.studio_mutate(uuid,text,jsonb) to authenticated;

-- Retrieval returns only currently active chunks from the selected agent and snapshot.
create function public.search_agent_knowledge(workspace uuid,agent uuid,source_ids uuid[],query text) returns table(id uuid,source_id uuid,title text,content text,score real)
language sql security invoker set search_path='' as $$
 select c.id,c.source_id,s.title,c.content,ts_rank_cd(c.search_terms,websearch_to_tsquery('simple',query)) as score
 from public.knowledge_chunks c join public.knowledge_sources s on s.id=c.source_id and s.org_id=c.org_id and s.agent_id=c.agent_id
 where c.org_id=workspace and c.agent_id=agent and c.source_id=any(source_ids) and s.status='ready'
 and c.search_terms @@ websearch_to_tsquery('simple',query)
 order by score desc,c.ordinal limit 6
$$;
revoke all on function public.search_agent_knowledge(uuid,uuid,uuid[],text) from public,anon,authenticated;
grant execute on function public.search_agent_knowledge(uuid,uuid,uuid[],text) to authenticated,service_role;

-- Atomic concurrency lease. Runs finish inside the request, never fire-and-forget.
create function public.start_agent_run(run jsonb, concurrency_limit integer) returns jsonb language plpgsql security invoker set search_path='' as $$
declare existing public.agent_runs; org uuid:=(run->>'org_id')::uuid;
begin
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('runs:'||org::text,0));
 update public.agent_runs set status='failed',error_code='execution_timeout',finished_at=now() where org_id=org and status='running' and expires_at<now();
 select * into existing from public.agent_runs where agent_id=(run->>'agent_id')::uuid and access_kind=run->>'access_kind' and request_key=(run->>'request_key')::uuid;
 if existing.id is not null then
  if existing.input_hash<>run->>'input_hash' then raise exception 'request_conflict' using errcode='23505'; end if;
  return jsonb_build_object('existing',true,'run',to_jsonb(existing));
 end if;
 if (select count(*) from public.agent_runs where org_id=org and status='running')>=greatest(1,least(concurrency_limit,20)) then raise exception 'concurrency_limit' using errcode='53300'; end if;
 insert into public.agent_runs(id,org_id,agent_id,conversation_id,actor_id,access_kind,request_key,input_hash,snapshot,model,version_id,question)
 values((run->>'id')::uuid,org,(run->>'agent_id')::uuid,(run->>'conversation_id')::uuid,(run->>'actor_id')::uuid,run->>'access_kind',(run->>'request_key')::uuid,run->>'input_hash',run->'snapshot',run->>'model',(run->>'version_id')::uuid,run->>'question') returning * into existing;
 return jsonb_build_object('existing',false,'run',to_jsonb(existing));
end $$;
revoke all on function public.start_agent_run(jsonb,integer) from public,anon,authenticated;
grant execute on function public.start_agent_run(jsonb,integer) to service_role;

-- Widget bearer tokens are random, hashed, short-lived and invalidated on republish.
create function public.studio_widget_session(operation text,token_hash text,agent uuid default null,generation integer default null) returns jsonb language plpgsql security invoker set search_path='' as $$
declare row agynexa_private.widget_sessions;
begin
 if operation='create' then
  delete from agynexa_private.widget_sessions where expires_at<now();
  insert into agynexa_private.widget_sessions(token_hash,agent_id,generation) values(token_hash,agent,generation) returning * into row;
 elsif operation='read' then
  select * into row from agynexa_private.widget_sessions w where w.token_hash=studio_widget_session.token_hash and expires_at>now();
 end if;
 return to_jsonb(row);
end $$;
revoke all on function public.studio_widget_session(text,text,uuid,integer) from public,anon,authenticated;
grant execute on function public.studio_widget_session(text,text,uuid,integer) to service_role;
create table public.studio_evaluators(user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.studio_evaluators enable row level security;
revoke all on public.studio_evaluators from public,anon,authenticated;
grant all on public.studio_evaluators to service_role;
create function public.finish_agent_run(run_id uuid,result jsonb) returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.agent_runs; sid uuid; proposal jsonb;
begin
 select * into r from public.agent_runs where id=run_id;
 if r.id is null then raise exception 'not_found'; end if;
 perform 1 from public.agents where id=r.agent_id for update;
 select * into r from public.agent_runs where id=run_id for update;
 if r.status<>'running' then return to_jsonb(r); end if;
 if r.expires_at<now() then result:=jsonb_build_object('status','failed','error_code','execution_timeout'); end if;
 if result->>'status'='succeeded' then
  if exists(select 1 from jsonb_array_elements(coalesce(result->'citations','[]')) c where not exists(select 1 from public.knowledge_sources s where s.id=(c->>'sourceId')::uuid and s.agent_id=r.agent_id and s.status='ready')) then
   result:=jsonb_build_object('status','cancelled','error_code','source_removed');
  end if;
  if r.access_kind<>'studio' and not exists(select 1 from public.agent_publications p where p.agent_id=r.agent_id and p.active and p.version_id=r.version_id and p.generation=(r.snapshot->>'generation')::integer) then
   result:=jsonb_build_object('status','cancelled','error_code','unpublished');
  end if;
  if r.access_kind='api' and not exists(select 1 from public.agent_api_keys k where k.id=(r.snapshot->>'keyId')::uuid and k.revoked_at is null and k.expires_at>now()) then result:=jsonb_build_object('status','cancelled','error_code','key_revoked'); end if;
 end if;
 update public.agent_runs set status=result->>'status',answer=result->>'answer',citations=coalesce(result->'citations','[]'),usage=coalesce(result->'usage','{}'),error_code=result->>'error_code',finished_at=now() where id=run_id returning * into r;
 proposal:=result->'support';
 if r.status='succeeded' and r.access_kind='studio' and r.snapshot->>'template'='serviceflow' and proposal->>'propose'='true' then
  insert into public.support_requests(org_id,agent_id,run_id,requested_by,title,details) values(r.org_id,r.agent_id,r.id,r.actor_id,proposal->>'title',proposal->>'details') on conflict(run_id) do nothing;
 end if;
 return to_jsonb(r);
end $$;
revoke all on function public.finish_agent_run(uuid,jsonb) from public,anon,authenticated;
grant execute on function public.finish_agent_run(uuid,jsonb) to service_role;
-- Needed by the server-only finalization transaction's agent row lock.
grant select,update on public.agents to service_role;
