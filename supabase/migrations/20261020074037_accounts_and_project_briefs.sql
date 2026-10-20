-- Scoped stage-5 implementation. The twenty-table review draft remains unexecuted.
create schema if not exists agynexa_private;
revoke all on schema agynexa_private from public, anon, authenticated;
grant usage on schema agynexa_private to authenticated, service_role;

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (char_length(display_name) between 1 and 100),
 created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;

-- Check live sessions as well as signed JWT ownership. Revoked sessions lose data access.
create function agynexa_private.current_session_active() returns boolean
language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists (
  select 1 from auth.sessions s where s.user_id=auth.uid()
  and s.id::text = (auth.jwt()->>'session_id')
 );
$$;
revoke all on function agynexa_private.current_session_active() from public, anon;
grant execute on function agynexa_private.current_session_active() to authenticated;
create policy profiles_read_own on public.profiles for select to authenticated
 using (id=(select auth.uid()) and (select agynexa_private.current_session_active()));

-- Trigger-only bootstrap: NEW.id is supplied by Auth, never by a role in request metadata.
create function agynexa_private.create_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles(id,display_name) values(new.id,
  coalesce(nullif(left(trim(new.raw_user_meta_data->>'display_name'),100),''),'AGYNEXA user'));
 return new;
end;
$$;
revoke all on function agynexa_private.create_profile() from public, anon, authenticated;
create trigger agynexa_create_profile after insert on auth.users for each row execute function agynexa_private.create_profile();
insert into public.profiles(id,display_name) select id,coalesce(nullif(left(trim(raw_user_meta_data->>'display_name'),100),''),'AGYNEXA user') from auth.users;

create table public.project_briefs (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 request_key uuid not null,
 organization text not null check(char_length(organization) between 1 and 100),
 contact_email text not null check(char_length(contact_email) between 3 and 254),
 service text not null check(char_length(service) between 1 and 200),
 problem text not null check(char_length(problem) between 1 and 1500),
 sources text not null check(char_length(sources) between 1 and 1500),
 acceptance text not null check(char_length(acceptance) between 1 and 1500),
 consent_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 unique(owner_id,request_key)
);
create index project_briefs_owner_created on public.project_briefs(owner_id,created_at desc);
alter table public.project_briefs enable row level security;
revoke all on public.project_briefs from public, anon, authenticated;
grant select, delete on public.project_briefs to authenticated;
grant insert(owner_id,request_key,organization,contact_email,service,problem,sources,acceptance) on public.project_briefs to authenticated;
create policy briefs_read_own on public.project_briefs for select to authenticated
 using(owner_id=(select auth.uid()) and (select agynexa_private.current_session_active()));
create policy briefs_insert_own on public.project_briefs for insert to authenticated
 with check(owner_id=(select auth.uid()) and (select agynexa_private.current_session_active()));
create policy briefs_delete_own on public.project_briefs for delete to authenticated
 using(owner_id=(select auth.uid()) and (select agynexa_private.current_session_active()));

create function agynexa_private.limit_briefs() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 if new.owner_id is distinct from auth.uid() then raise exception 'Invalid owner'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.owner_id::text,0));
 -- Let unique-key handling return the original result for retries, even at quota.
 if exists(select 1 from public.project_briefs where owner_id=new.owner_id and request_key=new.request_key) then return new; end if;
 if (select count(*) from public.project_briefs where owner_id=new.owner_id and created_at>now()-interval '24 hours')>=20 then
  raise exception 'Brief quota exceeded';
 end if;
 return new;
end;
$$;
revoke all on function agynexa_private.limit_briefs() from public, anon, authenticated;
create trigger agynexa_limit_briefs before insert on public.project_briefs for each row execute function agynexa_private.limit_briefs();

create table agynexa_private.auth_rate_limits (
 bucket_key text not null check(bucket_key ~ '^[a-f0-9]{64}$'),
 window_start timestamptz not null,
 attempts integer not null,
 primary key(bucket_key,window_start)
);
alter table agynexa_private.auth_rate_limits enable row level security;
revoke all on agynexa_private.auth_rate_limits from public, anon, authenticated;
grant select,insert,update,delete on agynexa_private.auth_rate_limits to service_role;
create function public.consume_auth_limit(bucket_key text,max_attempts integer) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare used integer;
begin
 if max_attempts<1 or max_attempts>100 then return false; end if;
 delete from agynexa_private.auth_rate_limits where window_start<now()-interval '2 hours';
 insert into agynexa_private.auth_rate_limits as limits(bucket_key,window_start,attempts)
 values(bucket_key,date_trunc('hour',now()),1)
 on conflict on constraint auth_rate_limits_pkey do update set attempts=limits.attempts+1
 returning attempts into used;
 return used<=max_attempts;
end;
$$;
revoke all on function public.consume_auth_limit(text,integer) from public, anon, authenticated;
grant execute on function public.consume_auth_limit(text,integer) to service_role;
