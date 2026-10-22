"""Real isolated PostgreSQL transactional/RLS checks; no hosted DB or real mail."""
import subprocess,json,uuid
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];checks=[]
def sql(q,expect_error=False):
 p=subprocess.run(['docker','--context','colima-agynexa-release','exec','-i','agynexa-studio-local-db-1','psql','-U','postgres','-v','ON_ERROR_STOP=1','-At'],input=q,text=True,capture_output=True)
 if expect_error:
  assert p.returncode!=0,(q,p.stdout);return p.stderr
 assert p.returncode==0,p.stderr
 return p.stdout.strip()
def check(name,fn):fn();checks.append(name)
def eq(q,expected):assert sql(q)==expected,(q,sql(q),expected)
check('mail tables use RLS and no anonymous/customer grants',lambda:eq("select count(*) from pg_class where relnamespace='public'::regnamespace and relname in ('nexa_mail_events','nexa_mail_threads','nexa_mail_messages','nexa_mail_drafts','nexa_mail_outbox','nexa_mail_audit') and relrowsecurity",'6'))
for role in ['anon','authenticated']:
 for table in ['events','threads','messages','drafts','outbox','audit']:
  check(f'{role} direct {table} access denied',lambda role=role,table=table:sql(f'set role {role};select * from public.nexa_mail_{table};',True))
uid=lambda:str(uuid.uuid4());actor=uid();email=uid();lease=uid();event='local-event-'+uid();h='a'*64
# Synthetic event transaction and duplicate paths.
def reserve(e=event,d=h,token=lease):return json.loads(sql(f"set role service_role;select public.nexa_mail_reserve('{e}','{d}','{email}','{token}');").splitlines()[-1])
a=reserve();assert a['state']=='acquired';checks.append('reserve acquires one event')
assert reserve(token=uid())['state']=='busy';checks.append('concurrent event delivery is busy')
assert reserve(d='b'*64)['state']=='conflict';checks.append('same event changed payload conflicts')
message={'provider_email_id':email,'from_address':'sender@example.test','from_display':'Synthetic sender','to':['ingress@example.test'],'cc':[],'subject':'Synthetic fixture','text':'<script>untrusted fixture</script>','text_available':True,'text_truncated':False,'original_text_bytes':35,'message_id':'<one@example.test>','in_reply_to':None,'references':[],'attachments':[],'provider_created_at':'2026-10-22T00:00:00Z'}
def complete(e=event,token=lease,m=message,inbox='nexa.agent@agynexa.si'):
 payload=json.dumps(m).replace("'","''")
 return json.loads(sql(f"set role service_role;select public.nexa_mail_complete('{e}','{token}','{inbox}','{payload}'::jsonb);").splitlines()[-1])
first=complete();assert first['state']=='completed';checks.append('message and event finalize atomically')
assert reserve()['state']=='completed';checks.append('completed replay acknowledges durable completion')
second_event='local-event-'+uid();second_lease=uid();assert reserve(e=second_event,token=second_lease)['state']=='acquired';complete(e=second_event,token=second_lease)
eq(f"select count(*) from public.nexa_mail_messages where provider_email_id='{email}'",'1');checks.append('same provider email new event does not duplicate')
# Same subject alone must not correlate; sender/reference scope is enforced.
def ingest(sender,reference=None,inbox='nexa.agent@agynexa.si'):
 global email
 email=uid();e='local-event-'+uid();token=uid();reserve(e=e,token=token)
 m={**message,'provider_email_id':email,'from_address':sender,'message_id':'<'+uid()+'@example.test>','references':[reference] if reference else [],'in_reply_to':reference}
 return complete(e=e,token=token,m=m,inbox=inbox)
assert ingest('sender@example.test')['thread_id']!=first['thread_id'];checks.append('subject alone never merges')
assert ingest('other@example.test','<one@example.test>')['thread_id']!=first['thread_id'];checks.append('forged reference across external sender starts new thread')
assert ingest('sender@example.test','<one@example.test>')['thread_id']==first['thread_id'];checks.append('same inbox sender reference groups as untrusted hint')
assert ingest('sender@example.test','<one@example.test>','different@example.test')['thread_id']!=first['thread_id'];checks.append('reference cannot cross inbox boundary')
# Lease recovery and transactional failure leave original event retryable.
e='local-event-'+uid();token=uid();email=uid();reserve(e=e,token=token);sql(f"update public.nexa_mail_events set lease_until=now()-interval '1 second' where event_id='{e}'")
newtoken=uid();assert reserve(e=e,token=newtoken)['state']=='acquired';checks.append('expired lease can be reclaimed')
assert complete(e=e,token=token)['state']=='lease_lost';checks.append('stale worker cannot complete reclaimed event')
# Exact draft approval and durable outbox transitions, without any provider call.
def rpc(name,args):
 vals=[]
 for value in args:
  if value is None:vals.append('null')
  elif isinstance(value,(dict,list)):vals.append("'"+json.dumps(value).replace("'","''")+"'::jsonb")
  elif isinstance(value,int):vals.append(str(value))
  else:vals.append("'"+str(value).replace("'","''")+"'")
 return json.loads(sql('set role service_role;select public.'+name+'('+','.join(vals)+');').splitlines()[-1])
