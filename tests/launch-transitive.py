"""Affected regression for transitive source influence; real local DB/Auth, deterministic provider."""
import json,hashlib,os,http.cookiejar,urllib.request,urllib.error,uuid,subprocess
from pathlib import Path
BASE='http://localhost:3016';config=json.loads(Path('/tmp/agynexa-local-status.json').read_text());assert config['API_URL']=='http://127.0.0.1:54321'
class Policy(http.cookiejar.DefaultCookiePolicy):
 def return_ok_secure(self,c,r):return r.full_url.startswith(BASE+'/') or super().return_ok_secure(c,r)
c=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar(policy=Policy())))
def req(path,body=None,method=None):
 request=urllib.request.Request(BASE+path,data=json.dumps(body).encode() if body is not None else None,method=method,headers={'Content-Type':'application/json','Origin':BASE})
 try:r=c.open(request,timeout=30)
 except urllib.error.HTTPError as e:r=e
 data=json.loads(r.read());assert r.status<400,(r.status,data);return data
def uid():return str(uuid.uuid4())
def sql(q):return subprocess.check_output(['docker','exec','agynexa-studio-local-db-1','psql','-U','postgres','-At','-v','ON_ERROR_STOP=1','-c',q],text=True).strip()
account=json.loads(Path('/tmp/agynexa-studio-release-fixture.json').read_text())['accounts'][0];req('/api/auth/login',{'email':account['email'],'password':account['password']})
agent=req('/api/v1/agents',{'template':'knowledgegrid','builder':True,'name':'Transitive local fixture','instructions':'Answer only supported company facts.','model':'openai/gpt-oss-20b','language':'en','requestKey':uid()})['agent'];root='/api/v1/agents/'+agent['id'];conversation=uid()
def source(title,content):return req(root+'/sources',{'title':title,'content':content,'publicApproved':False,'requestKey':uid()})['source']['id']
def run(message,key):return req(root+'/test-runs',{'message':message,'conversationId':conversation,'requestKey':key})['run']
a=source('Synthetic A','SYNTHETIC. orchidcustomcode is alpha111.');first=run('What is orchidcustomcode?',uid());assert first['status']=='succeeded'
b=source('Synthetic B','SYNTHETIC. quartzvendorcode is beta222.');message='Please explain quartzvendorcode for a reviewer who needs the exact supplied value alongside unknown information before making any decisions.';key=uid();second=run(message,key);assert second['status']=='succeeded'
row=json.loads(sql(f"select snapshot->'chat_v2'->'sourceDependencies' from public.agent_runs where id='{second['id']}'"));deps={x['sourceId'] for x in row};assert a in deps and b in deps,deps
stored=json.loads(sql(f"select to_jsonb(r) from public.agent_runs r where id='{second['id']}'"))
legacy=hashlib.sha256(json.dumps({'question':message,'model':stored['model'],'identity':stored['snapshot']['identity'],'version':stored['version_id'],'revision':stored['snapshot']['revision'],'sources':stored['snapshot']['sourceIds'],'conversation':conversation},separators=(',',':')).encode()).hexdigest()
sql(f"update public.agent_runs set input_hash='{legacy}' where id='{second['id']}'")
legacy_replay=run(message,key);assert legacy_replay['id']==second['id']
req(root+'/sources/'+a,{},'DELETE');replay=run(message,key);assert replay['historyState']=='knowledge_changed' and not replay['citations'] and not replay.get('chat'),replay
out={'status':'PASS','environment':'Real isolated DB/Auth/runtime; deterministic model boundary fixture','checks':['Current B-only lexical retrieval with complete prior A turn persists both source dependencies','Source A removal invalidates the derived B response/replay even without a visible A citation','No generated chat/citations exposed after transitive revocation','Legacy baseline request hash replays under exact actor/conversation/input binding, then reauthorizes revoked content']}
Path('docs/launch/2026-10-22/evidence/transitive.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out))
