-- Owner-authorized OpenAI Studio upgrade. Historical run/audit records are retained.
alter table public.agents drop constraint if exists agents_model_check;
alter table public.agents add constraint agents_model_check check(model in ('gpt-6.1-terra','openai/gpt-oss-120b','openai/gpt-oss-20b','qwen/qwen3.8-27b'));
-- Legacy IDs remain readable for rollback; the application normalizes execution to Terra.
alter table public.agents add column sector text not null default 'general' check(sector in ('general','customer-service','sales','operations','finance','hr','procurement','healthcare','education','real-estate','technology'));
alter table public.agents add column tools jsonb not null default '{"webSearch":false,"codeInterpreter":false}'::jsonb check(jsonb_typeof(tools)='object' and tools ?& array['webSearch','codeInterpreter'] and jsonb_typeof(tools->'webSearch')='boolean' and jsonb_typeof(tools->'codeInterpreter')='boolean' and (tools-'webSearch'-'codeInterpreter')='{}'::jsonb);
grant insert(sector,tools),update(sector,tools) on public.agents to authenticated;

create table public.studio_provider_credentials(
 org_id uuid primary key references public.organizations(id),created_by uuid not null references auth.users(id),
 encrypted_key text not null check(char_length(encrypted_key)<2048),updated_at timestamptz not null default now()
);
alter table public.studio_provider_credentials enable row level security;
revoke all on public.studio_provider_credentials from public,anon,authenticated;
grant all on public.studio_provider_credentials to service_role;

create table public.agent_activations(
 id uuid primary key default gen_random_uuid(),agent_id uuid not null unique,org_id uuid not null,
 requested_by uuid not null references auth.users(id),request_key uuid not null,
 status text not null default 'requested' check(status in ('requested','active')),
 agreement_reference text,activated_by uuid references auth.users(id),requested_at timestamptz not null default now(),activated_at timestamptz,
 foreign key(org_id,agent_id) references public.agents(org_id,id),
 check(status<>'active' or (activated_by is not null and activated_at is not null and agreement_reference is not null and char_length(trim(agreement_reference))>0))
);
alter table public.agent_activations enable row level security;
revoke all on public.agent_activations from public,anon,authenticated;
grant all on public.agent_activations to service_role;
-- Defend the public RPC path as well as the Next.js route. No self-service activation grants.
create function agynexa_private.guard_agent_activation() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.active and (not exists(select 1 from public.agent_activations a where a.agent_id=new.agent_id and a.org_id=new.org_id and a.status='active') or not exists(select 1 from public.studio_provider_credentials c where c.org_id=new.org_id)) then
  raise exception 'activation_required' using errcode='42501';
 end if;
 return new;
end;
$$;
revoke all on function agynexa_private.guard_agent_activation() from public,anon,authenticated;
create trigger agent_activation_guard before insert or update on public.agent_publications for each row execute function agynexa_private.guard_agent_activation();

create or replace function agynexa_private.validate_work_action(k text,p jsonb) returns void
language plpgsql security invoker set search_path='' as $$
declare
 required_keys text[];
 allowed_keys text[];
 field_name text;
 tools_value jsonb;
