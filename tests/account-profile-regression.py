"""Local-only missing-profile regression; run after studio-http.py. Restores the fixture."""
import json,subprocess,urllib.request,urllib.error,http.cookies,uuid
from pathlib import Path
s=json.loads(Path('/tmp/agynexa-local-status.json').read_text());acct=json.loads(Path('/tmp/agynexa-studio-synthetic.json').read_text())['accounts'][1]
assert s['API_URL']=='http://127.0.0.1:54321', 'Local only'
def req(url,body=None,headers=None):
 r=urllib.request.Request(url,data=json.dumps(body).encode() if body is not None else None,headers={'Content-Type':'application/json','Origin':'http://localhost:3016',**(headers or {})})
 try:x=urllib.request.urlopen(r)
 except urllib.error.HTTPError as e:x=e
 raw=x.read();return x.status,json.loads(raw) if raw else None,x.headers
st,data,_=req(s['API_URL']+'/auth/v1/token?grant_type=password',{'email':acct['email'],'password':acct['password']},{'apikey':s['ANON_KEY']});assert st==200
uid=str(uuid.UUID(data['user']['id']));jwt=data['access_token']
st,_,h=req('http://localhost:3016/api/auth/login',acct);assert st==200
cookies=http.cookies.SimpleCookie()
for v in h.get_all('Set-Cookie',[]):cookies.load(v)
cookie='; '.join(k+'='+v.value for k,v in cookies.items())
def sql(q):
 return subprocess.run(['docker','exec','agynexa-studio-local-db-1','psql','-U','postgres','-v','ON_ERROR_STOP=1','-Atc',q],capture_output=True,text=True,check=True).stdout
# Deliberate local fixture fault, restored in finally. No hosted SQL or real users.
profile=json.loads(sql(f"select row_to_json(p) from public.profiles p where id='{uid}'"))
try:
 sql(f"delete from public.profiles where id='{uid}'")
 auth_status,_,_=req(s['API_URL']+'/auth/v1/user',headers={'apikey':s['ANON_KEY'],'Authorization':'Bearer '+jwt})
 old_single,_,_=req(s['API_URL']+'/rest/v1/profiles?select=display_name,created_at',headers={'apikey':s['ANON_KEY'],'Authorization':'Bearer '+jwt,'Accept':'application/vnd.pgrst.object+json'})
 new_account,_,_=req('http://localhost:3016/api/account',headers={'Cookie':cookie})
 assert (auth_status,old_single,new_account)==(200,406,401)
finally:
 # SQL values are synthetic fixture strings, escaped as SQL literals.
 lit=lambda x:"'"+x.replace("'","''")+"'"
 sql('insert into public.profiles(id,display_name,created_at) values('+','.join(lit(profile[k]) for k in ['id','display_name','created_at'])+')')
result={'environment':'isolated local only','profile_fixture':'temporarily removed then restored','auth_user_status':auth_status,'legacy_single_profile_status':old_single,'new_account_status':new_account,'production_root_cause_proven':False}
p=Path('docs/agynexa-program/agent-studio/evidence/stage-b/account-diagnosis.json');o=json.loads(p.read_text()) if p.exists() else {};o['missing_profile_regression']=result;p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result))
