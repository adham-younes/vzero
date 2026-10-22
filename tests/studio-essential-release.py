"""Affected full HTTP paths against isolated Auth/Postgres and fixed provider boundaries."""
import json,http.cookiejar,urllib.request,urllib.error,uuid,secrets,base64,hmac,hashlib,time,subprocess
from pathlib import Path
BASE='http://localhost:3031';ROOT=Path(__file__).resolve().parents[1];WORK=ROOT.parent
assert json.loads(Path('/tmp/agynexa-local-status.json').read_text())['API_URL']=='http://127.0.0.1:54321'
class Policy(http.cookiejar.DefaultCookiePolicy):
 def return_ok_secure(self,c,r):return r.full_url.startswith(BASE+'/') or super().return_ok_secure(c,r)
def client():
 jar=http.cookiejar.CookieJar(policy=Policy());return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar)),jar
def req(c,p,b=None,m=None,h=None):
 raw=b if isinstance(b,bytes) else json.dumps(b).encode() if b is not None else None
 r=urllib.request.Request(BASE+p,data=raw,method=m,headers={'Content-Type':'application/json','Origin':BASE,**(h or {})})
 try:r=c.open(r,timeout=65)
 except urllib.error.HTTPError as e:r=e
 return r.status,json.loads(r.read())
def uid():return str(uuid.uuid4())
def sql(q):return subprocess.check_output(['docker','--context','colima-agynexa-release','exec','agynexa-studio-local-db-1','psql','-U','postgres','-At','-v','ON_ERROR_STOP=1','-c',q],text=True).strip()
checks=[]
def check(n,c):
 assert c,n;checks.append(n)
a,jar=client();b,bjar=client();anon,_=client();account=json.loads((WORK/'essential-local-account.json').read_text())
check('existing isolated owner signs in',req(a,'/api/auth/login',{k:account[k] for k in ['email','password']})[0]==200)
other={'name':'Synthetic owner','email':'essential-other-'+secrets.token_hex(5)+'@example.test','password':secrets.token_urlsafe(24)}
check('second same-name isolated account created',req(b,'/api/auth/register',other)[0]==201)
for c in [a,b]:check('verified owner workspace initialized',req(c,'/api/v1/workspace/chat',{'locale':'ar'})[0]==200)
agent=req(a,'/api/v1/workspace/chat',{'locale':'ar'})[1]['agent'];aid=agent['id'];cid=uid()
check('anonymous projects denied',req(anon,'/api/v1/projects')[0]==401)
body={'requestKey':uid(),'kind':'project.create','payload':{'name':'Synthetic project','description':'A private isolated review'}}
s,d=req(a,'/api/v1/studio/actions',body);check('proposal saved',s==201);act=d['action'];actionpath='/api/v1/studio/actions/'+act['id']+'/apply';review={'version':1,'snapshotHash':act['snapshot_hash']}
check('proposal has no entity side effect',req(a,'/api/v1/projects')[1]['projects']==[])
check('exact proposal replay',req(a,'/api/v1/studio/actions',body)[1]['action']['id']==act['id'])
check('changed request key conflicts',req(a,'/api/v1/studio/actions',{**body,'payload':{'name':'Different','description':''}})[0]==409)
check('foreign origin denied',req(a,'/api/v1/studio/actions',body,h={'Origin':'https://attacker.test'})[0]==403)
check('caller actor field denied',req(a,'/api/v1/studio/actions',{**body,'actorId':account['id']})[0]==400)
check('unknown action denied',req(a,'/api/v1/studio/actions',{**body,'kind':'email.send'})[0]==400)
check('other immutable owner cannot apply',req(b,actionpath,review)[0]==404)
check('wrong exact review denied',req(a,actionpath,{**review,'snapshotHash':'0'*64})[0]==409)
s,d=req(a,actionpath,review);check('exact apply creates project',s==200);pid=d['result']['id']
check('apply replay returns same entity',req(a,actionpath,review)[1]['result']['id']==pid)
check('project cannot be read by second account',req(b,'/api/v1/projects/'+pid)[0]==404 and req(b,'/api/v1/projects')[1]['projects']==[])
def apply(kind,payload):
 s,d=req(a,'/api/v1/studio/actions',{'requestKey':uid(),'kind':kind,'payload':payload});assert s==201,(kind,s,d)
 x=d['action'];s,d=req(a,'/api/v1/studio/actions/'+x['id']+'/apply',{'version':1,'snapshotHash':x['snapshot_hash']});assert s==200,(kind,s,d);return d
