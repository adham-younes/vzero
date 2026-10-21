"""Only optional-field cases affected by the presence-check correction."""
import json,uuid,http.cookiejar,urllib.request,urllib.error
from pathlib import Path
BASE='http://localhost:3016'
assert json.loads(Path('/tmp/agynexa-local-status.json').read_text())['API_URL']=='http://127.0.0.1:54321'
class Policy(http.cookiejar.DefaultCookiePolicy):
 def return_ok_secure(self,c,r):return r.full_url.startswith(BASE+'/') or super().return_ok_secure(c,r)
c=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar(policy=Policy())))
def req(path,body):
 r=urllib.request.Request(BASE+path,data=json.dumps(body).encode(),headers={'Origin':BASE,'Content-Type':'application/json'})
 try:s=c.open(r,timeout=30)
 except urllib.error.HTTPError as e:s=e
 return s.status,json.loads(s.read())
account=json.loads(Path('/tmp/agynexa-studio-release-fixture.json').read_text())['accounts'][0]
assert req('/api/auth/login',{k:account[k] for k in ('email','password')})[0]==200
s,boot=req('/api/v1/workspace/chat',{'locale':'en'});assert s==200
aid=boot['agent']['id'];checks=[]
for field in ('model','conversationId','runId'):
 for value in (False,0,None,'',{},[]):
  body={'message':'Synthetic optional input validation','requestKey':str(uuid.uuid4()),field:value}
  s,d=req('/api/v1/agents/'+aid+'/test-runs',body)
  checks.append({'name':field+' rejects '+repr(value),'result':'PASS' if s==400 else 'FAIL','httpStatus':s})
  print(checks[-1]['result']+' '+checks[-1]['name'],flush=True)
out=Path('docs/launch/2026-10-22/evidence/remaining-acceptance/input-after-fix.json')
out.write_text(json.dumps({'environment':'real isolated HTTP/Auth/DB on rebuilt corrected source; invalid optional inputs stop before model generation','checks':checks},indent=2)+'\n')
assert all(x['result']=='PASS' for x in checks)