payload={'from':'NEXA Agent AI Business Assistant AGYNEXA <nexa.agent@agynexa.si>','to':['customer@example.test'],'cc':[],'bcc':[],'subject':'Synthetic draft approval','text':'Exact text','headers':{}}
request_key=uid();d=rpc('nexa_mail_save_draft',[None,actor,request_key,0,'c'*64,payload,None])['draft'];did=d['id']
assert rpc('nexa_mail_save_draft',[None,actor,request_key,0,'c'*64,payload,None])['draft']['id']==did;checks.append('draft create request is idempotent')
assert rpc('nexa_mail_save_draft',[None,actor,request_key,0,'d'*64,payload,None])['state']=='conflict';checks.append('changed draft create replay conflicts')
assert rpc('nexa_mail_queue',[did,actor,1,'c'*64,uid()])['state']=='approval_required';checks.append('no queue before exact approval')
assert rpc('nexa_mail_approve',[did,actor,1,'d'*64])['state']=='conflict';checks.append('approval wrong hash conflicts')
assert rpc('nexa_mail_approve',[did,actor,1,'c'*64])['state']=='approved';checks.append('exact version and hash approval persists')
d=rpc('nexa_mail_save_draft',[did,actor,uid(),1,'d'*64,{**payload,'text':'Edited after approval'},None])['draft'];assert d['version']==2 and d['approved_version'] is None and d['status']=='draft';checks.append('edit invalidates old approval')
assert rpc('nexa_mail_queue',[did,actor,1,'c'*64,uid()])['state']=='approval_required';checks.append('stale approved version cannot queue')
rpc('nexa_mail_approve',[did,actor,2,'d'*64]);queue_key=uid();o=rpc('nexa_mail_queue',[did,actor,2,'d'*64,queue_key])['outbox'];oid=o['id']
assert rpc('nexa_mail_queue',[did,actor,2,'d'*64,queue_key])['outbox']['id']==oid and rpc('nexa_mail_queue',[did,actor,2,'d'*64,uid()])['outbox']['id']==oid;checks.append('one frozen outbox intent per approved version')
assert rpc('nexa_mail_save_draft',[did,actor,uid(),2,'e'*64,payload,None])['state']=='conflict';checks.append('queued approved snapshot is immutable')
attempt=uid();assert rpc('nexa_mail_claim',[oid,actor,attempt])['state']=='claimed';assert rpc('nexa_mail_claim',[oid,actor,uid()])['state']=='sending';checks.append('concurrent manual dispatch claims only once')
assert rpc('nexa_mail_finish',[oid,actor,uid(),'accepted',uid(),None])['state']=='conflict';checks.append('wrong dispatch lease cannot finalize')
assert rpc('nexa_mail_finish',[oid,actor,attempt,'delivery_unknown',None,'provider_send_unknown'])['state']=='delivery_unknown';assert rpc('nexa_mail_claim',[oid,actor,uid()])['state']=='delivery_unknown';checks.append('ambiguous send does not get a new intent or retry')
# Actual database RPC grants also deny every ordinary application role.
for role in ['anon','authenticated']:
 assert sql(f"select count(*) from pg_proc where pronamespace='public'::regnamespace and proname like 'nexa_mail_%' and has_function_privilege('{role}',oid,'EXECUTE')")=='0';checks.append(role+' cannot call service-only mail RPCs')
# Cleanup exact synthetic local actor draft/outbox/audit rows, no production IDs.
sql(f"delete from public.nexa_mail_audit where actor_id='{actor}'; delete from public.nexa_mail_outbox where created_by='{actor}'; delete from public.nexa_mail_drafts where created_by='{actor}';")

# Fixture cleanup, all synthetic rows only; local isolated database retained.
sql("delete from public.nexa_mail_events where event_id like 'local-event-%'; delete from public.nexa_mail_messages where from_address in ('sender@example.test','other@example.test'); delete from public.nexa_mail_threads t where not exists(select 1 from public.nexa_mail_messages m where m.thread_id=t.id);")
print(json.dumps({'status':'PASS','environment':'ISOLATED_LOCAL_POSTGRES','checks':checks,'count':len(checks),'liveMailOrHostedDbChanges':False},indent=2))