x=apply('task.create',{'projectId':pid,'title':'Synthetic task','description':'Check saved status'});tid=x['result']['id']
apply('task.set_status',{'projectId':pid,'taskId':tid,'status':'done','expectedRevision':1})
apply('project.set_status',{'projectId':pid,'status':'completed','expectedRevision':1})
s,detail=req(a,'/api/v1/projects/'+pid);check('real task status and activity persisted',s==200 and detail['project']['revision']==2 and detail['tasks'][0]['status']=='done' and len(detail['activity'])==4)
s,d=req(a,'/api/v1/studio/actions',{'requestKey':uid(),'kind':'task.set_status','payload':{'projectId':pid,'taskId':tid,'status':'blocked','expectedRevision':1}});x=d['action'];check('stale task revision rejected',req(a,'/api/v1/studio/actions/'+x['id']+'/apply',{'version':1,'snapshotHash':x['snapshot_hash']})[0]==409)
x=apply('agent.create',{'name':'Synthetic saved assistant','instructions':'Prepare drafts from user supplied facts.','language':'ar','template':'serviceflow','model':'openai/gpt-oss-20b','builder':True});newid=x['result']['id'];check('reviewed saved assistant is distinct usable customer agent',newid!=aid and req(a,'/api/v1/agents/'+newid)[1]['agent']['chat_profile']=='customer_v1')
for text in ['من انت ؟','عربي','من انت وما مهاراتك']:
 s,d=req(a,f'/api/v1/agents/{aid}/test-runs',{'message':text,'requestKey':uid(),'conversationId':cid});check('Arabic identity/followup succeeds without unrelated sector',s==200 and d['run']['status']=='succeeded' and 'أنا' in d['run']['answer'] and 'retail' not in d['run']['answer'])
s,hist=req(a,f'/api/v1/agents/{aid}/conversations/{cid}');check('conversation reload persists all three scoped turns',s==200 and len(hist['runs'])==3)
check('cross-owner conversation denied',req(b,f'/api/v1/agents/{aid}/conversations/{cid}')[0]==404)
# Mail uses real app/admin/RLS/transaction paths and entirely synthetic provider responses.
check('ordinary owner mail access denied',req(b,'/api/admin/nexa-mail')[0]==403)
check('anonymous mail denied',req(anon,'/api/admin/nexa-mail')[0]==401)
check('server domain readiness adapter bound to configured account',req(a,'/api/admin/nexa-mail?verifyProvider=true')[1]['providerDomain']=={'status':'verified','accountMatched':True})
mail={'requestKey':uid(),'to':['recipient@example.test'],'cc':[],'bcc':[],'subject':'Synthetic review only','text':'A plain synthetic draft.'}
s,d=req(a,'/api/admin/nexa-mail/drafts',mail);check('admin draft saved',s==200);draft=d['draft'];dp='/api/admin/nexa-mail/drafts/'+draft['id'];v={'version':draft['version'],'snapshotHash':draft['snapshot_hash']}
check('queue requires exact approval',req(a,dp+'/queue',{**v,'requestKey':uid()})[0]==409)
check('wrong hash approval denied',req(a,dp+'/approve',{**v,'snapshotHash':'0'*64})[0]==409)
check('exact saved approval succeeds',req(a,dp+'/approve',v)[0]==200)
s,d=req(a,dp,{**{k:mail[k] for k in ['to','cc','bcc','subject','text']},'version':1,'text':'Edited plain synthetic draft.'},'PATCH');draft=d['draft'];check('edit invalidates approval and increments version',s==200 and draft['approved_hash'] is None and draft['version']==2)
v={'version':2,'snapshotHash':draft['snapshot_hash']};check('edited draft requires new approval',req(a,dp+'/queue',{**v,'requestKey':uid()})[0]==409)
check('new exact version approved',req(a,dp+'/approve',v)[0]==200);q={**v,'requestKey':uid()};s,d=req(a,dp+'/queue',q);o=d['outbox'];check('approved outbox queued without dispatch',s==200 and o['status']=='queued')
check('queue retry returns same outbox',req(a,dp+'/queue',q)[1]['outbox']['id']==o['id'])
s,d=req(a,'/api/admin/nexa-mail/outbox/'+o['id']+'/send',{});check('synthetic manual dispatch records provider acceptance only',s==200 and d['outbox']['status']=='accepted')
check('accepted intent cannot cause a fresh send',req(a,'/api/admin/nexa-mail/outbox/'+o['id']+'/send',{})[1]['outbox']['provider_id']==d['outbox']['provider_id'])

