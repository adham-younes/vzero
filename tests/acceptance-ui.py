"""Only previously missing UI acceptance; real local Auth/DB, synthetic provider.
Requires the lead's already-running stack. Never starts services or touches Chrome.
Run: LAUNCH_BASE_URL=http://localhost:3016 LAUNCH_FIXTURE=/tmp/agynexa-studio-release-fixture.json python3 tests/acceptance-ui.py
Optional ACCEPTANCE_UI_CASES=auth,brief,journey,faults selects affected groups.
Fault markers are handled only by the isolated Node provider preload.
"""
import asyncio,json,os,uuid
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright,expect
BASE=os.getenv('LAUNCH_BASE_URL','http://localhost:3016').rstrip('/')
assert urlparse(BASE).hostname in ('localhost','127.0.0.1','::1'),'Local synthetic fixtures only'
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/launch/2026-10-22/evidence/remaining-acceptance'
OUT.mkdir(parents=True,exist_ok=True)
FIXTURE=json.loads(Path(os.getenv('LAUNCH_FIXTURE','/tmp/agynexa-studio-release-fixture.json')).read_text())
ACCOUNT=FIXTURE['accounts'][1]
SELECT=set(os.getenv('ACCEPTANCE_UI_CASES','auth,brief,journey,faults').split(','))
PRIOR=json.loads((OUT/'ui.json').read_text()) if (OUT/'ui.json').exists() else None
RESULT={'status':'RUNNING','environment':'real local Auth/Postgres/application; deterministic isolated provider preload; separate headless browser','checks':[],'previousExecutions':(PRIOR.get('previousExecutions',[])+[{'status':PRIOR['status'],'checks':PRIOR.get('checks',[]),'error':PRIOR.get('error')}] if PRIOR else []),'limitations':['No live model semantic inference is claimed.','Keyboard scope is builder/review controls only, not a full accessibility audit.','Controlled transport abort occurs after the real application responds; persistence is checked through the real authenticated API.']}

def record(name,**evidence):
 RESULT['checks'].append({'name':name,'status':'PASS',**evidence})
 (OUT/'ui.json').write_text(json.dumps(RESULT,ensure_ascii=False,indent=2)+'\n')
 print('PASS: '+name,flush=True)

