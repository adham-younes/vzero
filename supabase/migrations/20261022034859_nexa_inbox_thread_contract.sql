-- Provider Inbox thread identity is scoped to the one authorized existing NEXA resource.
begin;
create or replace function public.nexa_mail_complete(p_event text,p_lease uuid,p_inbox text,p_message jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare e public.nexa_mail_events;m public.nexa_mail_messages;t uuid;matches uuid[];refs text[];
begin
 select * into e from public.nexa_mail_events where event_id=p_event for update;
 if not found or e.status<>'processing' or e.lease_token<>p_lease or e.lease_until<=now() then return jsonb_build_object('state','lease_lost');end if;
 if (p_message->>'provider_email_id')::uuid<>e.provider_email_id then raise exception 'mail_event_mismatch';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_inbox||':'||e.provider_email_id::text,0));
 if p_inbox='nexa.agent@agynexa.si' and p_message->>'provider_inbox_id'='fa42c2f2-5511-490b-9227-8078b609fa3a' and p_message->>'provider_thread_id' ~ '^[a-f0-9-]{36}$' then
  perform pg_advisory_xact_lock(hashtextextended(p_inbox||':inbox-thread:'||(p_message->>'provider_thread_id'),0));
 end if;
 select * into m from public.nexa_mail_messages where inbox=p_inbox and provider_email_id=e.provider_email_id;
 if found then
  update public.nexa_mail_events set status='completed',completed_at=now() where event_id=p_event;
  return jsonb_build_object('state','completed','message_id',m.id,'thread_id',m.thread_id);
 end if;
 select array_agg(v) into refs from (select jsonb_array_elements_text(coalesce(p_message->'references','[]')) v union select p_message->>'in_reply_to')r where v is not null;
 select array_agg(distinct m2.thread_id) into matches from public.nexa_mail_messages m2 join public.nexa_mail_threads t2 on t2.id=m2.thread_id
 where m2.inbox=p_inbox and t2.inbox=p_inbox and t2.external_sender=p_message->>'from_address' and m2.message_id=any(refs);
 if p_inbox='nexa.agent@agynexa.si' and p_message->>'provider_inbox_id'='fa42c2f2-5511-490b-9227-8078b609fa3a' and p_message->>'provider_thread_id' ~ '^[a-f0-9-]{36}$' then
  select array_agg(distinct m3.thread_id) into matches from public.nexa_mail_messages m3 join public.nexa_mail_threads t3 on t3.id=m3.thread_id where m3.inbox=p_inbox and t3.inbox=p_inbox and m3.payload->>'provider_inbox_id'=p_message->>'provider_inbox_id' and m3.payload->>'provider_thread_id'=p_message->>'provider_thread_id';
 end if;
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

revoke all on function public.nexa_mail_complete(text,uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.nexa_mail_complete(text,uuid,text,jsonb) to service_role;
notify pgrst,'reload schema';
commit;
