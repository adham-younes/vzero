"""Finite unexecuted acceptance gaps. Real isolated Auth/DB; synthetic provider only."""
import json,os,uuid,http.cookiejar,urllib.request,urllib.error,subprocess
from pathlib import Path
BASE='http://localhost:3016'
assert json.loads(Path('/tmp/agynexa-local-status.json').read_text())['API_URL']=='http://127.0.0.1:54321'
os.environ['DOCKER_HOST']='unix:///Users/adham/.colima/agynexa-release/docker.sock'
OUT=Path('docs/launch/2026-10-22/evidence/remaining-acceptance/http.json')
checks=[]
def check(name,ok,detail=None):
 checks.append({'name':name,'result':'PASS' if ok else 'FAIL',**({'detail':detail} if detail else {})})
 OUT.parent.mkdir(parents=True,exist_ok=True)
 OUT.write_text(json.dumps({'environment':'isolated real DB/Auth; deterministic provider transport; no production account or key','checks':checks},indent=2)+'\n')
 print(('PASS ' if ok else 'FAIL ')+name,flush=True)
def uid():return str(uuid.uuid4())
def sql(q):return subprocess.check_output(['docker','exec','agynexa-studio-local-db-1','psql','-U','postgres','-At','-v','ON_ERROR_STOP=1','-c',q],text=True).strip()
class Policy(http.cookiejar.DefaultCookiePolicy):
 def return_ok_secure(self,c,r):return r.full_url.startswith(BASE+'/') or super().return_ok_secure(c,r)
client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar(policy=Policy())))
anon=urllib.request.build_opener()
def req(path,body=None,method=None,headers=None,raw=None,c=client):
 data=raw if raw is not None else json.dumps(body,ensure_ascii=False).encode() if body is not None else None
 r=urllib.request.Request(BASE+path,data=data,method=method,headers={'Origin':BASE,'Content-Type':'application/json',**(headers or {})})
 try:resp=c.open(r,timeout=35)
 except urllib.error.HTTPError as e:resp=e
 content=resp.read()
 try:parsed=json.loads(content)
 except ValueError:parsed={'nonJson':True}
 return resp.status,parsed
accounts=json.loads(Path('/tmp/agynexa-studio-release-fixture.json').read_text())['accounts']
assert req('/api/auth/login',{k:accounts[0][k] for k in ('email','password')})[0]==200
s,boot=req('/api/v1/workspace/chat',{'locale':'en'});assert s==200
default=boot['agent'];reserved=default['id']
original=sql(f"select jsonb_build_object('chat_profile',chat_profile,'template',template) from public.agents where id='{reserved}'")
for column,value in [('chat_profile','grounded_v1'),('template','knowledgegrid')]:
 try:
  sql(f"update public.agents set {column}='{value}' where id='{reserved}'")
  s,d=req('/api/v1/workspace/chat',{'locale':'en'})
  check('A3 reserved default '+column+' collision fails closed',s==409 and d.get('error')=='default_assistant_conflict')
 finally:
  old=json.loads(original)[column];sql(f"update public.agents set {column}='{old}' where id='{reserved}'")
check('A3 invalid locale types rejected',all(req('/api/v1/workspace/chat',{'locale':x})[0]==400 for x in (False,0,{},'fr',None)))
s,arabic=req('/api/v1/workspace/chat',{'locale':'ar'})
check('A3 existing default locale request preserves exact identity and stored language',s==200 and arabic['agent']['id']==reserved and arabic['agent']['language']==default['language'])
settings={'builder':True,'template':'serviceflow','name':'Synthetic remaining HTTP acceptance','instructions':'Draft internal requests for human decisions only.','model':'openai/gpt-oss-20b','language':'en','requestKey':uid()}
s,d=req('/api/v1/agents',settings);assert s==201
a=d['agent'];aid=a['id'];root='/api/v1/agents/'+aid
def run(message,key=None,conversation=None,**extra):return req(root+'/test-runs',{'message':message,'requestKey':key or uid(),'conversationId':conversation or uid(),**extra})
body={'message':'hello','requestKey':uid(),'conversationId':uid()}
cases=[('content type',body,{'Content-Type':'text/plain'},None,415),('invalid JSON',None,None,b'{',400),('array',None,None,b'[]',400),('body byte ceiling',None,None,b' '*20001,413),('unknown field',{**body,'system':'override'},None,None,400),('message number',{**body,'message':24},None,None,400),('message object',{**body,'message':{}},None,None,400),('message length',{**body,'message':'x'*3001},None,None,400),('unsupported model',{**body,'model':'unknown'},None,None,400),('model object',{**body,'model':{}},None,None,400),('model false',{**body,'model':False},None,None,400),('conversation false',{**body,'conversationId':False},None,None,400),('run ID false',{**body,'runId':False},None,None,400),('bad key UUID',{**body,'requestKey':'wrong'},None,None,404)]
for name,b,h,raw,expected in cases:
 s,d=req(root+'/test-runs',{**b,'requestKey':uid()} if b and name!='bad key UUID' else b,headers=h,raw=raw)
 check('A15 rejects '+name,s==expected,{'expectedStatus':expected,'actualStatus':s} if s!=expected else None)