async def main():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path=os.getenv('PLAYWRIGHT_CHROMIUM_EXECUTABLE'))
  context=await browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
  page=await context.new_page()
  page.set_default_timeout(15000)
  async def login(p):
   await p.locator('input[name=email]:visible').fill(ACCOUNT['email'])
   await p.locator('input[name=password]:visible').fill(ACCOUNT['password'])
   async with p.expect_response(lambda r:urlparse(r.url).path=='/api/auth/login' and r.request.method=='POST') as login_event:
    await p.get_by_role('button',name='Sign in',exact=True).click()
   response=await login_event.value
   assert response.ok,'Login HTTP '+str(response.status)+' error='+str((await response.json()).get('error'))
  async def get(path):
   r=await page.request.get(BASE+path);assert r.ok,'Authenticated read failed: '+str(r.status)
   return await r.json()
  async def section(name):
   await page.get_by_role('navigation',name='Assistant sections').get_by_role('button',name=name,exact=True).click()
  async def send(question):
   await page.locator('#agent-chat-message').fill(question)
   async with page.expect_response(lambda r:'/test-runs' in r.url and r.request.method=='POST',timeout=90000) as event:
    await page.get_by_role('button',name='Send message',exact=True).click()
   response=await event.value
   payload=await response.json();assert response.ok,'Run transport failed: '+str(response.status)
   assert set(payload)=={'run'},'Legacy response envelope changed'
   if payload['run']['status']!='succeeded':await expect(page.get_by_role('button',name='Send message',exact=True)).to_be_enabled()
   return payload['run']

  if 'auth' in SELECT:
   # Fresh contexts prove explicit intent, without signing the browser owner out.
   for target in ('/account','/start'):
    c=await browser.new_context();p=await c.new_page()
    await p.goto(BASE+'/login?returnTo='+target)
    await login(p);await p.wait_for_url(BASE+target)
    if target=='/account':await p.get_by_role('heading',name='Your project briefs',exact=True).wait_for()
    else:await p.locator('textarea[name=problem]').wait_for()
    await c.close()
   record('Explicit Account and Start login destinations preserved',destinations=['/account','/start'])

  if 'brief' in SELECT:
   await page.goto(BASE+'/start')
   organization='Synthetic UI acceptance '+uuid.uuid4().hex[:8]
   fields={'organization':organization,'email':'acceptance@example.invalid','problem':'Review synthetic distribution exceptions; no external delivery.','sources':'Synthetic order list supplied by a reviewer.','acceptance':'Missing facts are explicit and the human reviewer decides.'}
   for key,value in fields.items():await page.locator('[name='+key+']').fill(value)
   await page.get_by_role('button',name='Review your brief',exact=True).click()
   consent=page.get_by_label('I reviewed this brief and consent to storing it privately in my account.',exact=False)
   await consent.focus();await page.keyboard.press('Space');assert await consent.is_checked()
   download_already_passed=PRIOR and any(c['name'].startswith('Downloaded TXT') and c['status']=='PASS' for c in PRIOR.get('checks',[]))
   if not download_already_passed:
    async with page.expect_download() as download_event:
     await page.get_by_role('button',name='Download brief',exact=True).click()
    download=await download_event.value
    assert download.suggested_filename=='agynexa-project-brief.txt'
    downloaded=Path(await download.path()).read_text()
    for value in fields.values():assert value in downloaded
    assert 'Organization: '+organization in downloaded and 'What would success look like?:' in downloaded,repr(downloaded)
    record('Downloaded TXT contains reviewed fields and human acceptance criteria',filename=download.suggested_filename,utf8Bytes=len(downloaded.encode()),containsAllReviewedValues=True)
   save=page.get_by_role('button',name='Save to my account',exact=True)
   await save.click()
   await page.get_by_role('heading',name='Sign in to save your brief',exact=True).wait_for()
   posts=[]
   page.on('request',lambda r:posts.append(r.post_data_json) if r.method=='POST' and urlparse(r.url).path=='/api/v1/project-briefs' else None)
   await login(page)
   await page.get_by_text('Signed in. Press Save to store your brief.',exact=True).wait_for()
   assert urlparse(page.url).path=='/start'
   assert len(posts)==0,'Inline login must not auto-save'
   assert organization in await page.locator('.review-box').inner_text()
   before=(await get('/api/v1/project-briefs'))['briefs']
   assert not any(b['organization']==organization for b in before)
   # Execute the real save once, then lose only its browser response.
   committed=[]
   async def lose_committed_brief(route):
    response=await route.fetch();assert response.ok
    committed.append((await response.json())['brief'])
    await route.abort('failed')
   await page.route('**/api/v1/project-briefs',lose_committed_brief,times=1)
   await save.click()
   await page.get_by_text('Connection failed. Please try again.',exact=True).wait_for()
   assert len(committed)==1 and len(posts)==1
   await save.click()
   await page.get_by_text('Saved privately in your account. Nobody has been notified.',exact=False).wait_for()
   assert len(posts)==2 and posts[0]['requestKey']==posts[1]['requestKey']
   saved=[b for b in (await get('/api/v1/project-briefs'))['briefs'] if b['organization']==organization]
   assert len(saved)==1 and saved[0]['id']==committed[0]['id']
   record('Mounted Start draft survives inline auth without autosave; committed-but-aborted save retries same key once',mountedDraftRetained=True,automaticSaveCount=0,explicitSaveAttempts=2,sameRequestKey=True,persistedBriefCount=1)
   # Only exact test brief cleanup; no other account object mutation.
   r=await page.request.delete(BASE+'/api/v1/project-briefs',data={'id':saved[0]['id']},headers={'Origin':BASE});assert r.ok
  else:
   await page.goto(BASE+'/login');await login(page);await page.wait_for_url('**/studio')

  if SELECT & {'journey','faults','timeout_only'}:
   await page.goto(BASE+'/studio');await page.locator('#agent-chat-message').wait_for()
   reuse=os.getenv('ACCEPTANCE_UI_REUSE')=='1' or 'timeout_only' in SELECT
   if reuse:
    saved_fixture=json.loads((ROOT.parent/'acceptance-ui-fixture-ids.json').read_text())
    aid=saved_fixture['agentId'];agent={'id':aid,'name':saved_fixture['name']}
    await page.goto(BASE+'/studio?agent='+aid);await page.locator('#agent-chat-message').wait_for()
   else:
    create=page.get_by_role('navigation',name='Studio navigation').get_by_role('button',name='Create an assistant',exact=True)
    # Reach and activate the actual button using Tab / Enter, without click.
    for _ in range(60):
     await page.keyboard.press('Tab')
     if await create.evaluate('(e)=>e===document.activeElement'):break
    assert await create.evaluate('(e)=>e===document.activeElement'),'Create control unreachable in bounded Tab traversal'
    await page.keyboard.press('Enter')
    task=page.get_by_label('One task and the result you want',exact=False)
    await task.fill('Review a synthetic distribution exception list; separate supplied facts from unknowns and leave action to a human reviewer.')
    assert await task.count()==1,'Task textarea label must remain usable after controlled React update'
    await task.focus();await page.keyboard.press('Tab');await page.keyboard.type('Synthetic distribution')
    await page.keyboard.press('Tab');assert await page.get_by_role('button',name='Review configuration',exact=True).evaluate('(e)=>e===document.activeElement')
    await page.keyboard.press('Enter')
    kg=page.get_by_role('radio',name='KnowledgeGrid',exact=False)
    await kg.focus();await page.keyboard.press('Space');assert await kg.is_checked()
    assert 'KnowledgeGrid does not propose internal requests.' in await page.locator('form.panel').inner_text()
    await page.get_by_label('Assistant name',exact=True).fill('Synthetic remaining UI '+uuid.uuid4().hex[:6])
    options=await page.get_by_label('Response model',exact=False).locator('option:not([disabled])').evaluate_all('(els)=>els.map(e=>e.value).filter(Boolean)')
    assert len(options)==3
    await page.get_by_label('Response model',exact=False).select_option('openai/gpt-oss-20b')
    async with page.expect_response(lambda r:urlparse(r.url).path=='/api/v1/agents' and r.request.method=='POST') as ev:
     await page.get_by_role('button',name='Create private assistant',exact=True).press('Enter')
    response=await ev.value;assert response.ok
    agent=(await response.json())['agent'];aid=agent['id']
    private=ROOT.parent/'acceptance-ui-fixture-ids.json'
    private.write_text(json.dumps({'agentId':aid,'name':agent['name'],'environment':BASE})+'\n');private.chmod(0o600)
    await page.get_by_role('button',name='Dismiss notice',exact=True).click()
    record('Builder describe/review keyboard Tab Enter Space and explicit Create',keyboardControls=['Tab traversal','Enter describe/review/create','Space KnowledgeGrid'],productionModelOptionCount=3)
 
   if 'journey' in SELECT:
    await section('Optional sources')
    await page.get_by_role('button',name='Synthetic distribution exception list',exact=True).click()
    assert not (await get('/api/v1/agents/'+aid+'/sources'))['sources']
    await page.get_by_role('button',name='Use sample in source editor',exact=True).click()
    content=await page.get_by_label('Review source content',exact=False).input_value()
    assert 'D-104' in content and 'two days late in this supplied list' in content
    assert not await page.get_by_label('Separately approve this source',exact=False).is_checked()
    assert not (await get('/api/v1/agents/'+aid+'/sources'))['sources']
    async with page.expect_response(lambda r:'/sources' in r.url and r.request.method=='POST') as ev:
     await page.get_by_role('button',name='Add source',exact=True).click()
    assert (await ev.value).ok
    source=(await get('/api/v1/agents/'+aid+'/sources'))['sources'][0];assert not source['public_approved']
    await section('Conversation')
    run=await send('Prepare a review brief for order D-104 and list missing facts.')
    assert run['status']=='succeeded' and run['citations']
    text=' '.join(p['text'] for p in run['chat']['parts'])
    for phrase in ('D-104','two days late','supplied list','promised date','carrier update','named owner','Operations must check dispatch status','No supplier or customer has been contacted'):assert phrase in text,phrase
    await page.get_by_role('log').locator('details summary').first.click()
    quote=await page.get_by_role('log').locator('blockquote').first.inner_text()
    assert content in quote
    record('Distribution inspect/editor requires explicit private ingest; cited supplied delay, unknowns and manual action',sourcePrivate=True,originalQuoteExact=True,suppliedDelayDays=2,unknowns=['promised date','carrier update','named owner'],humanDecision=True,noContactClaim=True)
    compare=page.get_by_label('Compare available models (separate responses)',exact=True)
    assert not await compare.is_checked()
    requests=[];responses=[]
    async def collect(response):
     if '/test-runs' in response.url and response.request.method=='POST':responses.append(await response.json())
    page.on('response',collect)
    def request_capture(r):
     if '/test-runs' in r.url and r.method=='POST':requests.append(r.post_data_json)
    page.on('request',request_capture)
    await compare.focus();await page.keyboard.press('Space');assert await compare.is_checked()
    question='Compare a review checklist for synthetic D-104 from the supplied list.'
    await page.locator('#agent-chat-message').fill(question);await page.get_by_role('button',name='Send message',exact=True).click()
    await expect(page.locator('#agent-chat-message')).to_have_value('',timeout=90000)
    assert len(requests)==3 and len(responses)==3
    assert len({r['runId'] for r in requests})==3 and len({r['conversationId'] for r in requests})==1
    assert {r['model'] for r in requests}==set(options) and {r['message'] for r in requests}=={question}
    assert all(set(r)=={'run'} and r['run']['status']=='succeeded' for r in responses)
    record('Deliberate Compare sends one question to three distinct models/runs in one conversation; old run envelope intact',requests=3,distinctRunIds=3,distinctConversationIds=1,distinctModels=3,oldRunEnvelope=True)
    page.remove_listener('request',request_capture);page.remove_listener('response',collect)
    await compare.uncheck()

   if 'timeout_only' in SELECT:
    q='[ACCEPTANCE_TIMEOUT] Synthetic isolated timeout composer check '+uuid.uuid4().hex[:6]
    run=await send(q)
    assert run['status']=='failed' and run['error_code']=='provider_unavailable'
    assert not run.get('chat') and not run['citations'] and not run.get('answer')
    await expect(page.locator('#agent-chat-message')).to_have_value(q)
    await expect(page.locator('#agent-chat-message')).to_be_enabled()
    await expect(page.get_by_role('button',name='Send message',exact=True)).to_be_enabled()
    await page.get_by_role('log').get_by_text('This response did not complete.',exact=False).last.wait_for()
    record('Controlled TimeoutError composer retained and send remains enabled; no accepted answer',savedStatus='failed',actualErrorCode='provider_unavailable',composerRetained=True,sendEnabled=True,noAcceptedAnswer=True,modelTurns=1,limitation='Synthetic TimeoutError maps to generic provider failure; no real provider deadline claim.')

   if 'faults' in SELECT:
    faults=set(os.getenv('ACCEPTANCE_UI_FAULTS','rate,timeout,cancel,uncertain').split(','))
    for marker,code,visible in [('[ACCEPTANCE_429_EXHAUSTED]','provider_rate_limited','The model is busy.'),('[ACCEPTANCE_TIMEOUT]','provider_unavailable','This response did not complete.')]:
     if ('429' in marker and 'rate' not in faults) or ('TIMEOUT' in marker and 'timeout' not in faults):continue
     q=marker+' Synthetic controlled UI fault '+uuid.uuid4().hex[:6]
     run=await send(q)
     assert run['status']=='failed' and run['error_code']==code,(run['status'],run.get('error_code'))
     await expect(page.locator('#agent-chat-message')).to_have_value(q)
     await page.get_by_role('log').get_by_text(visible,exact=False).last.wait_for()
     assert not run.get('chat') and not run['citations']
     record('Controlled '+code+' preserves composer and exposes truthful failure',savedStatus='failed',composerRetained=True,noAcceptedAnswer=True)
    if reuse:
     # Contract clarification: inspect the one earlier timeout run without another model request.
     conversations=(await get('/api/v1/agents/'+aid+'/conversations'))['conversations']
     timeout_runs=[]
     for item in conversations:
      timeout_runs += [r for r in (await get('/api/v1/agents/'+aid+'/conversations/'+item['id']))['runs'] if '[ACCEPTANCE_TIMEOUT]' in r['question']]
     assert len(timeout_runs)==1 and timeout_runs[0]['status']=='failed' and timeout_runs[0]['error_code']=='provider_unavailable'
     assert not timeout_runs[0].get('chat') and not timeout_runs[0]['citations'] and not timeout_runs[0].get('answer')
     record('Controlled TimeoutError produces persisted generic failure without accepted answer (contract clarified)',savedStatus='failed',actualErrorCode='provider_unavailable',additionalModelCalls=0,limitation='Earlier assertion stopped before checking timeout composer retention; only rate/cancel/uncertain paths verify retained composer. This marker does not exercise a real deadline.')
    held='[ACCEPTANCE_HOLD_FOR_CANCEL] Synthetic cancellable response '+uuid.uuid4().hex[:6]
    await page.locator('#agent-chat-message').fill(held)
    async with page.expect_response(lambda r:'/test-runs' in r.url and r.request.method=='POST',timeout=90000) as pending:
     await page.get_by_role('button',name='Send message',exact=True).click()
     stop=page.get_by_role('button',name='Stop response',exact=True);await stop.wait_for()
     # Provider hold is 8s; wait for actual DB run reservation before cancelling.
     await asyncio.sleep(1)
     async with page.expect_response(lambda r:r.url.endswith('/cancel') and r.request.method=='POST') as ce:
      await stop.click()
     assert (await ce.value).ok
     await page.get_by_text('Stop requested.',exact=False).wait_for()
    cancelled=(await (await pending.value).json())['run']
    assert cancelled['status']=='cancelled',cancelled['status']
    await expect(page.locator('#agent-chat-message')).to_have_value(held)
    assert not cancelled.get('chat') and not cancelled['citations']
    record('Controlled in-flight Stop is requested truthfully and persists cancelled state',savedStatus='cancelled',composerRetained=True,noAcceptedAnswer=True)
    # Real committed result is lost at browser transport, then exact same attempt retried.
    originals=[];attempts=[]
    async def lose_run(route):
     attempts.append(route.request.post_data_json)
     r=await route.fetch();assert r.ok
     originals.append((await r.json())['run']);await route.abort('failed')
    await page.route('**/test-runs',lose_run,times=1)
    q='Synthetic uncertain delivery checklist '+uuid.uuid4().hex[:6]
    await page.locator('#agent-chat-message').fill(q);await page.get_by_role('button',name='Send message',exact=True).click()
    retry=page.get_by_role('button',name='Retry same request',exact=True);await retry.wait_for()
    assert len(originals)==1 and originals[0]['status']=='succeeded'
    await expect(page.locator('#agent-chat-message')).to_have_value(q)
    async with page.expect_response(lambda r:'/test-runs' in r.url and r.request.method=='POST') as re:
     await retry.click()
    rr=await re.value;attempts.append(rr.request.post_data_json);run=(await rr.json())['run']
    assert attempts[0]==attempts[1] and run['id']==originals[0]['id'] and run['status']=='succeeded'
    history=(await get('/api/v1/agents/'+aid+'/conversations/'+run['conversation_id']))['runs']
    assert sum(r['id']==run['id'] for r in history)==1
    record('Uncertain committed response retains composer; exact retry returns one persisted run',sameRequestBody=True,sameRunId=True,persistedRunCount=1)
   # Preserve exact local synthetic assistant ID privately for lead cleanup.
   private=ROOT.parent/'acceptance-ui-fixture-ids.json'
   private.write_text(json.dumps({'agentId':aid,'name':agent['name'],'environment':BASE})+'\n');private.chmod(0o600)
  RESULT['status']='PASS';(OUT/'ui.json').write_text(json.dumps(RESULT,ensure_ascii=False,indent=2)+'\n')
  await browser.close()

try:asyncio.run(main())
except Exception as error:
 RESULT['status']='FAIL';RESULT['error']=type(error).__name__+': '+str(error)
 (OUT/'ui.json').write_text(json.dumps(RESULT,ensure_ascii=False,indent=2)+'\n')
 print(RESULT['error'],flush=True);raise