begin
 required_keys := case k
  when 'agent.create' then array['name','instructions','language','template','model','builder']
  when 'project.create' then array['name','description']
  when 'project.set_status' then array['projectId','status','expectedRevision']
  when 'task.create' then array['projectId','title','description']
  when 'task.set_status' then array['projectId','taskId','status','expectedRevision']
  else null
 end;
 if required_keys is null then raise exception 'invalid_action'; end if;
 if jsonb_typeof(p) is distinct from 'object' then raise exception 'invalid_input'; end if;
 allowed_keys := required_keys;
 if k='agent.create' then allowed_keys := allowed_keys || array['sector','tools']; end if;
 -- Required keys remain exact. Sector and tools are optional for immutable legacy proposals.
 if not (p ?& required_keys) then raise exception 'invalid_input'; end if;
 if exists(select 1 from jsonb_object_keys(p) as supplied(key) where not (supplied.key=any(allowed_keys))) then
  raise exception 'invalid_input';
 end if;
 foreach field_name in array required_keys loop
  if field_name not in ('builder','expectedRevision') and jsonb_typeof(p->field_name) is distinct from 'string' then
   raise exception 'invalid_input';
  end if;
 end loop;
 if k in ('agent.create','project.create') and char_length(trim(p->>'name')) not between 1 and 100 then raise exception 'invalid_input'; end if;
 if k='task.create' and char_length(trim(p->>'title')) not between 1 and 100 then raise exception 'invalid_input'; end if;
 if p ? 'description' and char_length(p->>'description')>3000 then raise exception 'invalid_input'; end if;
 if p ? 'projectId' and (p->>'projectId') !~ '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$' then raise exception 'invalid_input'; end if;
 if p ? 'taskId' and (p->>'taskId') !~ '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$' then raise exception 'invalid_input'; end if;
 if p ? 'expectedRevision' and (jsonb_typeof(p->'expectedRevision') is distinct from 'number' or (p->>'expectedRevision') !~ '^[1-9][0-9]{0,8}$') then raise exception 'invalid_input'; end if;
 if k='project.set_status' and p->>'status' not in ('active','paused','completed') then raise exception 'invalid_input'; end if;
 if k='task.set_status' and p->>'status' not in ('todo','in_progress','blocked','done') then raise exception 'invalid_input'; end if;
 if k='agent.create' then
  if char_length(trim(p->>'instructions')) not between 1 and 6000
   or p->>'language' not in ('en','ar')
   or p->>'template' not in ('knowledgegrid','serviceflow')
   or p->>'model' not in ('gpt-6.1-terra','openai/gpt-oss-120b','openai/gpt-oss-20b','qwen/qwen3.8-27b')
   or p->'builder' is distinct from 'true'::jsonb then
   raise exception 'invalid_input';
  end if;
  if p ? 'sector' then
   if jsonb_typeof(p->'sector') is distinct from 'string'
    or p->>'sector' not in ('general','customer-service','sales','operations','finance','hr','procurement','healthcare','education','real-estate','technology') then
    raise exception 'invalid_input';
   end if;
  end if;
  if p ? 'tools' then
   tools_value := p->'tools';
   if jsonb_typeof(tools_value) is distinct from 'object' then raise exception 'invalid_input'; end if;
   if not (tools_value ?& array['webSearch','codeInterpreter'])
    or jsonb_typeof(tools_value->'webSearch') is distinct from 'boolean'
    or jsonb_typeof(tools_value->'codeInterpreter') is distinct from 'boolean'
    or (tools_value-'webSearch'-'codeInterpreter')<>'{}'::jsonb then
    raise exception 'invalid_input';
   end if;
  end if;
 end if;
end;
$$;
revoke all on function agynexa_private.validate_work_action(text,jsonb) from public,anon,authenticated;

