"""Explicit opt-in production smoke. Creates two synthetic users; revoke/delete via
Supabase after the run using the exact emails in the private cleanup file.
Never prints credentials, cookies, tokens, or API keys. Sends no emails.
Usage: python3 tests/accounts-http.py https://deployment.example --create-test-users
"""
import sys,json,secrets,uuid,http.cookiejar,urllib.request,urllib.error,os,base64,time
from pathlib import Path
assert len(sys.argv)==3 and sys.argv[2]=='--create-test-users'
base=sys.argv[1].rstrip('/')
suffix=secrets.token_hex(6)
accounts=[{'email':f'agynexa-check-{suffix}-{n}@example.com','password':secrets.token_urlsafe(24),'name':f'AGYNEXA synthetic {n}'} for n in [1,2]]
cleanup=Path('/tmp/agynexa-account-cleanup.json');cleanup.write_text(json.dumps({'emails':[a['email'] for a in accounts]}));os.chmod(cleanup,0o600)
def client():
 jar=http.cookiejar.CookieJar();return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar)),jar
def request(c,path,body=None,method=None,origin=None):
 headers={'Origin':origin or base,'Content-Type':'application/json','Cache-Control':'no-cache'}
 req=urllib.request.Request(base+path,data=json.dumps(body).encode() if body is not None else None,headers=headers,method=method)
 try:r=c.open(req,timeout=25)
 except urllib.error.HTTPError as e:r=e
 data=json.loads(r.read());return r.status,data,dict(r.headers)
a,jar=client();b,_=client();checks=[]
def check(name,condition):
 assert condition,name
 checks.append(name)
check('unauthenticated account denied',request(a,'/api/account')[0]==401)
check('cross-origin mutation rejected',request(a,'/api/auth/register',accounts[0],origin='https://other.example')[0]==403)
check('short password rejected',request(a,'/api/auth/register',{**accounts[0],'password':'short'})[0]==400)
for c,acct in [(a,accounts[0]),(b,accounts[1])]:
 result=request(c,'/api/auth/register',acct)
 check('registration and automatic login '+acct['name'][-1],result[0]==201 and request(c,'/api/account')[0]==200)
check('secure HttpOnly cookies',all(c.secure and c.has_nonstandard_attr('HttpOnly') for c in jar if 'auth-token' in c.name) and len(list(jar))>0)
check('private no-store account response','no-store' in request(a,'/api/account')[2].get('Cache-Control',''))
check('duplicate registration does not replace existing account',request(a,'/api/auth/register',{**accounts[0],'password':secrets.token_urlsafe(24)})[0]==400)
body={'requestKey':str(uuid.uuid4()),'organization':'Synthetic test only','email':accounts[0]['email'],'service':'Knowledge','problem':'Synthetic task','sources':'Public examples','acceptance':'Correct answer','consent':True}
check('consent required',request(a,'/api/v1/project-briefs',{**body,'consent':False})[0]==400)
status,data,_=request(a,'/api/v1/project-briefs',body);check('persistent brief created',status==201);bid=data['brief']['id']
status,data,_=request(a,'/api/v1/project-briefs',body);check('idempotent replay',status==200 and data['brief']['id']==bid)
check('same key changed body conflicts',request(a,'/api/v1/project-briefs',{**body,'problem':'Changed'})[0]==409)
check('second user cannot list first brief',request(b,'/api/v1/project-briefs')[1]['briefs']==[])
check('second user cannot delete first brief',request(b,'/api/v1/project-briefs',{'id':bid},method='DELETE')[0]==404)
# Force the stored expiry to pass; SDK must refresh using the real refresh token.
for cookie in jar:
 if 'auth-token' in cookie.name and cookie.value.startswith('base64-'):
  raw=cookie.value[7:];session=json.loads(base64.urlsafe_b64decode(raw+'='*((4-len(raw)%4)%4)));session['expires_at']=int(time.time())-60
  cookie.value='base64-'+base64.urlsafe_b64encode(json.dumps(session).encode()).decode().rstrip('=')
check('expired session metadata refreshes',request(a,'/api/account')[0]==200)
check('logout succeeds',request(a,'/api/auth/logout',{})[0]==200)
check('logged-out session denied',request(a,'/api/account')[0]==401)
check('wrong password rejected',request(a,'/api/auth/login',{'email':accounts[0]['email'],'password':'wrong password value'})[0]==401)
check('password login succeeds',request(a,'/api/auth/login',accounts[0])[0]==200)
check('saved brief survives login',request(a,'/api/v1/project-briefs')[1]['briefs'][0]['id']==bid)
check('owner can delete brief',request(a,'/api/v1/project-briefs',{'id':bid},method='DELETE')[0]==200)
check('deleted brief absent',request(a,'/api/v1/project-briefs')[1]['briefs']==[])
for c in [a,b]:request(c,'/api/auth/logout',{})
result={'environment':base,'checks':checks,'passed':len(checks),'test_users_require_cleanup':True,'credentials_recorded':False}
Path('/tmp/agynexa-accounts-http-result.json').write_text(json.dumps(result,indent=2))
print(json.dumps({'passed':len(checks),'checks':checks}))
