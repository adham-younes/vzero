"""Real Auth + Data API integration checks. LOCAL ONLY; no hosted writes.
Start the isolated stack and app per agent-studio/STAGE-B.md, then:
python tests/studio-http.py /tmp/agynexa-local-status.json
"""
import base64, http.cookiejar, json, secrets, sys, uuid, urllib.request, urllib.error
from pathlib import Path
BASE='http://localhost:3016'
DB='http://127.0.0.1:54321'
config=json.loads(Path(sys.argv[1]).read_text())
assert config['API_URL']==DB, 'Only the isolated loopback stack is allowed'
key=config['ANON_KEY']
class LocalCookiePolicy(http.cookiejar.DefaultCookiePolicy):
 def return_ok_secure(self,cookie,request):
  # Exercise a production build on loopback HTTP; verify Secure separately.
  return request.full_url.startswith(BASE+'/') or super().return_ok_secure(cookie,request)
def client():
 jar=http.cookiejar.CookieJar(policy=LocalCookiePolicy())
 return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar)),jar
def request(c,path,body=None,method=None,origin=BASE,extra=None,base=BASE):
 headers={'Origin':origin,'Content-Type':'application/json',**(extra or {})}
 req=urllib.request.Request(base+path,data=json.dumps(body).encode() if body is not None else None,headers=headers,method=method)
 try:r=c.open(req,timeout=25)
 except urllib.error.HTTPError as e:r=e
 raw=r.read();return r.status,json.loads(raw) if raw else None,{k.lower():v for k,v in r.headers.items()}
def token(jar):
 parts=sorted((c.name,c.value) for c in jar if 'auth-token' in c.name)
 value=''.join(v for _,v in parts);assert value.startswith('base64-')
 raw=value[7:];return json.loads(base64.urlsafe_b64decode(raw+'='*((4-len(raw)%4)%4)))['access_token']
checks=[]
def check(name,condition):
 assert condition,name
 checks.append(name)
def rest(tok,path,body=None,method=None):return request(urllib.request.build_opener(),'/rest/v1/'+path,body,method,extra={'apikey':key,'Authorization':'Bearer '+tok,'Prefer':'return=representation'},base=DB)
a,aj=client();b,bj=client();anon,_=client()
suffix=secrets.token_hex(6)
accounts=[{'email':f'studio-{suffix}-{i}@example.test','password':secrets.token_urlsafe(24),'name':'Synthetic studio owner '+str(i)} for i in [1,2]]
check('anonymous Studio denied',request(anon,'/api/v1/agents')[0]==401)
for c,acct in [(a,accounts[0]),(b,accounts[1])]:
 check('register and automatic login',request(c,'/api/auth/register',acct)[0]==201 and request(c,'/api/account')[0]==200)