create or replace function agynexa_private.apply_work(p_action_id uuid,p_version integer,p_snapshot_hash text) returns jsonb language plpgsql security definer set search_path='' as $$
declare workspace uuid:=agynexa_private.studio_work_org();actor uuid:=auth.uid();a public.studio_work_actions;p jsonb;entity uuid;project uuid;task uuid;r jsonb;existing public.agents;begin
 select * into a from public.studio_work_actions where id=p_action_id and org_id=workspace and created_by=actor for update;
 if a.id is null then raise exception 'not_found';end if;
 if p_version is distinct from a.version or p_snapshot_hash is distinct from a.snapshot_hash then raise exception 'review_conflict';end if;
 if a.status='applied' then return to_jsonb(a);end if;
 p:=a.payload;perform agynexa_private.validate_work_action(a.kind,p);
 if a.kind='project.create' then
  insert into public.studio_projects(org_id,created_by,name,description) values(workspace,actor,p->>'name',p->>'description') returning id into entity;project:=entity;
 elsif a.kind='project.set_status' then
  project:=(p->>'projectId')::uuid;perform 1 from public.studio_projects where id=project and org_id=workspace and created_by=actor for update;if not found then raise exception 'not_found';end if;
  update public.studio_projects set status=p->>'status',revision=revision+1,updated_at=now() where id=project and revision=(p->>'expectedRevision')::integer returning id into entity;if not found then raise exception 'revision_conflict';end if;
 elsif a.kind='task.create' then
  project:=(p->>'projectId')::uuid;perform 1 from public.studio_projects where id=project and org_id=workspace and created_by=actor for update;if not found then raise exception 'not_found';end if;
  insert into public.studio_tasks(org_id,created_by,project_id,title,description) values(workspace,actor,project,p->>'title',p->>'description') returning id into entity;task:=entity;
 elsif a.kind='task.set_status' then
  project:=(p->>'projectId')::uuid;task:=(p->>'taskId')::uuid;
  perform 1 from public.studio_tasks where id=task and project_id=project and org_id=workspace and created_by=actor for update;if not found then raise exception 'not_found';end if;
  update public.studio_tasks set status=p->>'status',revision=revision+1,updated_at=now() where id=task and revision=(p->>'expectedRevision')::integer returning id into entity;if not found then raise exception 'revision_conflict';end if;
 elsif a.kind='agent.create' then
  -- Same idempotency key and settings semantics as the existing agents API.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('studio-agent:'||workspace::text||':'||a.request_key::text,0));
  select * into existing from public.agents where org_id=workspace and request_key=a.request_key;
  if existing.id is not null then
   if existing.created_by<>actor or existing.name<>p->>'name' or existing.instructions<>p->>'instructions' or existing.language<>p->>'language' or existing.template<>p->>'template' or existing.model<>p->>'model' or existing.chat_profile<>'customer_v1' or existing.sector<>coalesce(p->>'sector','general') or existing.tools<>coalesce(p->'tools','{"webSearch":false,"codeInterpreter":false}'::jsonb) then raise exception 'request_conflict';end if;entity:=existing.id;
  else
   insert into public.agents(org_id,created_by,request_key,name,instructions,language,template,model,chat_profile,sector,tools) values(workspace,actor,a.request_key,p->>'name',p->>'instructions',p->>'language',p->>'template',p->>'model','customer_v1',coalesce(p->>'sector','general'),coalesce(p->'tools','{"webSearch":false,"codeInterpreter":false}'::jsonb)) returning id into entity;
  end if;
 else raise exception 'invalid_action';end if;
 r:=jsonb_build_object('kind',a.kind,'id',entity);if project is not null then r:=r||jsonb_build_object('projectId',project);end if;
 if project is not null then insert into public.studio_project_activity(org_id,created_by,project_id,task_id,action_id,kind,summary) values(workspace,actor,project,task,a.id,a.kind,case a.kind when 'project.create' then 'Project created' when 'project.set_status' then 'Project status: '||(p->>'status') when 'task.create' then 'Task created' else 'Task status: '||(p->>'status') end);end if;
 update public.studio_work_actions set status='applied',result=r,applied_at=now() where id=a.id returning * into a;
 insert into public.studio_work_audit(org_id,created_by,action_id,event,snapshot_hash) values(workspace,actor,a.id,'applied',a.snapshot_hash);
 return to_jsonb(a);
end;
$$;
revoke all on function agynexa_private.apply_work(uuid,integer,text) from public,anon,authenticated;
grant execute on function agynexa_private.apply_work(uuid,integer,text) to authenticated;

-- Private and activated custom agents may work from task input without a knowledge source.
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
  if cardinality(source_list)=0 and ag.chat_profile<>'customer_v1' then raise exception 'sources_required' using errcode='22023'; end if;
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
end;
$$;


-- Removing a customer's API connection or withdrawing activation immediately closes live entry points.
create function agynexa_private.revoke_agent_activation() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if tg_table_name='studio_provider_credentials' then
  update public.agent_publications set active=false,generation=generation+1,updated_at=now() where org_id=old.org_id and active;
  update public.agent_runs set status='cancelled',finished_at=now(),error_code='customer_credentials_required' where org_id=old.org_id and access_kind<>'studio' and status='running';
 elsif new.status<>'active' and old.status='active' then
  update public.agent_publications set active=false,generation=generation+1,updated_at=now() where agent_id=new.agent_id and active;
  update public.agent_runs set status='cancelled',finished_at=now(),error_code='activation_required' where agent_id=new.agent_id and access_kind<>'studio' and status='running';
 end if;
 return null;
end;
$$;
revoke all on function agynexa_private.revoke_agent_activation() from public,anon,authenticated;
create trigger customer_provider_disconnect after delete on public.studio_provider_credentials for each row execute function agynexa_private.revoke_agent_activation();
create trigger customer_activation_withdrawn after update on public.agent_activations for each row execute function agynexa_private.revoke_agent_activation();
