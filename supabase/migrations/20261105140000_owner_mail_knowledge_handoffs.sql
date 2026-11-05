-- Private owner knowledge and one send ledger shared by the worker and manual MCP replies.
create table public.owner_mail_knowledge (
 id uuid primary key default gen_random_uuid(),
 title text not null check(char_length(title) between 1 and 160),
 content text not null check(char_length(content) between 1 and 8000),
 kind text not null check(kind in ('identity','project','goal','reference')),
 visibility text not null default 'owner_private' check(visibility in ('public_reply','owner_private')),
 source_label text not null default 'Owner supplied' check(char_length(source_label) between 1 and 500),
 active boolean not null default true,
 approved_at timestamptz,
 updated_by uuid,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check(visibility<>'public_reply' or approved_at is not null)
);
alter table public.owner_mail_knowledge enable row level security;
revoke all on public.owner_mail_knowledge from public,anon,authenticated;
grant select,insert,update on public.owner_mail_knowledge to service_role;

insert into public.owner_mail_knowledge(title,content,kind,visibility,source_label,approved_at) values
 ('Identity','Adham owns AGYNEXA (agynexa.si). Nexa is his automated AI assistant. Nexa must identify itself as an automated assistant and must not impersonate Adham.','identity','public_reply','Owner-confirmed identity and existing approved reply policy',now()),
 ('AGYNEXA project','AGYNEXA focuses on configurable AI agents and business workflow automation. A useful first discussion identifies the workflow, available sources and tools, and an example of the expected result.','project','public_reply','Owner-confirmed platform purpose; no prices or delivery commitments',now()),
 ('Response boundaries','No prices, delivery dates, availability, customer relationships, private biography, legal obligations or financial commitments have been approved for automatic replies. Ask for clarification or leave such decisions for Adham.','identity','public_reply','Owner instructions for automated replies',now());

alter table public.owner_mail_jobs
 add column handling_mode text not null default 'auto' check(handling_mode in ('auto','manual')),
 add column handler_actor uuid,
 add column policy_reason text,
 add column knowledge_ids uuid[] not null default '{}',
 add column knowledge_revisions jsonb not null default '{}'::jsonb;

create or replace function public.owner_mail_claim(p_id text,p_lease uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare j public.owner_mail_jobs;
begin
 if p_lease is null then return null; end if;
 select * into j from public.owner_mail_jobs where state='pending' and handling_mode='auto' and next_at<=now()
 and (p_id is null or id=p_id) and (lease_until is null or lease_until<now())
 order by next_at,created_at for update skip locked limit 1;
 if not found then return null; end if;
 update public.owner_mail_jobs set lease=p_lease,lease_until=now()+interval '5 minutes',attempts=attempts+1,handler_actor=null
 where id=j.id returning * into j;
 return to_jsonb(j);
end $$;

create function public.owner_mail_claim_manual(p_id text,p_lease uuid,p_actor uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare j public.owner_mail_jobs;
begin
 if p_actor is null or p_lease is null then return null; end if;
 select * into j from public.owner_mail_jobs where id=p_id and direction='inbound'
 and (state in ('pending','review') or (state='skipped' and reason='automatic_replies_disabled'))
 and (lease_until is null or lease_until<now()) for update skip locked;
 if not found then return null; end if;
 -- Never transfer an uncertain automatic send to a different workflow.
 if j.first_send_at is not null and j.handling_mode<>'manual' then return null; end if;
 update public.owner_mail_jobs set handling_mode='manual',handler_actor=p_actor,state='pending',
  lease=p_lease,lease_until=now()+interval '5 minutes',attempts=attempts+1
 where id=j.id returning * into j;
 return to_jsonb(j);
end $$;

create function public.owner_mail_release_manual(p_id text,p_actor uuid,p_resume_auto boolean default true,p_lease uuid default null) returns boolean
language plpgsql security invoker set search_path='' as $$
declare j public.owner_mail_jobs;
begin
 select * into j from public.owner_mail_jobs where id=p_id for update;
 if not found or p_actor is null or j.handling_mode<>'manual' or (j.handler_actor is not null and j.handler_actor is distinct from p_actor)
 or j.state not in ('pending','review') or (j.lease_until>now() and j.lease is distinct from p_lease) then return false; end if;
 -- A reserved external effect stays frozen even when its result is uncertain.
 if p_resume_auto and (j.first_send_at is not null or coalesce(j.policy_reason,'routine')<>'routine'
 or (j.state='review' and j.policy_reason is null)) then return false; end if;
 update public.owner_mail_jobs set lease=null,lease_until=null,
  handling_mode=case when p_resume_auto then 'auto' else 'manual' end,
  handler_actor=case when p_resume_auto then null else p_actor end,
  state=case when p_resume_auto then 'pending' else state end,
  next_at=case when p_resume_auto then now() else next_at end
 where id=p_id;
 return true;
end $$;

create or replace function public.owner_mail_reserve_send(p_id text,p_lease uuid,p_sender text,p_reply jsonb) returns text
language plpgsql security invoker set search_path='' as $$
declare j public.owner_mail_jobs;
begin
 perform pg_advisory_xact_lock(77110405);
 select * into j from public.owner_mail_jobs where id=p_id for update;
 if not found or p_lease is null or j.lease is distinct from p_lease or j.lease_until is null or j.lease_until<=now() or j.state<>'pending' then return 'lease_lost'; end if;
 if coalesce(j.policy_reason,'routine')<>'routine' then return 'policy_review_required'; end if;
 if j.handling_mode='auto' and not exists(select 1 from public.owner_mail_settings where inbox=j.inbox and auto_reply) then return 'disabled'; end if;
 if j.first_send_at is not null then
  if j.sender is distinct from p_sender or j.reply is distinct from p_reply then return 'payload_conflict'; end if;
  if j.first_send_at<now()-interval '23 hours' then return 'send_uncertain'; end if;
  return 'reserved';
 end if;
 if (select count(*) from public.owner_mail_jobs where first_send_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')>=40 then return 'daily_limit'; end if;
 if exists(select 1 from public.owner_mail_jobs where sender=p_sender and first_send_at>now()-interval '5 minutes')
 or (select count(*) from public.owner_mail_jobs where sender=p_sender and first_send_at>now()-interval '24 hours')>=5 then return 'sender_limit'; end if;
 update public.owner_mail_jobs set sender=p_sender,reply=p_reply,first_send_at=now() where id=p_id;
 return 'reserved';
end $$;

revoke all on function public.owner_mail_claim_manual(text,uuid,uuid),public.owner_mail_release_manual(text,uuid,boolean,uuid) from public,anon,authenticated;
grant execute on function public.owner_mail_claim_manual(text,uuid,uuid),public.owner_mail_release_manual(text,uuid,boolean,uuid) to service_role;
-- Replacement functions retain the existing service-role-only ACL.

-- A manual hold does not wake the automatic worker. No mail is deleted or expired.
select cron.schedule('owner-mail-retry','* * * * *', $cron$
 select net.http_post(
  url:='https://agynexa.si/api/owner-mail/worker',
  headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||s.decrypted_secret),
  body:='{}'::jsonb,
  timeout_milliseconds:=60000
 ) from vault.decrypted_secrets s
 where s.name='owner_mail_worker_token'
 and exists(select 1 from public.owner_mail_jobs where state='pending' and handling_mode='auto' and next_at<=now() and (lease_until is null or lease_until<now()));
$cron$);
