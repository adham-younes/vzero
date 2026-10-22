-- NEXA mail is service-only. Authentication AND exact administrator authorization
-- happen on the server before any privileged read or mutation. No public grants.
begin;
create table public.nexa_mail_events(
 event_id text primary key check(length(event_id) between 1 and 200),
 payload_hash text not null check(payload_hash ~ '^[a-f0-9]{64}$'),
 provider_email_id uuid not null,status text not null default 'processing' check(status in('processing','completed')),
 lease_token uuid not null,lease_until timestamptz not null,created_at timestamptz not null default now(),completed_at timestamptz
);
create table public.nexa_mail_threads(
 id uuid primary key default gen_random_uuid(),inbox text not null,subject text not null,
 external_sender text not null,last_message_at timestamptz not null default now(),message_count integer not null default 0,
 is_read boolean not null default false,archived boolean not null default false,created_at timestamptz not null default now()
);
create index nexa_mail_thread_page on public.nexa_mail_threads(inbox,archived,last_message_at desc,id desc);
create table public.nexa_mail_messages(
 id uuid primary key default gen_random_uuid(),thread_id uuid not null references public.nexa_mail_threads(id),inbox text not null,
 provider_email_id uuid not null,message_id text,from_address text not null,direction text not null default 'inbound' check(direction in('inbound','outbound')),
 payload jsonb not null check(jsonb_typeof(payload)='object'),created_at timestamptz not null default now(),unique(inbox,provider_email_id)
);
create index nexa_mail_message_page on public.nexa_mail_messages(thread_id,created_at desc,id desc);
create index nexa_mail_reference on public.nexa_mail_messages(inbox,message_id) where message_id is not null;
create table public.nexa_mail_drafts(
 id uuid primary key default gen_random_uuid(),thread_id uuid references public.nexa_mail_threads(id),created_by uuid not null,
 request_key uuid not null,input_hash text not null,version integer not null default 1 check(version>0),
 payload jsonb not null check(jsonb_typeof(payload)='object' and payload->>'from'='NEXA Agent AI Business Assistant AGYNEXA <nexa.agent@agynexa.si>'),
 snapshot_hash text not null check(snapshot_hash ~ '^[a-f0-9]{64}$'),
 approved_version integer,approved_hash text,approved_by uuid,approved_at timestamptz,
 status text not null default 'draft' check(status in('draft','approved','queued')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(created_by,request_key)
);
create table public.nexa_mail_outbox(
 id uuid primary key default gen_random_uuid(),draft_id uuid not null references public.nexa_mail_drafts(id),draft_version integer not null,
 created_by uuid not null,request_key uuid not null,
 payload jsonb not null check(jsonb_typeof(payload)='object' and payload->>'from'='NEXA Agent AI Business Assistant AGYNEXA <nexa.agent@agynexa.si>'),
 snapshot_hash text not null,status text not null default 'queued' check(status in('queued','sending','accepted','rejected','delivery_unknown')),
 provider_id uuid,error_code text,first_attempt_at timestamptz,attempt_token uuid,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(draft_id,draft_version),unique(created_by,request_key)
);
create table public.nexa_mail_audit(
 id uuid primary key default gen_random_uuid(),actor_id uuid,action text not null,object_id uuid,
 metadata jsonb not null default '{}',created_at timestamptz not null default now()
);

create function public.nexa_mail_reserve(p_event text,p_hash text,p_email uuid,p_lease uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare e public.nexa_mail_events;
begin
 insert into public.nexa_mail_events(event_id,payload_hash,provider_email_id,lease_token,lease_until)
 values(p_event,p_hash,p_email,p_lease,now()+interval '40 seconds') on conflict(event_id) do nothing;
 select * into e from public.nexa_mail_events where event_id=p_event for update;
 if e.payload_hash<>p_hash or e.provider_email_id<>p_email then return jsonb_build_object('state','conflict');end if;
 if e.status='completed' then return jsonb_build_object('state','completed');end if;
 if e.lease_token<>p_lease and e.lease_until>now() then return jsonb_build_object('state','busy');end if;
 update public.nexa_mail_events set lease_token=p_lease,lease_until=now()+interval '40 seconds' where event_id=p_event;
 return jsonb_build_object('state','acquired');
end $$;
create function public.nexa_mail_release(p_event text,p_lease uuid) returns void
language sql security invoker set search_path='' as $$
 update public.nexa_mail_events set lease_until=now() where event_id=p_event and lease_token=p_lease and status='processing';
$$;
create function public.nexa_mail_complete(p_event text,p_lease uuid,p_inbox text,p_message jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare e public.nexa_mail_events;m public.nexa_mail_messages;t uuid;matches uuid[];refs text[];
begin
 select * into e from public.nexa_mail_events where event_id=p_event for update;
 if not found or e.status<>'processing' or e.lease_token<>p_lease or e.lease_until<=now() then return jsonb_build_object('state','lease_lost');end if;
 if (p_message->>'provider_email_id')::uuid<>e.provider_email_id then raise exception 'mail_event_mismatch';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_inbox||':'||e.provider_email_id::text,0));
 select * into m from public.nexa_mail_messages where inbox=p_inbox and provider_email_id=e.provider_email_id;
 if found then
  update public.nexa_mail_events set status='completed',completed_at=now() where event_id=p_event;
  return jsonb_build_object('state','completed','message_id',m.id,'thread_id',m.thread_id);
 end if;
 select array_agg(v) into refs from (select jsonb_array_elements_text(coalesce(p_message->'references','[]')) v union select p_message->>'in_reply_to')r where v is not null;
 select array_agg(distinct m2.thread_id) into matches from public.nexa_mail_messages m2 join public.nexa_mail_threads t2 on t2.id=m2.thread_id
 where m2.inbox=p_inbox and t2.inbox=p_inbox and t2.external_sender=p_message->>'from_address' and m2.message_id=any(refs);
 if cardinality(matches)=1 then t:=matches[1];else
  insert into public.nexa_mail_threads(inbox,subject,external_sender) values(p_inbox,left(p_message->>'subject',1000),p_message->>'from_address') returning id into t;
 end if;
 insert into public.nexa_mail_messages(thread_id,inbox,provider_email_id,message_id,from_address,payload)
 values(t,p_inbox,e.provider_email_id,p_message->>'message_id',p_message->>'from_address',p_message) returning * into m;
 update public.nexa_mail_threads set message_count=message_count+1,last_message_at=now(),is_read=false,archived=false where id=t;
 update public.nexa_mail_events set status='completed',completed_at=now() where event_id=p_event;
 insert into public.nexa_mail_audit(action,object_id,metadata) values('received',m.id,jsonb_build_object('event_id',p_event));
 return jsonb_build_object('state','completed','message_id',m.id,'thread_id',t);
end $$;

create function public.nexa_mail_save_draft(p_id uuid,p_actor uuid,p_request uuid,p_version integer,p_hash text,p_payload jsonb,p_thread uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare d public.nexa_mail_drafts;
begin
 if p_id is null then
  perform pg_advisory_xact_lock(hashtextextended(p_actor::text||p_request::text,0));
  select * into d from public.nexa_mail_drafts where created_by=p_actor and request_key=p_request for update;
  if found then
   if d.input_hash<>p_hash then return jsonb_build_object('state','conflict');end if;
   return jsonb_build_object('state','saved','draft',to_jsonb(d));
  end if;
  if p_thread is not null and not exists(select 1 from public.nexa_mail_threads where id=p_thread and inbox='nexa.agent@agynexa.si') then return jsonb_build_object('state','not_found');end if;
  insert into public.nexa_mail_drafts(thread_id,created_by,request_key,input_hash,payload,snapshot_hash)
  values(p_thread,p_actor,p_request,p_hash,p_payload,p_hash) returning * into d;
 else
  select * into d from public.nexa_mail_drafts where id=p_id for update;
  if not found then return jsonb_build_object('state','not_found');end if;
  if d.version<>p_version or d.status='queued' then return jsonb_build_object('state','conflict');end if;
  update public.nexa_mail_drafts set version=version+1,payload=p_payload,snapshot_hash=p_hash,status='draft',approved_version=null,approved_hash=null,approved_by=null,approved_at=null,updated_at=now() where id=p_id returning * into d;
 end if;
 insert into public.nexa_mail_audit(actor_id,action,object_id,metadata) values(p_actor,'draft_saved',d.id,jsonb_build_object('version',d.version,'snapshot_hash',d.snapshot_hash));
 return jsonb_build_object('state','saved','draft',to_jsonb(d));
end $$;
create function public.nexa_mail_approve(p_id uuid,p_actor uuid,p_version integer,p_hash text) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare d public.nexa_mail_drafts;
begin
 select * into d from public.nexa_mail_drafts where id=p_id for update;
 if not found then return jsonb_build_object('state','not_found');end if;
 if d.version<>p_version or d.snapshot_hash<>p_hash or d.status='queued' then return jsonb_build_object('state','conflict');end if;
 if d.status='approved' then return jsonb_build_object('state','approved','draft',to_jsonb(d));end if;
 update public.nexa_mail_drafts set approved_version=version,approved_hash=snapshot_hash,approved_by=p_actor,approved_at=now(),status='approved',updated_at=now() where id=p_id returning * into d;
 insert into public.nexa_mail_audit(actor_id,action,object_id,metadata) values(p_actor,'draft_approved',d.id,jsonb_build_object('version',d.version,'snapshot_hash',d.snapshot_hash));
 return jsonb_build_object('state','approved','draft',to_jsonb(d));
end $$;
create function public.nexa_mail_queue(p_id uuid,p_actor uuid,p_version integer,p_hash text,p_request uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare d public.nexa_mail_drafts;o public.nexa_mail_outbox;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_actor::text||p_request::text,0));
 select * into o from public.nexa_mail_outbox where created_by=p_actor and request_key=p_request;
 if found then
  if o.draft_id<>p_id or o.draft_version<>p_version or o.snapshot_hash<>p_hash then return jsonb_build_object('state','conflict');end if;
  return jsonb_build_object('state','queued','outbox',to_jsonb(o));
 end if;
 select * into d from public.nexa_mail_drafts where id=p_id for update;
 if not found then return jsonb_build_object('state','not_found');end if;
 if d.version<>p_version or d.snapshot_hash<>p_hash or d.approved_version is distinct from d.version or d.approved_hash is distinct from d.snapshot_hash or d.approved_by is null then return jsonb_build_object('state','approval_required');end if;
 select * into o from public.nexa_mail_outbox where draft_id=p_id and draft_version=p_version;
 if found then return jsonb_build_object('state','queued','outbox',to_jsonb(o));end if;
 insert into public.nexa_mail_outbox(draft_id,draft_version,created_by,request_key,payload,snapshot_hash)
 values(p_id,p_version,p_actor,p_request,d.payload,d.snapshot_hash) returning * into o;
 update public.nexa_mail_drafts set status='queued',updated_at=now() where id=p_id;
 insert into public.nexa_mail_audit(actor_id,action,object_id,metadata) values(p_actor,'send_queued',o.id,jsonb_build_object('draft_id',p_id,'version',p_version,'snapshot_hash',p_hash));
 return jsonb_build_object('state','queued','outbox',to_jsonb(o));
end $$;
create function public.nexa_mail_claim(p_id uuid,p_actor uuid,p_attempt uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare o public.nexa_mail_outbox;
begin
 select * into o from public.nexa_mail_outbox where id=p_id for update;
 if not found then return jsonb_build_object('state','not_found');end if;
 if (o.status='sending' and o.updated_at<now()-interval '60 seconds') or (o.status='queued' and o.first_attempt_at<now()-interval '23 hours') then
  update public.nexa_mail_outbox set status='delivery_unknown',error_code='reconciliation_required',updated_at=now() where id=p_id returning * into o;
 end if;
 if o.status<>'queued' then return jsonb_build_object('state',o.status,'outbox',to_jsonb(o));end if;
 update public.nexa_mail_outbox set status='sending',first_attempt_at=coalesce(first_attempt_at,now()),attempt_token=p_attempt,error_code=null,updated_at=now() where id=p_id returning * into o;
 insert into public.nexa_mail_audit(actor_id,action,object_id,metadata) values(p_actor,'manual_dispatch_started',o.id,jsonb_build_object('snapshot_hash',o.snapshot_hash));
 return jsonb_build_object('state','claimed','outbox',to_jsonb(o));
end $$;
create function public.nexa_mail_finish(p_id uuid,p_actor uuid,p_attempt uuid,p_status text,p_provider uuid,p_error text) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare o public.nexa_mail_outbox;d public.nexa_mail_drafts;t uuid;message_payload jsonb;
begin
 select * into o from public.nexa_mail_outbox where id=p_id for update;
 if not found or o.status<>'sending' or o.attempt_token<>p_attempt then return jsonb_build_object('state','conflict');end if;
 if p_status not in('accepted','queued','rejected','delivery_unknown') or (p_status='accepted' and p_provider is null) then raise exception 'invalid_mail_transition';end if;
 update public.nexa_mail_outbox set status=p_status,provider_id=p_provider,error_code=p_error,updated_at=now() where id=p_id returning * into o;
 if p_status='accepted' then
  select * into d from public.nexa_mail_drafts where id=o.draft_id;t:=d.thread_id;
  if t is null then insert into public.nexa_mail_threads(inbox,subject,external_sender,is_read) values('nexa.agent@agynexa.si',o.payload->>'subject',o.payload->'to'->>0,true) returning id into t;end if;
  message_payload:=jsonb_build_object('provider_email_id',p_provider,'from_address','nexa.agent@agynexa.si','from_display','NEXA Agent AI Business Assistant AGYNEXA','to',o.payload->'to','cc',o.payload->'cc','subject',o.payload->>'subject','text',o.payload->>'text','text_available',true,'text_truncated',false,'original_text_bytes',octet_length(o.payload->>'text'),'message_id',null,'in_reply_to',o.payload->'headers'->>'In-Reply-To','references','[]'::jsonb,'attachments','[]'::jsonb,'provider_created_at',now());
  insert into public.nexa_mail_messages(thread_id,inbox,provider_email_id,from_address,direction,payload) values(t,'nexa.agent@agynexa.si',p_provider,'nexa.agent@agynexa.si','outbound',message_payload) on conflict(inbox,provider_email_id) do nothing;
  update public.nexa_mail_threads set message_count=(select count(*) from public.nexa_mail_messages where thread_id=t),last_message_at=now() where id=t;
 end if;
 insert into public.nexa_mail_audit(actor_id,action,object_id,metadata) values(p_actor,'manual_dispatch_'||p_status,o.id,jsonb_build_object('provider_id',p_provider,'error_code',p_error));
 return jsonb_build_object('state',p_status,'outbox',to_jsonb(o));
end $$;

create function public.nexa_mail_thread_state(p_id uuid,p_actor uuid,p_read boolean,p_archived boolean) returns jsonb
language plpgsql security definer set search_path='' as $$
declare t public.nexa_mail_threads;begin
 update public.nexa_mail_threads set is_read=coalesce(p_read,is_read),archived=coalesce(p_archived,archived) where id=p_id and inbox='nexa.agent@agynexa.si' returning * into t;
 if not found then return jsonb_build_object('state','not_found');end if;
 insert into public.nexa_mail_audit(actor_id,action,object_id,metadata) values(p_actor,'thread_state_changed',p_id,jsonb_build_object('is_read',t.is_read,'archived',t.archived));
 return jsonb_build_object('state','updated','thread',to_jsonb(t));end $$;

do $$declare t text;f record;begin
 foreach t in array array['events','threads','messages','drafts','outbox','audit'] loop
  execute 'alter table public.nexa_mail_'||t||' enable row level security';
  execute 'revoke all on public.nexa_mail_'||t||' from public,anon,authenticated';
  execute 'grant select,insert,update,delete on public.nexa_mail_'||t||' to service_role';
 end loop;
 for f in select oid::regprocedure sig from pg_proc where pronamespace='public'::regnamespace and proname like 'nexa_mail_%' loop
  execute 'revoke all on function '||f.sig||' from public,anon,authenticated';
  execute 'grant execute on function '||f.sig||' to service_role';
 end loop;
end $$;
commit;