check('secure HttpOnly cookies',all(c.secure and c.has_nonstandard_attr('HttpOnly') for c in aj if 'auth-token' in c.name))
check('workspace absent before initialization',request(a,'/api/v1/agents')[1]=={'workspace':None,'agents':[]})
check('workspace CSRF blocked',request(a,'/api/v1/workspace',{},origin='https://other.example')[0]==403)
check('workspace rejects caller identity',request(a,'/api/v1/workspace',{'owner_id':str(uuid.uuid4())})[0]==400)
org_a=request(a,'/api/v1/workspace',{})[1]['workspace']['id']
org_b=request(b,'/api/v1/workspace',{})[1]['workspace']['id']
check('separate organizations',org_a!=org_b)
check('workspace initialization idempotent',request(a,'/api/v1/workspace',{})[1]['workspace']['id']==org_a)
tok_a,tok_b=token(aj),token(bj)
check('bootstrap RPC reuses owner workspace',rest(tok_a,'rpc/initialize_workspace',{})[:2]==(200,org_a))
check('membership injection denied',rest(tok_b,'memberships',{'org_id':org_a,'user_id':str(uuid.uuid4()),'role':'owner'})[0]>=400)
check('organization reassignment denied',rest(tok_a,f'organizations?id=eq.{org_a}',{'owner_id':str(uuid.uuid4())},'PATCH')[0]>=400)
body={'requestKey':str(uuid.uuid4()),'template':'knowledgegrid','name':'معرفة الفريق','instructions':'أجب من المصادر المعتمدة فقط.','language':'ar','model':'openai/gpt-oss-120b'}
check('create CSRF blocked',request(a,'/api/v1/agents',body,origin='https://other.example')[0]==403)
check('org injection rejected by API',request(a,'/api/v1/agents',{**body,'org_id':org_b})[0]==400)
check('unsupported model rejected',request(a,'/api/v1/agents',{**body,'model':'invented/model'})[0]==400)
check('oversized instructions rejected',request(a,'/api/v1/agents',{**body,'instructions':'x'*6001})[0]==400)
s,data,_=request(a,'/api/v1/agents',body);check('KnowledgeGrid persisted',s==201);agent=data['agent'];aid=agent['id']
check('create replay idempotent',request(a,'/api/v1/agents',body)[1]['agent']['id']==aid)
check('changed replay conflicts',request(a,'/api/v1/agents',{**body,'name':'Changed'})[0]==409)
check('foreign agent absent from list',request(b,'/api/v1/agents')[1]['agents']==[])
check('foreign direct agent read denied',request(b,'/api/v1/agents/'+aid)[0]==404)
settings={k:body[k] for k in ['name','instructions','language','model']};settings['revision']=1
check('foreign update denied',request(b,'/api/v1/agents/'+aid,settings,'PATCH')[0]==404)
check('cross-org Data API read empty',rest(tok_b,'agents?id=eq.'+aid)[:2]==(200,[]))
check('cross-org Data API update empty',rest(tok_b,'agents?id=eq.'+aid,{'name':'attack'},'PATCH')[:2]==(200,[]))
check('anonymous Data API denied',rest(key,'agents')[0]>=400)
check('anonymous bootstrap RPC denied',rest(key,'rpc/initialize_workspace',{})[0]>=400)
check('tenant rewrite denied',rest(tok_a,'agents?id=eq.'+aid,{'org_id':org_b},'PATCH')[0]>=400)
check('revision forging denied',rest(tok_a,'agents?id=eq.'+aid,{'revision':999},'PATCH')[0]>=400)
user_a=json.loads(base64.urlsafe_b64decode(tok_a.split('.')[1]+'='*((4-len(tok_a.split('.')[1])%4)%4)))['sub']
check('cross-org Data API insert denied',rest(tok_a,'agents',{'org_id':org_b,'created_by':user_a,'request_key':str(uuid.uuid4()),'template':'knowledgegrid',**{k:body[k] for k in ['name','instructions','language','model']}})[0]>=400)
changed={**settings,'name':'Saved after login','instructions':'Only approved sources. Cite each answer.','language':'en','model':'qwen/qwen3.8-27b'}
s,d,h=request(a,'/api/v1/agents/'+aid,changed,'PATCH');check('settings update increments revision',s==200 and d['agent']['revision']==2)
check('private no-store API','no-store' in h['cache-control'])
check('stale update rejected',request(a,'/api/v1/agents/'+aid,settings,'PATCH')[0]==409)
saved_cookie='; '.join(c.name+'='+c.value for c in aj)
check('logout succeeds',request(a,'/api/auth/logout',{})[0]==200)
check('logged out account denied',request(a,'/api/account')[0]==401)
check('stale browser session asks for sign in instead of account outage',request(anon,'/api/account',extra={'Cookie':saved_cookie})[0]==401)
check('revoked JWT has no profile Data API access',rest(tok_a,'profiles')[:2]==(200,[]))
check('revoked JWT has no agent Data API access',rest(tok_a,'agents')[:2]==(200,[]))
check('revoked JWT bootstrap denied',rest(tok_a,'rpc/initialize_workspace',{})[0]>=400)
check('login succeeds without email',request(a,'/api/auth/login',accounts[0])[0]==200)
s,d,_=request(a,'/api/v1/agents/'+aid);check('settings survive logout and login',s==200 and all(d['agent'][k]==v for k,v in changed.items() if k!='revision') and d['agent']['revision']==2)
s,d,_=request(a,'/api/v1/agents',{**body,'requestKey':str(uuid.uuid4()),'template':'serviceflow','name':'Support agent'});check('ServiceFlow persists in same workspace',s==201 and d['agent']['org_id']==org_a)
brief={'requestKey':str(uuid.uuid4()),'organization':'Synthetic brief','email':accounts[0]['email'],'service':'KnowledgeGrid','problem':'Synthetic problem','sources':'Test data','acceptance':'Saved','consent':True}
s,d,_=request(a,'/api/v1/project-briefs',brief);check('existing project brief creation preserved',s==201);brief_id=d['brief']['id']
check('existing brief isolation preserved',request(b,'/api/v1/project-briefs')[1]['briefs']==[])
check('existing brief owner deletion preserved',request(a,'/api/v1/project-briefs',{'id':brief_id},'DELETE')[0]==200)
# Store synthetic credentials outside the repo only, for the browser acceptance test.
p=Path('/tmp/agynexa-studio-synthetic.json');p.write_text(json.dumps({'accounts':accounts,'agentId':aid}));p.chmod(0o600)
for c in [a,b]:request(c,'/api/auth/logout',{})
out={'environment':'isolated local Supabase, production Next build','checks':checks,'passed':len(checks),'hosted_mutations':False,'credentials_recorded':False}
Path('/tmp/agynexa-studio-http-result.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False))