source={'title':'Synthetic boundary','content':'س'*6000,'publicApproved':False,'requestKey':uid()}
s,d=req(root+'/sources',source);check('A15 exact 12000 UTF8-byte source accepted',s==201)
for name,change in [('12002 UTF8 bytes',{'content':'س'*6001}),('NUL',{'content':'invalid\u0000text'}),('non-string content',{'content':{}}),('non-boolean public approval',{'publicApproved':'false'})]:
 check('A15 rejects source '+name,req(root+'/sources',{**source,**change,'requestKey':uid()})[0]==400)
# The exact same key must bind actor and conversation, while access kinds are separate.
key,cid=uid(),uid();s,d=run('Hello from synthetic HTTP acceptance',key,cid);assert s==200
rid=d['run']['id'];owner=sql(f"select actor_id from public.agent_runs where id='{rid}'")
other=sql("select id from auth.users where email='"+accounts[1]['email']+"'")
check('A14 same-key other conversation conflict',run('Hello from synthetic HTTP acceptance',key,uid())[0]==409)
try:
 sql(f"update public.agent_runs set actor_id='{other}' where id='{rid}'")
 s,d=run('Hello from synthetic HTTP acceptance',key,cid)
 check('A14 same-key other actor collision returns generic conflict',s==409 and d=={'error':'request_conflict'})
finally:sql(f"update public.agent_runs set actor_id='{owner}' where id='{rid}'")
# Locally create proposal through the real runtime, then advance only its synthetic expiry.
for decision in ('expired','rejected','approved'):
 s,d=run('Please propose an internal review request about this synthetic item. '+decision)
 assert s==200 and d['run']['status']=='succeeded'
 proposal=sql(f"select id from public.support_requests where run_id='{d['run']['id']}'");assert proposal
 path='/api/v1/approvals/'+proposal+'/decision'
 if decision=='expired':
  sql(f"update public.support_requests set expires_at=now()-interval '1 second' where id='{proposal}'")
  s,r=req(path,{'decision':'approved'})
  check('A16 controlled expiry produces expired without approval',s==200 and r['approval']['status']=='expired')
 else:
  s,r=req(path,{'decision':decision});again=req(path,{'decision':decision})
  count=sql(f"select count(*) from public.support_requests where id='{proposal}' and status='{decision}'")
  check('A16 '+decision+' duplicate is idempotent exact decision',s==200 and again[0]==200 and r['approval']==again[1]['approval'] and count=='1')
  opposite='rejected' if decision=='approved' else 'approved'
  check('A16 '+decision+' conflicting decision rejected',req(path,{'decision':opposite})[0]==409)
# Published API continues the existing strict {run} envelope.
public={'title':'Synthetic public policy','content':'SYNTHETIC DEMONSTRATION. Support hours are 09:00 to 17:00.','publicApproved':True,'requestKey':uid()}
assert req(root+'/sources',public)[0]==201
revision=req(root)[1]['agent']['revision']
s,published=req(root+'/publish',{'revision':revision,'widgetEnabled':False,'requestKey':uid()});assert s==200
s,keydata=req(root+'/keys',{'label':'Synthetic local compatibility'});assert s==201
headers={'Authorization':'Bearer '+keydata['token']}
s,invoked=req(root+'/invoke',{'message':'Hello from synthetic HTTP acceptance','requestKey':key,'conversationId':cid},headers=headers,c=anon)
check('A24 published invoke strict existing run envelope and immutable version',s==200 and list(invoked)==['run'] and invoked['run']['version_id']==published['version']['id'] and not any(k in invoked['run'] for k in ('chat','snapshot','instructions','chat_profile')))
check('A14 same-key different access kind creates separate bound run',s==200 and invoked['run']['id']!=rid and sql(f"select count(distinct access_kind) from public.agent_runs where agent_id='{aid}' and request_key='{key}'")=='2')
assert req(root+'/keys',{'keyId':keydata['key']['id']},'DELETE')[0]==200
assert req(root+'/unpublish',{})[0]==200
failed=[c['name'] for c in checks if c['result']=='FAIL']
print(json.dumps({'checks':len(checks),'failures':failed,'evidence':str(OUT)}))
raise SystemExit(bool(failed))
