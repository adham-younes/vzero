"""Targeted integrated release gate: real local Auth/PostgREST/RLS and live selected Groq.
Never runs against production; synthetic fixture accounts stay on loopback.
"""
import base64,json,http.cookiejar,urllib.request,urllib.error,uuid,secrets,subprocess,concurrent.futures,os
from pathlib import Path
BASE='http://localhost:3016';DB='http://127.0.0.1:54321'
config=json.loads(Path('/tmp/agynexa-local-status.json').read_text());assert config['API_URL']==DB
out=Path('docs/launch/2026-10-22/evidence');out.mkdir(exist_ok=True)
checks=[]
def check(name,condition,detail=None):
 checks.append({'name':name,'result':'PASS' if condition else 'FAIL','detail':detail})
 (out/'security.json').write_text(json.dumps({'environment':'isolated-local-real-db-auth','provider':'Deterministic isolated model fixture; actual model access/semantic acceptance separately required in staged Vercel gate.','checks':checks},indent=2)+'\n')
 if not condition:raise AssertionError(name+': '+str(detail))
class Policy(http.cookiejar.DefaultCookiePolicy):
 def return_ok_secure(self,c,r):return r.full_url.startswith(BASE+'/') or super().return_ok_secure(c,r)
def client():
 jar=http.cookiejar.CookieJar(policy=Policy());return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar)),jar
def req(c,path,body=None,method=None,headers=None,base=BASE):
 r=urllib.request.Request(base+path,data=json.dumps(body).encode() if body is not None else None,method=method,headers={'Content-Type':'application/json','Origin':BASE,**(headers or {})})
 try:resp=c.open(r,timeout=310)
 except urllib.error.HTTPError as e:resp=e
 return resp.status,json.loads(resp.read())
