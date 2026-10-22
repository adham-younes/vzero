-- Additive NEXA cloud increment. Preserve historical payloads/approvals; no row deletion or rewrite.
begin;
alter table public.nexa_mail_drafts drop constraint nexa_mail_drafts_payload_check;
alter table public.nexa_mail_drafts add constraint nexa_mail_drafts_payload_check check(jsonb_typeof(payload)='object' and payload->>'from' in ('NEXA Agent AI Business Assistant AGYNEXA <nexa.agent@agynexa.si>','NEXA Agent | AGYNEXA AI Assistant <nexa.agent@agynexa.si>'));
alter table public.nexa_mail_outbox drop constraint nexa_mail_outbox_payload_check;
alter table public.nexa_mail_outbox add constraint nexa_mail_outbox_payload_check check(jsonb_typeof(payload)='object' and payload->>'from' in ('NEXA Agent AI Business Assistant AGYNEXA <nexa.agent@agynexa.si>','NEXA Agent | AGYNEXA AI Assistant <nexa.agent@agynexa.si>'));

create or replace function public.nexa_mail_finish(p_id uuid,p_actor uuid,p_attempt uuid,p_status text,p_provider uuid,p_error text) returns jsonb
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
  message_payload:=jsonb_build_object('provider_email_id',p_provider,'from_address','nexa.agent@agynexa.si','from_display',pg_catalog.regexp_replace(o.payload->>'from',' <[^<>]+>$',''),'to',o.payload->'to','cc',o.payload->'cc','subject',o.payload->>'subject','text',o.payload->>'text','text_available',true,'text_truncated',false,'original_text_bytes',octet_length(o.payload->>'text'),'message_id',null,'in_reply_to',o.payload->'headers'->>'In-Reply-To','references','[]'::jsonb,'attachments','[]'::jsonb,'provider_created_at',now());
  insert into public.nexa_mail_messages(thread_id,inbox,provider_email_id,from_address,direction,payload) values(t,'nexa.agent@agynexa.si',p_provider,'nexa.agent@agynexa.si','outbound',message_payload) on conflict(inbox,provider_email_id) do nothing;
  update public.nexa_mail_threads set message_count=(select count(*) from public.nexa_mail_messages where thread_id=t),last_message_at=now() where id=t;
 end if;
 insert into public.nexa_mail_audit(actor_id,action,object_id,metadata) values(p_actor,'manual_dispatch_'||p_status,o.id,jsonb_build_object('provider_id',p_provider,'error_code',p_error));
 return jsonb_build_object('state',p_status,'outbox',to_jsonb(o));
end $$;

revoke all on function public.nexa_mail_finish(uuid,uuid,uuid,text,uuid,text) from public,anon,authenticated;
grant execute on function public.nexa_mail_finish(uuid,uuid,uuid,text,uuid,text) to service_role;

-- Audit has no inbox column in PR41. Bind every exposed event to an actual NEXA object.
create view public.nexa_mail_audit_feed with(security_invoker=true) as
 select a.id,a.actor_id,a.action,a.object_id,a.metadata,a.created_at from public.nexa_mail_audit a
 where (a.action='received' and exists(select 1 from public.nexa_mail_messages m where m.id=a.object_id and m.inbox='nexa.agent@agynexa.si'))
 or (a.action='thread_state_changed' and exists(select 1 from public.nexa_mail_threads t where t.id=a.object_id and t.inbox='nexa.agent@agynexa.si'))
 or (a.action in ('draft_saved','draft_approved') and exists(select 1 from public.nexa_mail_drafts d where d.id=a.object_id and d.payload->>'from' in ('NEXA Agent AI Business Assistant AGYNEXA <nexa.agent@agynexa.si>','NEXA Agent | AGYNEXA AI Assistant <nexa.agent@agynexa.si>') and (d.thread_id is null or exists(select 1 from public.nexa_mail_threads t where t.id=d.thread_id and t.inbox='nexa.agent@agynexa.si'))))
 or ((a.action='send_queued' or a.action like 'manual_dispatch_%') and exists(select 1 from public.nexa_mail_outbox o join public.nexa_mail_drafts d on d.id=o.draft_id where o.id=a.object_id and o.payload->>'from' in ('NEXA Agent AI Business Assistant AGYNEXA <nexa.agent@agynexa.si>','NEXA Agent | AGYNEXA AI Assistant <nexa.agent@agynexa.si>') and (d.thread_id is null or exists(select 1 from public.nexa_mail_threads t where t.id=d.thread_id and t.inbox='nexa.agent@agynexa.si'))));
revoke all on public.nexa_mail_audit_feed from public,anon,authenticated;
grant select on public.nexa_mail_audit_feed to service_role;
notify pgrst,'reload schema';
commit;
