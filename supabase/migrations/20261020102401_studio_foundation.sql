-- Agent Studio B. Additive; reviewed/applied locally only. No hosted authorization.
create table public.organizations (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null unique references auth.users(id) on delete cascade,
 name text not null default 'My workspace' check (char_length(name) between 1 and 100),
 created_at timestamptz not null default now()
);
create table public.memberships (
 org_id uuid not null references public.organizations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null check (role = 'owner'),
 created_at timestamptz not null default now(),
 primary key (org_id,user_id)
);
create index memberships_user_org on public.memberships(user_id,org_id);
create table public.agents (
 id uuid primary key default gen_random_uuid(),
 org_id uuid not null references public.organizations(id) on delete cascade,
 created_by uuid not null references auth.users(id),
 request_key uuid not null,
 template text not null check (template in ('knowledgegrid','serviceflow')),
 name text not null check (char_length(trim(name)) between 1 and 100),
 instructions text not null check (char_length(trim(instructions)) between 1 and 6000),
 language text not null check (language in ('ar','en')),
 model text not null check (model in ('openai/gpt-oss-120b','qwen/qwen3.8-27b')),
 revision integer not null default 1,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(org_id,id),
 unique(org_id,request_key)
);
create index agents_org_created on public.agents(org_id,created_at desc);
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.agents enable row level security;
revoke all on public.organizations, public.memberships, public.agents from public, anon, authenticated;
grant select on public.organizations, public.memberships, public.agents to authenticated;
grant insert(org_id,created_by,request_key,template,name,instructions,language,model) on public.agents to authenticated;
grant update(name,instructions,language,model) on public.agents to authenticated;

create policy memberships_read_self on public.memberships for select to authenticated
 using (user_id=(select auth.uid()) and (select agynexa_private.current_session_active()));
create policy organizations_read_member on public.organizations for select to authenticated
 using (exists(select 1 from public.memberships m where m.org_id=id and m.user_id=(select auth.uid())));
create policy agents_read_member on public.agents for select to authenticated
 using (exists(select 1 from public.memberships m where m.org_id=agents.org_id and m.user_id=(select auth.uid())));
create policy agents_create_owner on public.agents for insert to authenticated
 with check (created_by=(select auth.uid()) and exists(select 1 from public.memberships m where m.org_id=agents.org_id and m.user_id=(select auth.uid()) and m.role='owner'));
create policy agents_update_owner on public.agents for update to authenticated
 using (exists(select 1 from public.memberships m where m.org_id=agents.org_id and m.user_id=(select auth.uid()) and m.role='owner'))
 with check (exists(select 1 from public.memberships m where m.org_id=agents.org_id and m.user_id=(select auth.uid()) and m.role='owner'));

-- The sole privileged bootstrap has no caller-supplied identity or org_id.
-- An invoker wrapper exposes it to PostgREST without a public definer function.
create function agynexa_private.ensure_owner_workspace() returns uuid
language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); workspace uuid;
begin
 if actor is null or not agynexa_private.current_session_active() then
  raise exception 'Sign in required' using errcode='42501';
 end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('studio:'||actor::text,0));
 insert into public.organizations(owner_id) values(actor) on conflict(owner_id) do nothing;
 select id into workspace from public.organizations where owner_id=actor;
 insert into public.memberships(org_id,user_id,role) values(workspace,actor,'owner') on conflict do nothing;
 return workspace;
end;
$$;
revoke all on function agynexa_private.ensure_owner_workspace() from public, anon, authenticated;
grant execute on function agynexa_private.ensure_owner_workspace() to authenticated;
create function public.initialize_workspace() returns uuid
language sql security invoker set search_path = '' as $$
 select agynexa_private.ensure_owner_workspace();
$$;
revoke all on function public.initialize_workspace() from public, anon, authenticated;
grant execute on function public.initialize_workspace() to authenticated;

create function agynexa_private.update_agent_revision() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 new.revision := old.revision + 1;
 new.updated_at := now();
 return new;
end;
$$;
revoke all on function agynexa_private.update_agent_revision() from public, anon, authenticated;
create trigger agent_revision before update on public.agents for each row execute function agynexa_private.update_agent_revision();
