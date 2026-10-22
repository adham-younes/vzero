-- Additive owner-scoped saved work. No mail/hosted transport changes.
create table public.studio_projects(
 id uuid primary key default gen_random_uuid(),org_id uuid not null references public.organizations(id),created_by uuid not null references auth.users(id),
 name text not null check(char_length(trim(name)) between 1 and 100),description text not null check(char_length(description)<=3000),
 status text not null default 'active' check(status in ('active','paused','completed')),revision integer not null default 1 check(revision>0),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(org_id,id)
);
create table public.studio_tasks(
 id uuid primary key default gen_random_uuid(),org_id uuid not null,created_by uuid not null references auth.users(id),project_id uuid not null,
 title text not null check(char_length(trim(title)) between 1 and 100),description text not null check(char_length(description)<=3000),
 status text not null default 'todo' check(status in ('todo','in_progress','blocked','done')),revision integer not null default 1 check(revision>0),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(org_id,project_id,id),
 foreign key(org_id,project_id) references public.studio_projects(org_id,id)
);
create table public.studio_work_actions(
 id uuid primary key default gen_random_uuid(),org_id uuid not null references public.organizations(id),created_by uuid not null references auth.users(id),request_key uuid not null,
 kind text not null check(kind in ('agent.create','project.create','project.set_status','task.create','task.set_status')),
 payload jsonb not null check(jsonb_typeof(payload)='object'),version integer not null default 1 check(version=1),snapshot_hash text not null check(snapshot_hash ~ '^[a-f0-9]{64}$'),
 status text not null default 'proposed' check(status in ('proposed','applied')),result jsonb,created_at timestamptz not null default now(),applied_at timestamptz,
 unique(org_id,created_by,request_key),check((status='proposed' and result is null and applied_at is null) or (status='applied' and result is not null and applied_at is not null))
);
create table public.studio_project_activity(
 id uuid primary key default gen_random_uuid(),org_id uuid not null,created_by uuid not null references auth.users(id),project_id uuid not null,task_id uuid,
 action_id uuid not null unique references public.studio_work_actions(id),kind text not null,summary text not null check(char_length(summary)<=300),created_at timestamptz not null default now(),
 foreign key(org_id,project_id) references public.studio_projects(org_id,id),foreign key(org_id,project_id,task_id) references public.studio_tasks(org_id,project_id,id)
);
create table public.studio_work_audit(
 id uuid primary key default gen_random_uuid(),org_id uuid not null references public.organizations(id),created_by uuid not null references auth.users(id),
 action_id uuid not null references public.studio_work_actions(id),event text not null check(event in ('proposed','applied')),snapshot_hash text not null,created_at timestamptz not null default now(),unique(action_id,event)
);
create index studio_projects_owner_page on public.studio_projects(org_id,created_at desc,id desc);
create index studio_tasks_project_page on public.studio_tasks(org_id,project_id,created_at desc,id desc);
create index studio_project_activity_page on public.studio_project_activity(org_id,project_id,created_at desc,id desc);
create index studio_work_actions_owner_page on public.studio_work_actions(org_id,created_by,created_at desc,id desc);
do $$declare t text;begin foreach t in array array['studio_projects','studio_tasks','studio_work_actions','studio_project_activity','studio_work_audit'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from public,anon,authenticated',t);
 execute format('grant select on public.%I to authenticated',t);
 execute format('create policy owner_read on public.%I for select to authenticated using (created_by=(select auth.uid()) and (select agynexa_private.current_session_active()) and exists(select 1 from public.memberships m where m.org_id=%I.org_id and m.user_id=(select auth.uid()) and m.role=''owner''))',t,t);
end loop;end $$;

create function agynexa_private.studio_work_org() returns uuid language plpgsql security definer set search_path='' as $$
declare workspace uuid;begin
 if auth.uid() is null or not agynexa_private.current_session_active() then raise exception 'sign_in_required' using errcode='42501';end if;
 select o.id into workspace from public.organizations o join public.memberships m on m.org_id=o.id where o.owner_id=auth.uid() and m.user_id=auth.uid() and m.role='owner';
 if workspace is null then raise exception 'workspace_required';end if;return workspace;
end $$;
revoke all on function agynexa_private.studio_work_org() from public,anon,authenticated;
grant execute on function agynexa_private.studio_work_org() to authenticated;

-- Validate again inside the privileged boundary: browser clients can call RPC directly.
create function agynexa_private.validate_work_action(k text,p jsonb) returns void language plpgsql security invoker set search_path='' as $$
declare allowed text[];field_name text;begin
 allowed:=case k when 'agent.create' then array['name','instructions','language','template','model','builder'] when 'project.create' then array['name','description'] when 'project.set_status' then array['projectId','status','expectedRevision'] when 'task.create' then array['projectId','title','description'] when 'task.set_status' then array['projectId','taskId','status','expectedRevision'] else null end;
 if allowed is null then raise exception 'invalid_action';end if;
 if jsonb_typeof(p) is distinct from 'object' or (select count(*) from jsonb_object_keys(p))<>cardinality(allowed) or exists(select 1 from jsonb_object_keys(p) x where not x=any(allowed)) then raise exception 'invalid_input';end if;
 foreach field_name in array allowed loop
  if field_name not in ('builder','expectedRevision') and jsonb_typeof(p->field_name) is distinct from 'string' then raise exception 'invalid_input';end if;
 end loop;
 if k in ('agent.create','project.create') and char_length(trim(p->>'name')) not between 1 and 100 then raise exception 'invalid_input';end if;
 if k='task.create' and char_length(trim(p->>'title')) not between 1 and 100 then raise exception 'invalid_input';end if;
 if p ? 'description' and char_length(p->>'description')>3000 then raise exception 'invalid_input';end if;
 if p ? 'projectId' and (p->>'projectId') !~ '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$' then raise exception 'invalid_input';end if;
 if p ? 'taskId' and (p->>'taskId') !~ '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$' then raise exception 'invalid_input';end if;
 if p ? 'expectedRevision' and (jsonb_typeof(p->'expectedRevision') is distinct from 'number' or (p->>'expectedRevision') !~ '^[1-9][0-9]{0,8}$') then raise exception 'invalid_input';end if;
 if k='project.set_status' and p->>'status' not in ('active','paused','completed') then raise exception 'invalid_input';end if;
 if k='task.set_status' and p->>'status' not in ('todo','in_progress','blocked','done') then raise exception 'invalid_input';end if;
 if k='agent.create' and (char_length(trim(p->>'instructions')) not between 1 and 6000 or p->>'language' not in ('en','ar') or p->>'template' not in ('knowledgegrid','serviceflow') or p->>'model' not in ('openai/gpt-oss-20b','openai/gpt-oss-120b','qwen/qwen3.8-27b') or p->'builder' is distinct from 'true'::jsonb) then raise exception 'invalid_input';end if;
end $$;
revoke all on function agynexa_private.validate_work_action(text,jsonb) from public,anon,authenticated;

create function agynexa_private.propose_work(p_request_key uuid,p_kind text,p_payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare workspace uuid:=agynexa_private.studio_work_org();actor uuid:=auth.uid();a public.studio_work_actions;begin
 perform agynexa_private.validate_work_action(p_kind,p_payload);
 if p_request_key is null then raise exception 'invalid_input';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('studio-work:'||workspace::text||':'||p_request_key::text,0));
 select * into a from public.studio_work_actions where org_id=workspace and created_by=actor and request_key=p_request_key;
 if a.id is not null then if a.kind<>p_kind or a.payload<>p_payload then raise exception 'request_conflict';end if;return to_jsonb(a);end if;
 if p_payload ? 'projectId' and not exists(select 1 from public.studio_projects where org_id=workspace and created_by=actor and id=(p_payload->>'projectId')::uuid) then raise exception 'not_found';end if;
 if p_payload ? 'taskId' and not exists(select 1 from public.studio_tasks where org_id=workspace and created_by=actor and project_id=(p_payload->>'projectId')::uuid and id=(p_payload->>'taskId')::uuid) then raise exception 'not_found';end if;
 insert into public.studio_work_actions(org_id,created_by,request_key,kind,payload,snapshot_hash) values(workspace,actor,p_request_key,p_kind,p_payload,pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(jsonb_build_object('kind',p_kind,'payload',p_payload,'version',1)::text,'UTF8')),'hex')) returning * into a;
 insert into public.studio_work_audit(org_id,created_by,action_id,event,snapshot_hash) values(workspace,actor,a.id,'proposed',a.snapshot_hash);
 return to_jsonb(a);