def uid():return str(uuid.uuid4())
def sql(q):return subprocess.check_output(['docker','exec','agynexa-studio-local-db-1','psql','-U','postgres','-At','-v','ON_ERROR_STOP=1','-c',q],text=True).strip()
a,jar=client();b,bjar=client();anon,_=client();suffix=secrets.token_hex(5)
accounts=[{'email':f'launch-{suffix}-{i}@example.test','password':secrets.token_urlsafe(24),'name':'Synthetic local fixture'} for i in range(2)]
for c,account in zip([a,b],accounts):check('local real Auth registration',req(c,'/api/auth/register',account)[0]==201)
# Preserve existing private agent exactly while bootstrapping a separate assistant.
req(a,'/api/v1/workspace',{})
settings={'template':'knowledgegrid','name':'Personal baseline','instructions':'Private instructions unchanged.','model':'openai/gpt-oss-20b','language':'en','requestKey':uid()}
s,d=req(a,'/api/v1/agents',settings);check('legacy strict agent saved',s==201,d);personal=d['agent'];org=personal['org_id']
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:boot=list(pool.map(lambda _:req(a,'/api/v1/workspace/chat',{'locale':'en'}),range(10)))
check('ten concurrent bootstrap requests one distinct assistant',all(s==200 for s,d in boot) and len({d.get('agent',{}).get('id') for s,d in boot})==1,[(s,d.get('error')) for s,d in boot])
agent=boot[0][1]['agent'];aid=agent['id'];root='/api/v1/agents/'+aid
check('personal agent not overwritten/selected',aid!=personal['id'] and req(a,'/api/v1/agents/'+personal['id'])[1]['agent']['instructions']==settings['instructions'])
check('customer profile server owned',agent['chat_profile']=='customer_v1' and req(a,root,{'chatProfile':'customer_v1'},'PATCH')[0]==400)
check('foreign owner denied',req(b,root+'/sources')[0]==404 and req(b,root+'/conversations')[0]==404)
check('CSRF and unknown bootstrap inputs rejected',req(a,'/api/v1/workspace/chat',{'locale':'en'},headers={'Origin':'https://attacker.test'})[0]==403 and req(a,'/api/v1/workspace/chat',{'locale':'en','orgId':org})[0]==400)
check('all three mapped model choices exposed',len(req(a,'/api/v1/studio/models')[1]['models'])==3)
cid=uid()
def run(message,key=None,conversation=cid,model=None):return req(a,root+'/test-runs',{'message':message,'requestKey':key or uid(),'conversationId':conversation,**({'model':model} if model else {})})
s,r=run('I need to organize a weekly distribution exception review. We have three late orders and no carrier update. Help me prepare a draft and ask what is missing.')
check('source-free useful private draft',s==200 and r.get('run',{}).get('status')=='succeeded' and r['run'].get('chat',{}).get('schemaVersion')==2,r)
check('source-free response has no fake citations',not r['run']['citations'])
s,r=run('What is our company refund policy and exactly how many days are customers eligible?')
check('no-source company facts request missing evidence',r.get('run',{}).get('status')=='succeeded' and any(p['kind']=='missing_evidence' for p in r['run'].get('chat',{}).get('parts',[])),r)
source={'title':'Synthetic tool policy','content':'SYNTHETIC DEMONSTRATION ONLY. Approved tools are Python وTypeScript and SQL. Unopened items may be returned within 14 days with proof of purchase. This does not define eligibility for opened faulty items.','publicApproved':False,'requestKey':uid()}
s,d=req(a,root+'/sources',source);check('explicit source loaded private',s==201 and not d['source']['public_approved'],d);sid=d['source']['id']
check('Arabic UTF8 byte bound',req(a,root+'/sources',{**source,'requestKey':uid(),'content':'س'*9000})[0] in (400,413))
check('mixed Arabic Latin original text retrievable',sid in sql(f"select source_id from public.search_agent_knowledge_v2('{org}','{aid}',array['{sid}'::uuid],'TypeScript','')"))
key=uid();s,r=run('List the approved tools from the synthetic tool policy.',key)
check('grounded original citations',s==200 and r.get('run',{}).get('status')=='succeeded' and any('وTypeScript' in c['quote'] for c in r['run']['citations']),r);rid=r['run']['id']
s,follow=run('كرر القائمة السابقة')
check('Arabic contextual followup grounded',follow.get('run',{}).get('status')=='succeeded' and bool(follow['run']['citations']) and 'TypeScript' in follow['run']['answer'],follow)
read=req(a,root+'/conversations/'+cid)[1];check('complete conversation persisted',len(read.get('runs',[]))>=4 and any(x['id']==rid for x in read['runs']))
check('replay input mutation denied',run('Different input',key)[0]==409)
# Exact source-dependent internal request fixture; not a claim of model-delivered service.
actor=sql(f"select owner_id from public.organizations where id='{org}'")
approval=uid();sql(f"insert into public.support_requests(id,org_id,agent_id,run_id,requested_by,title,details) values('{approval}','{org}','{aid}','{rid}','{actor}','Synthetic internal review','Exact stored payload')")
path='/api/v1/approvals/'+approval+'/decision'
check('approval payload substitution rejected',req(a,path,{'decision':'approved','details':'changed'})[0]==400)
check('foreign approval denied',req(b,path,{'decision':'approved'})[0]==404)
# Rejected late completion cannot retain candidate output in chat metadata.
late=uid();lateconv=uid();latekey=uid()
sql(f"insert into public.agent_runs(id,org_id,agent_id,conversation_id,actor_id,access_kind,request_key,input_hash,snapshot,model,question) select '{late}',org_id,agent_id,'{lateconv}',actor_id,access_kind,'{latekey}','late-fixture',snapshot-'chat_v2',model,'Synthetic late completion' from public.agent_runs where id='{rid}';")
# A model output is rejected against a current-content hash change, even if source id is unchanged.
sql(f"update public.knowledge_chunks set content=content||' changed' where source_id='{sid}'")
finished=json.loads(sql(f"select public.finish_agent_run('{late}',(select jsonb_build_object('status','succeeded','answer',answer,'citations',citations,'usage',usage,'chat_v2',snapshot->'chat_v2') from public.agent_runs where id='{rid}'))"))
check('late hash-change completion cancelled with candidate metadata discarded',finished['status']=='cancelled' and 'chat_v2' not in finished['snapshot'])
latevisible=req(a,'/api/v1/runs/'+late)[1]['run'];check('cancelled run never exposes rejected chat',latevisible['answer'] is None and not latevisible['citations'] and 'chat' not in latevisible)

