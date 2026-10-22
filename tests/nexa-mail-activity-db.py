"""Focused actual isolated PostgreSQL migration tests; transaction always rolls back."""
from pathlib import Path
import subprocess, json
root=Path(__file__).resolve().parents[1]
migration=(root/'supabase/migrations/20261022033751_nexa_mail_activity_identity.sql').read_text().replace('begin;','',1).rsplit('commit;',1)[0]
migration+='\n'+(root/'supabase/migrations/20261022034859_nexa_inbox_thread_contract.sql').read_text().replace('begin;','',1).rsplit('commit;',1)[0]
checks=r"""
do $$
declare a uuid:=gen_random_uuid(); d uuid; o uuid; attempt uuid; provider uuid; r jsonb; p jsonb; sender text; t uuid; foreign_t uuid; m uuid; foreign_m uuid; e uuid; foreign_e uuid; n integer;
begin
 if not exists(select 1 from pg_class where oid='public.nexa_mail_audit_feed'::regclass and 'security_invoker=true'=any(reloptions)) then raise exception 'view_invoker';end if;
 foreach sender in array array['anon','authenticated'] loop
  if has_table_privilege(sender,'public.nexa_mail_audit_feed','select') or has_function_privilege(sender,'public.nexa_mail_finish(uuid,uuid,uuid,text,uuid,text)','execute') then raise exception 'customer_grants';end if;
 end loop;
 insert into public.nexa_mail_threads(inbox,subject,external_sender) values('nexa.agent@agynexa.si','Synthetic','sender@example.test') returning id into t;
 insert into public.nexa_mail_threads(inbox,subject,external_sender) values('unrelated@example.test','Synthetic','sender@example.test') returning id into foreign_t;
 insert into public.nexa_mail_messages(thread_id,inbox,provider_email_id,from_address,payload) values(t,'nexa.agent@agynexa.si',gen_random_uuid(),'sender@example.test','{}') returning id into m;
 insert into public.nexa_mail_messages(thread_id,inbox,provider_email_id,from_address,payload) values(foreign_t,'unrelated@example.test',gen_random_uuid(),'sender@example.test','{}') returning id into foreign_m;
 insert into public.nexa_mail_audit(action,object_id) values('received',m) returning id into e;
 insert into public.nexa_mail_audit(action,object_id) values('received',foreign_m) returning id into foreign_e;
 select count(*) into n from public.nexa_mail_audit_feed where id in(e,foreign_e);
 if n<>1 or not exists(select 1 from public.nexa_mail_audit_feed where id=e) then raise exception 'mailbox_view_scope';end if;

 -- Real Inbox event completion/replay/thread scope, entirely transactional synthetic data.
 declare provider_thread uuid:=gen_random_uuid(); event_key text; email uuid; lease uuid; first_thread uuid; second_thread uuid; result jsonb; j integer;
 begin
  for j in 1..2 loop
   email:=gen_random_uuid();lease:=gen_random_uuid();event_key:='focused-inbox-'||gen_random_uuid()::text;
   perform public.nexa_mail_reserve(event_key,repeat('f',64),email,lease);
   result:=public.nexa_mail_complete(event_key,lease,'nexa.agent@agynexa.si',jsonb_build_object('provider_email_id',email,'from_address','sender@example.test','subject','Synthetic Inbox','message_id','<'||email||'@example.test>','provider_inbox_id','fa42c2f2-5511-490b-9227-8078b609fa3a','provider_thread_id',provider_thread));
   if j=1 then first_thread:=(result->>'thread_id')::uuid;else second_thread:=(result->>'thread_id')::uuid;end if;
   result:=public.nexa_mail_reserve(event_key,repeat('f',64),email,gen_random_uuid());
   if result->>'state'<>'completed' then raise exception 'inbox_event_replay';end if;
  end loop;
  if first_thread<>second_thread then raise exception 'provider_thread_continuity';end if;
  select count(*) into n from public.nexa_mail_messages where thread_id=first_thread;
  if n<>2 then raise exception 'provider_message_dedup';end if;
  email:=gen_random_uuid();lease:=gen_random_uuid();event_key:='focused-foreign-inbox-'||gen_random_uuid()::text;
  perform public.nexa_mail_reserve(event_key,repeat('a',64),email,lease);
  result:=public.nexa_mail_complete(event_key,lease,'unrelated@example.test',jsonb_build_object('provider_email_id',email,'from_address','sender@example.test','subject','Synthetic foreign','provider_inbox_id','fa42c2f2-5511-490b-9227-8078b609fa3a','provider_thread_id',provider_thread));
  if (result->>'thread_id')::uuid=first_thread then raise exception 'foreign_mailbox_provider_thread';end if;
 end;
 foreach sender in array array['NEXA Agent AI Business Assistant AGYNEXA <nexa.agent@agynexa.si>','NEXA Agent | AGYNEXA AI Assistant <nexa.agent@agynexa.si>'] loop
  p:=jsonb_build_object('from',sender,'to',jsonb_build_array('customer@example.test'),'cc','[]'::jsonb,'bcc','[]'::jsonb,'subject','Synthetic exact identity','text','Synthetic no email sent','headers','{}'::jsonb);
  r:=public.nexa_mail_save_draft(null,a,gen_random_uuid(),0,repeat('c',64),p,null); d:=(r->'draft'->>'id')::uuid;
  if d is null then raise exception 'save_compatibility';end if;
  if not exists(select 1 from public.nexa_mail_audit_feed where object_id=d and action='draft_saved') then raise exception 'draft_scope';end if;
  perform public.nexa_mail_approve(d,a,1,repeat('c',64));
  r:=public.nexa_mail_queue(d,a,1,repeat('c',64),gen_random_uuid());o:=(r->'outbox'->>'id')::uuid;
  attempt:=gen_random_uuid();provider:=gen_random_uuid();perform public.nexa_mail_claim(o,a,attempt);
  r:=public.nexa_mail_finish(o,a,attempt,'accepted',provider,null);
  if r->>'state'<>'accepted' then raise exception 'finish';end if;
  if not exists(select 1 from public.nexa_mail_messages where provider_email_id=provider and payload->>'from_display'=regexp_replace(sender,' <[^<>]+>$','')) then raise exception 'exact_frozen_display';end if;
  if not exists(select 1 from public.nexa_mail_outbox where id=o and payload=p and snapshot_hash=repeat('c',64)) then raise exception 'frozen_payload_changed';end if;
  if not exists(select 1 from public.nexa_mail_audit_feed where object_id=o and action='manual_dispatch_accepted') then raise exception 'outbox_scope';end if;
 end loop;
 p:=jsonb_set(p,'{from}','"Other <unrelated@example.test>"');
 begin
  perform public.nexa_mail_save_draft(null,a,gen_random_uuid(),0,repeat('d',64),p,null);
  raise exception 'foreign_sender_allowed';
 exception when check_violation then null;end;
 -- An otherwise valid frozen sender does not expose a draft referencing a different mailbox.
 p:=jsonb_set(p,'{from}','"NEXA Agent | AGYNEXA AI Assistant <nexa.agent@agynexa.si>"');
 r:=public.nexa_mail_save_draft(null,a,gen_random_uuid(),0,repeat('e',64),p,foreign_t);d:=(r->'draft'->>'id')::uuid;
 if exists(select 1 from public.nexa_mail_audit_feed where object_id=d) then raise exception 'cross_inbox_draft';end if;
end $$;
set local role service_role;
select count(*)>=0 as service_read from public.nexa_mail_audit_feed;
reset role;
rollback;
"""
p=subprocess.run(['docker','--context','colima-agynexa-release','exec','-i','agynexa-studio-local-db-1','psql','-U','postgres','-v','ON_ERROR_STOP=1','-At'],input='begin;\n'+migration+checks,text=True,capture_output=True)
assert p.returncode==0,p.stderr
assert p.stdout.strip().endswith('ROLLBACK'),p.stdout
result={'status':'PASS','environment':'ISOLATED_LOCAL_POSTGRES','migration':'20261022033751_nexa_mail_activity_identity.sql','checks':['security-invoker view','anon read and finish denied','authenticated read and finish denied','actual service-role view read','received audit fixed mailbox scope','historical sender accepted and frozen','new sender accepted and frozen','exact frozen display persisted for both identities','draft and outbox audit visible','other sender constraint rejected','cross-mailbox draft hidden','provider Inbox thread continuity','Inbox event replay','provider message dedup','foreign mailbox cannot join provider thread'],'count':15,'realProviderCalls':0,'fixtures':'transaction rolled back'}
(root/'docs/launch/2026-10-22/evidence/nexa-activity-db.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
