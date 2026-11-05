-- Private archive: only server-side service role, no public/authenticated table access.
create table public.owner_mail_settings (
 inbox text primary key check (inbox in ('adham@agynexa.si','nexa.agent@agynexa.si')),
 auto_reply boolean not null default false,
 updated_at timestamptz not null default now()
);
insert into public.owner_mail_settings(inbox) values ('adham@agynexa.si'),('nexa.agent@agynexa.si');
create table public.owner_mail_archive (
 id text primary key,
 inbox text not null references public.owner_mail_settings(inbox),
 source text not null check (source in ('spacemail','resend')),
 direction text not null check(direction in ('inbound','outbound','historical')),
 folder text not null,
 subject text not null,
 sender text not null,
 recipients jsonb not null default '[]',
 message_at timestamptz not null,
 text_body text not null default '',
 object_path text not null unique,
 sha256 text not null check(sha256 ~ '^[a-f0-9]{64}$'),
 byte_count bigint not null check(byte_count>0),
 format text not null check(format in ('eml','json')),
 attachments jsonb not null default '[]',
 created_at timestamptz not null default now()
);
create index owner_mail_archive_list on public.owner_mail_archive(inbox,message_at desc,id);
create table public.owner_mail_jobs (
 id text primary key,
 inbox text not null references public.owner_mail_settings(inbox),
 inbox_id uuid not null,
 thread_id uuid not null,
 email_id uuid not null,
 direction text not null check(direction in ('inbound','outbound')),
 folder text not null,
 state text not null default 'pending' check(state in ('pending','sent','skipped','review','archived')),
 attempts int not null default 0,
 lease uuid,
 lease_until timestamptz,
 next_at timestamptz not null default now(),
 sender text,
 reply jsonb,
 first_send_at timestamptz,
 sent_id uuid,
 reason text,
 created_at timestamptz not null default now(),
 unique(inbox,email_id)
);
create index owner_mail_jobs_queue on public.owner_mail_jobs(next_at) where state='pending';
create index owner_mail_jobs_sends on public.owner_mail_jobs(first_send_at,sender) where first_send_at is not null;
create function public.owner_mail_claim(p_id text,p_lease uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare j public.owner_mail_jobs;
begin
 select * into j from public.owner_mail_jobs where state='pending' and next_at<=now()
 and (p_id is null or id=p_id) and (lease_until is null or lease_until<now())
 order by next_at,created_at for update skip locked limit 1;
 if not found then return null; end if;
 update public.owner_mail_jobs set lease=p_lease,lease_until=now()+interval '5 minutes',attempts=attempts+1
 where id=j.id returning * into j;
 return to_jsonb(j);
end $$;
-- Reserve a stable send before the first provider call. This reservation survives ambiguous failures.
create function public.owner_mail_reserve_send(p_id text,p_lease uuid,p_sender text,p_reply jsonb) returns text
language plpgsql security invoker set search_path='' as $$
declare j public.owner_mail_jobs;
begin
 perform pg_advisory_xact_lock(77110405);
 select * into j from public.owner_mail_jobs where id=p_id for update;
 if not found or j.lease is distinct from p_lease or j.lease_until<=now() or j.state<>'pending' then return 'lease_lost'; end if;
 if not exists(select 1 from public.owner_mail_settings where inbox=j.inbox and auto_reply) then return 'disabled'; end if;
 if j.first_send_at is not null then
  if j.first_send_at<now()-interval '23 hours' then return 'send_uncertain'; end if;
  return 'reserved';
 end if;
 if (select count(*) from public.owner_mail_jobs where first_send_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')>=40 then return 'daily_limit'; end if;
 if exists(select 1 from public.owner_mail_jobs where sender=p_sender and first_send_at>now()-interval '5 minutes')
 or (select count(*) from public.owner_mail_jobs where sender=p_sender and first_send_at>now()-interval '24 hours')>=5 then return 'sender_limit'; end if;
 update public.owner_mail_jobs set sender=p_sender,reply=p_reply,first_send_at=now() where id=p_id;
 return 'reserved';
end $$;
alter table public.owner_mail_settings enable row level security;
alter table public.owner_mail_archive enable row level security;
alter table public.owner_mail_jobs enable row level security;
revoke all on public.owner_mail_settings,public.owner_mail_archive,public.owner_mail_jobs from public,anon,authenticated;
grant select,insert,update on public.owner_mail_settings,public.owner_mail_archive,public.owner_mail_jobs to service_role;
revoke all on function public.owner_mail_claim(text,uuid),public.owner_mail_reserve_send(text,uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.owner_mail_claim(text,uuid),public.owner_mail_reserve_send(text,uuid,text,jsonb) to service_role;
insert into storage.buckets(id,name,public,file_size_limit) values ('owner-mail','owner-mail',false,52428800);