check('source deletion succeeds',req(a,root+'/sources/'+sid,{},'DELETE')[0]==200)
check('decision transaction rechecks revoked source',req(a,path,{'decision':'approved'})[1]['approval']['status']=='expired')
replay=run('List the approved tools from the synthetic tool policy.',key)[1]['run']
check('replay revoked content redacted',replay.get('historyState')=='knowledge_changed' and not replay['citations'] and 'TypeScript' not in replay['answer'],replay)
activity=req(a,root+'/activity')[1];check('activity answer and proposal redacted',all('TypeScript' not in str(x.get('answer')) for x in activity['runs']) and all(x['details']!='Exact stored payload' for x in activity['approvals']))
# Real authenticated Data API checks: revoked raw content is not another read path.
parts=sorted((c.name,c.value) for c in jar if 'auth-token' in c.name);encoded=''.join(v for _,v in parts)[7:];jwt=json.loads(base64.urlsafe_b64decode(encoded+'='*((4-len(encoded)%4)%4)))['access_token']
headers={'apikey':config['ANON_KEY'],'Authorization':'Bearer '+jwt}
check('raw snapshot/proposal reads unavailable to authenticated Data API',req(anon,'/rest/v1/agent_runs?select=snapshot',headers=headers,base=DB)[0]>=400 and req(anon,'/rest/v1/support_requests?select=details',headers=headers,base=DB)[0]>=400)
check('privileged run writer inaccessible',req(anon,'/rest/v1/rpc/start_agent_run',{'run':{},'concurrency_limit':6},headers=headers,base=DB)[0]>=400)
parts_b=sorted((c.name,c.value) for c in bjar if 'auth-token' in c.name);encoded_b=''.join(v for _,v in parts_b)[7:];jwt_b=json.loads(base64.urlsafe_b64decode(encoded_b+'='*((4-len(encoded_b)%4)%4)))['access_token']
check('foreign authenticated source row RLS hidden',req(anon,'/rest/v1/knowledge_sources?select=id&agent_id=eq.'+aid,headers={'apikey':config['ANON_KEY'],'Authorization':'Bearer '+jwt_b},base=DB)[1]==[])
# Private/public boundary, explicit publish only with approved source.
s,d=req(a,root+'/sources',{**source,'requestKey':uid(),'title':'Public sample','content':'SYNTHETIC PUBLIC DEMO. Support hours are 09:00 to 17:00.','publicApproved':True});psid=d['source']['id']
s,d=req(a,root+'/sources',{**source,'requestKey':uid(),'title':'Private sample','content':'Private launch code is amber-739.'});privateid=d['source']['id']
revision=req(a,root)[1]['agent']['revision'];s,d=req(a,root+'/publish',{'revision':revision,'widgetEnabled':True,'requestKey':uid()});check('explicit immutable public version',s==200,d)
activity=req(a,root+'/activity')[1];publicid=activity['publication']['public_id'];s,w=req(anon,'/api/v1/widget/'+publicid+'/session',{});check('widget session real',s==200)
s,wrun=req(anon,'/api/v1/widget/'+aid+'/invoke',{'message':'amber-739','requestKey':uid()},headers={'Authorization':'Bearer '+w['token']})
check('widget has no private discovery/source data',s==200 and 'amber-739' not in str(wrun.get('run',{}).get('answer')) and not wrun.get('run',{}).get('citations') and 'chat' not in wrun['run'],wrun)
check('public caller cannot opt into customer profile',req(anon,'/api/v1/widget/'+aid+'/invoke',{'message':'hello','requestKey':uid(),'builder':True},headers={'Authorization':'Bearer '+w['token']})[0]==400)
# Delete exactly this conversation, preserve sources/publication and other conversation.
other=uid();s,orun=run('Hello',conversation=other)
check('explicit conversation delete',req(a,root+'/conversations/'+cid,{},'DELETE')[1]['deleted'])
check('delete is actor/conversation scoped',req(a,root+'/conversations/'+cid)[1]['runs']==[] and len(req(a,root+'/conversations/'+other)[1]['runs'])==1 and req(a,root+'/sources')[0]==200)
check('legacy retention not silently activated',sql("select count(*) from public.agent_runs where retention_expires_at is not null")=='0')
check('no auth mail sent',sql("select count(*) from auth.users where email like 'launch-%@example.test' and (confirmation_sent_at is not null or recovery_sent_at is not null)")=='0')
Path('/tmp/agynexa-studio-release-fixture.json').write_text(json.dumps({'accounts':accounts,'agent':aid}));Path('/tmp/agynexa-studio-release-fixture.json').chmod(0o600)
print(json.dumps({'passed':len(checks),'evidence':str(out/'security.json')}))