state={'account':account,'other':other,'agent':aid,'conversation':cid,'project':pid,'newAgent':newid,'draft':draft,'outbox':o,'checks':checks,'cookies':[{'name':c.name,'value':c.value,'domain':'localhost','path':'/','httpOnly':True,'secure':True,'sameSite':'Lax'} for c in jar]};p=WORK/'essential-browser-state.json';p.write_text(json.dumps(state));p.chmod(0o600)
email=uid();eventid='isolated_'+uid();payload=json.dumps({'type':'email.received','created_at':'2026-10-22T10:00:00Z','data':{'email_id':email,'to':['nexa-inbound@synthetic.resend.app']}}).encode();ts=str(int(time.time()));sig=base64.b64encode(hmac.new(b'synthetic-signature-key-not-real',(eventid+'.'+ts+'.').encode()+payload,hashlib.sha256).digest()).decode();headers={'svix-id':eventid,'svix-timestamp':ts,'svix-signature':'v1,'+sig}
check('unsigned webhook rejected',req(anon,'/api/webhooks/resend',payload)[0]==400)
check('signed raw webhook stores durable message',req(anon,'/api/webhooks/resend',payload,h=headers)[0]==200)
check('same signed event replay is idempotent',req(anon,'/api/webhooks/resend',payload,h=headers)[1].get('replayed') is True)
threads=req(a,'/api/admin/nexa-mail')[1]['threads'];thread=next(x for x in threads if x['subject']=='Isolated inbound fixture');tp='/api/admin/nexa-mail/threads/'+thread['id'];message=req(a,tp)[1]['messages'][0]
check('plain untrusted content stored without HTML/download fields',message['sender_trust']=='unverified' and message['text'].startswith('<script>') and 'html' not in message and 'download_url' not in json.dumps(message))
s,d=req(a,tp,{'isRead':True,'archived':True},'PATCH');check('thread state and audit use transaction',s==200 and d['thread']['archived'] and sql("select count(*) from public.nexa_mail_audit where object_id='"+thread['id']+"' and action='thread_state_changed'")=='1')
check('mail CSRF rejected',req(a,dp+'/approve',v,h={'Origin':'https://attacker.test'})[0]==403)
# Keep only these synthetic fixtures until browser pass, then remove exact IDs.
state={'account':account,'other':other,'agent':aid,'conversation':cid,'project':pid,'newAgent':newid,'mailThread':thread['id'],'cookies':[{'name':c.name,'value':c.value,'domain':'localhost','path':'/','httpOnly':True,'secure':True,'sameSite':'Lax'} for c in jar]};p=WORK/'essential-browser-state.json';p.write_text(json.dumps(state));p.chmod(0o600)
out=ROOT/'docs/launch/2026-10-22/evidence/essential-local-http.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps({'environment':'isolated Auth/Postgres; fixed provider HTTP responses; no real email/inference','checks':checks,'status':'PASS'},indent=2)+'\n');print('PASS',len(checks),'affected real HTTP/Auth/DB/mail checks')