end $$;
revoke all on function agynexa_private.propose_work(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function agynexa_private.propose_work(uuid,text,jsonb) to authenticated;
create function public.studio_propose_work(p_request_key uuid,p_kind text,p_payload jsonb) returns jsonb language sql security invoker set search_path='' as $$select agynexa_private.propose_work(p_request_key,p_kind,p_payload)$$;
revoke all on function public.studio_propose_work(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.studio_propose_work(uuid,text,jsonb) to authenticated;

create function agynexa_private.apply_work(p_action_id uuid,p_version integer,p_snapshot_hash text) returns jsonb language plpgsql security definer set search_path='' as $$
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
   if existing.created_by<>actor or existing.name<>p->>'name' or existing.instructions<>p->>'instructions' or existing.language<>p->>'language' or existing.template<>p->>'template' or existing.model<>p->>'model' or existing.chat_profile<>'customer_v1' then raise exception 'request_conflict';end if;entity:=existing.id;
  else
   insert into public.agents(org_id,created_by,request_key,name,instructions,language,template,model,chat_profile) values(workspace,actor,a.request_key,p->>'name',p->>'instructions',p->>'language',p->>'template',p->>'model','customer_v1') returning id into entity;
  end if;
 else raise exception 'invalid_action';end if;
 r:=jsonb_build_object('kind',a.kind,'id',entity);if project is not null then r:=r||jsonb_build_object('projectId',project);end if;
 if project is not null then insert into public.studio_project_activity(org_id,created_by,project_id,task_id,action_id,kind,summary) values(workspace,actor,project,task,a.id,a.kind,case a.kind when 'project.create' then 'Project created' when 'project.set_status' then 'Project status: '||(p->>'status') when 'task.create' then 'Task created' else 'Task status: '||(p->>'status') end);end if;
 update public.studio_work_actions set status='applied',result=r,applied_at=now() where id=a.id returning * into a;
 insert into public.studio_work_audit(org_id,created_by,action_id,event,snapshot_hash) values(workspace,actor,a.id,'applied',a.snapshot_hash);
 return to_jsonb(a);
end $$;
revoke all on function agynexa_private.apply_work(uuid,integer,text) from public,anon,authenticated;
grant execute on function agynexa_private.apply_work(uuid,integer,text) to authenticated;
create function public.studio_apply_work(p_action_id uuid,p_version integer,p_snapshot_hash text) returns jsonb language sql security invoker set search_path='' as $$select agynexa_private.apply_work(p_action_id,p_version,p_snapshot_hash)$$;
revoke all on function public.studio_apply_work(uuid,integer,text) from public,anon,authenticated;
grant execute on function public.studio_apply_work(uuid,integer,text) to authenticated;
