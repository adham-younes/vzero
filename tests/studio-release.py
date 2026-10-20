"""Targeted release checks. Local loopback only; provider secrets are not mocked.
Production inference evaluation uses a separate, explicitly scoped release fixture.
"""
import base64,json,http.cookiejar,urllib.request,urllib.error,uuid,secrets,subprocess
from pathlib import Path
BASE='http://localhost:3016'; DB='http://127.0.0.1:54321'
config=json.loads(Path('/tmp/agynexa-local-status.json').read_text());assert config['API_URL']==DB
class Policy(http.cookiejar.DefaultCookiePolicy):
 def return_ok_secure(self,c,r):return r.full_url.startswith(BASE+'/') or super().return_ok_secure(c,r)
def client():
 jar=http.cookiejar.CookieJar(policy=Policy());return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar)),jar
def req(c,path,body=None,method=None,headers=None,base=BASE):
 r=urllib.request.Request(base+path,data=json.dumps(body).encode() if body is not None else None,method=method,headers={'Content-Type':'application/json','Origin':BASE,**(headers or {})})
 try:resp=c.open(r,timeout=65)
 except urllib.error.HTTPError as e:resp=e
 return resp.status,json.loads(resp.read())
def uid():return str(uuid.uuid4())
def sql(q):return subprocess.check_output(['docker','exec','agynexa-studio-local-db-1','psql','-U','postgres','-At','-c',q],text=True).strip()
checks=[]
def check(name,condition):
 if not condition:raise AssertionError(name)
 checks.append(name)
a,jar=client();b,bjar=client();anon,_=client();suffix=secrets.token_hex(5)
accounts=[{'email':f'release-{suffix}-{i}@example.test','password':secrets.token_urlsafe(24),'name':'Release fixture'} for i in range(2)]
for c,account in zip([a,b],accounts):
 status,data=req(c,'/api/auth/register',account);check('synthetic local registration',status==201)
 check('workspace initialized',req(c,'/api/v1/workspace',{})[0]==200)
settings={'template':'knowledgegrid','name':'Release agent','instructions':'Answer from sources only.','model':'openai/gpt-oss-120b','language':'en'}
s,body=req(a,'/api/v1/agents',{**settings,'requestKey':uid()});check('agent created',s==201);agent=body['agent'];aid=agent['id'];base='/api/v1/agents/'+aid
check('foreign owner denied',req(b,base+'/sources')[0]==404)
source={'title':'Office hours','content':'Support hours are 09:00 to 17:00. ساعات الدعم من التاسعة صباحاً حتى الخامسة مساءً.','publicApproved':True,'requestKey':uid()}
s,d=req(a,base+'/sources',source);check('source parsed into chunks',s==201);sid=d['source']['id']
check('source idempotency',req(a,base+'/sources',source)[1]['source']['id']==sid)
check('source changed replay denied',req(a,base+'/sources',{**source,'content':'Changed'})[0]==409)
check('source size enforced',req(a,base+'/sources',{**source,'requestKey':uid(),'content':'س'*9000})[0] in (400,413))
check('CSRF rejected',req(a,base+'/sources',source,headers={'Origin':'https://attacker.test'})[0]==403)
check('private source default explicit',req(a,base+'/sources',{**source,'title':'Secret','content':'Internal password is never public.','requestKey':uid(),'publicApproved':False})[0]==201)
key=uid();body={'message':'unobtainium spacecraft quux','requestKey':key}
s,r=req(a,base+'/test-runs',body);check('no evidence produces refusal without provider call',s==200 and r['run']['status']=='succeeded' and not r['run']['citations'])
check('run replay idempotent without conversation id',req(a,base+'/test-runs',body)[1]['run']['id']==r['run']['id'])
check('changed run replay denied',req(a,base+'/test-runs',{**body,'message':'Changed'})[0]==409)
s,r=req(a,base+'/test-runs',{'message':'Support hours','requestKey':uid()});check('missing real Groq key fails honestly',s==200 and r['run']['status']=='failed' and r['run']['error_code']=='provider_not_configured')
check('preview model cannot run for ordinary owner',req(a,base+'/test-runs',{'message':'Support hours','requestKey':uid(),'model':'qwen/qwen3.8-27b'})[0]==403)
s,d=req(a,base+'/publish',{'revision':1,'widgetEnabled':True,'requestKey':uid()});check('immutable version created',s==200);version=d['version'];oldinstructions=version['settings']['instructions']
changed={k:v for k,v in settings.items() if k!='template'};changed.update(revision=1,instructions='Updated draft only.')
check('draft updated',req(a,base,changed,'PATCH')[0]==200)
activity=req(a,base+'/activity')[1];check('published snapshot unchanged',activity['versions'][0]['settings']['revision']==1)
publicid=activity['publication']['public_id'];s,ws=req(anon,'/api/v1/widget/'+publicid+'/session',{});check('public widget session issued',s==200)
s,k=req(a,base+'/keys',{'label':'Release key'});check('key minted once',s==201);apiheaders={'Authorization':'Bearer '+k['token']}
check('private key hash not exposed',all('token_hash' not in item for item in req(a,base+'/activity')[1]['keys']))
check('API requires token',req(anon,base+'/invoke',{'message':'unobtainium','requestKey':uid()})[0]==401)
check('API invocation uses published version',req(anon,base+'/invoke',{'message':'unobtainium','requestKey':uid()},headers=apiheaders)[1]['run']['version_id']==version['id'])
check('widget cannot retrieve private source',req(anon,'/api/v1/widget/'+aid+'/invoke',{'message':'Internal password','requestKey':uid()},headers={'Authorization':'Bearer '+ws['token']})[1]['run']['usage'].get('retrieval')=='no_match')
check('unpublish stops API',req(a,base+'/unpublish',{})[0]==200 and req(anon,base+'/invoke',{'message':'unobtainium','requestKey':uid()},headers=apiheaders)[0]==404)
check('unpublish stops widget token',req(anon,'/api/v1/widget/'+aid+'/invoke',{'message':'Support','requestKey':uid()},headers={'Authorization':'Bearer '+ws['token']})[0]==404)
check('API key revoked',req(a,base+'/keys',{'keyId':k['key']['id']},'DELETE')[0]==200 and req(anon,base+'/invoke',{'message':'x','requestKey':uid()},headers=apiheaders)[0]==401)
check('source deletion removes chunks',req(a,base+'/sources/'+sid,{},'DELETE')[0]==200 and sql(f"select count(*) from public.knowledge_chunks where source_id='{sid}'")=='0')
# Direct Data API boundaries with a real owner JWT.
parts=sorted((c.name,c.value) for c in jar if 'auth-token' in c.name);encoded=''.join(v for _,v in parts)[7:];jwt=json.loads(base64.urlsafe_b64decode(encoded+'='*((4-len(encoded)%4)%4)))['access_token']
headers={'apikey':config['ANON_KEY'],'Authorization':'Bearer '+jwt}
check('Data API cannot read key hashes',req(anon,'/rest/v1/agent_api_keys?select=token_hash',headers=headers,base=DB)[0]>=400)
check('Data API cannot alter versions',req(anon,'/rest/v1/agent_versions?id=eq.'+version['id'],{'settings':{}},'PATCH',headers=headers,base=DB)[0]>=400)
check('Data API cannot invoke privileged run writer',req(anon,'/rest/v1/rpc/start_agent_run',{'run':{},'concurrency_limit':5},headers=headers,base=DB)[0]>=400)
check('cross workspace source mutation denied',req(b,base+'/sources/'+sid,{},'DELETE')[0]==404)
check('anonymous Studio remains denied',req(anon,'/api/v1/agents')[0]==401)
# Real local fixture for approval state transitions, not a claim of model tool execution.
actor=sql(f"select owner_id from public.organizations where id='{agent['org_id']}'")
rid=uid();approval=uid()
sql(f"insert into public.agent_runs(id,org_id,agent_id,conversation_id,actor_id,access_kind,request_key,input_hash,snapshot,model,question,status) values('{rid}','{agent['org_id']}','{aid}','{uid()}','{actor}','studio','{uid()}','fixture','{{}}','openai/gpt-oss-120b','fixture','succeeded'); insert into public.support_requests(id,org_id,agent_id,run_id,requested_by,title,details) values('{approval}','{agent['org_id']}','{aid}','{rid}','{actor}','Fixture support','Exact approved details');")
path='/api/v1/approvals/'+approval+'/decision'
check('approval prevents input substitution',req(a,path,{'decision':'approved','details':'changed'})[0]==400)
check('foreign approval denied',req(b,path,{'decision':'approved'})[0]==404)
check('approval persists once',req(a,path,{'decision':'approved'})[1]['approval']['status']=='approved' and req(a,path,{'decision':'approved'})[1]['approval']['id']==approval)
check('contradictory decision conflicts',req(a,path,{'decision':'rejected'})[0]==409)
check('no auth emails sent',sql("select count(*) from auth.users where email like 'release-%@example.test' and (confirmation_sent_at is not null or recovery_sent_at is not null)")=='0')
out={'environment':'isolated_local','checks':checks,'count':len(checks),'provider':'No local Groq keys; missing-key behavior only. Live evaluation must be recorded separately.','approval_fixture':'SQL-inserted synthetic proposal to verify real decision transaction.'}
Path('docs/agynexa-program/agent-studio/evidence/stage-cde').mkdir(parents=True,exist_ok=True)
Path('docs/agynexa-program/agent-studio/evidence/stage-cde/local.json').write_text(json.dumps(out,indent=2)+'\n')
Path('/tmp/agynexa-studio-release-fixture.json').write_text(json.dumps({'accounts':accounts,'agent':aid}));Path('/tmp/agynexa-studio-release-fixture.json').chmod(0o600)
print(json.dumps(out,indent=2))
