"""Focused real local browser acceptance for the customer release.

Run only in the lead's coordinated gate. Requires an already running real local
Auth/PostgREST/application and synthetic fixture; does not start/install anything.
LAUNCH_BASE_URL=http://localhost:3016
LAUNCH_FIXTURE=/tmp/agynexa-studio-release-fixture.json
LAUNCH_BROWSER_EVIDENCE=docs/launch/2026-10-22/evidence/browser
No production accounts or external business writes.
"""
import asyncio,json,os,re,uuid
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright

BASE=os.getenv('LAUNCH_BASE_URL','http://localhost:3016').rstrip('/')
assert urlparse(BASE).hostname in ('localhost','127.0.0.1','::1'),'Local synthetic testing only'
fixture=json.loads(Path(os.getenv('LAUNCH_FIXTURE','/tmp/agynexa-studio-release-fixture.json')).read_text())
OUT=Path(os.getenv('LAUNCH_BROWSER_EVIDENCE','docs/launch/2026-10-22/evidence/browser'))
OUT.mkdir(parents=True,exist_ok=True)
checks=[]
if os.getenv('LAUNCH_BROWSER_RESUME')=='builder':
 previous=json.loads((OUT/'browser-model-selector-failure.json').read_text())
 assert len(previous['completed'])==2 and not previous['pageErrors']
 checks.extend(previous['completed'])
errors=[]

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE'))
  context=await browser.new_context(viewport={'width':1440,'height':1000})
  page=await context.new_page()
  page.on('pageerror',lambda error:errors.append(str(error)))
  async def screenshot(name):
   assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth'),name+' horizontal overflow'
   await page.screenshot(path=str(OUT/(name+'.png')),full_page=True)
  async def login(path='/login',ar=False):
   await page.goto(BASE+path)
   await page.locator('input[name=email]').fill(fixture['accounts'][1]['email'])
   await page.locator('input[name=password]').fill(fixture['accounts'][1]['password'])
   await page.get_by_role('button',name='تسجيل الدخول' if ar else 'Sign in',exact=True).click()
  async def section(name):
   await page.get_by_role('navigation',name='Assistant sections').get_by_role('button',name=name,exact=True).click()
  async def send(text,expected_kind=None):
   await page.locator('#agent-chat-message').fill(text)
   async with page.expect_response(lambda response:'/test-runs' in response.url and response.request.method=='POST',timeout=240000) as event:
    await page.get_by_role('button',name='Send message',exact=True).click()
   response=await event.value
   payload=await response.json()
   assert response.ok,payload
   run=payload['run']
   assert run['status']=='succeeded',run.get('error_code')
   if expected_kind:assert any(part['kind'] in expected_kind for part in run.get('chat',{}).get('parts',[])),run
   await page.get_by_role('log').get_by_text(text,exact=True).wait_for()
   await page.get_by_role('button',name='Send message',exact=True).wait_for(state='visible')
   return run

  await login()
  await page.wait_for_url('**/studio')
  await page.locator('#agent-chat-message').wait_for()
  assert not await page.locator('input[type=file]').count(),'Sources must not be prerequisite'
  # Read current identity through the authenticated API; no private values enter evidence.
  boot_response=await page.request.post(BASE+'/api/v1/workspace/chat',data={'locale':'en'},headers={'Origin':BASE})
  assert boot_response.ok
  default_agent=(await boot_response.json())['agent']
  if os.getenv('LAUNCH_BROWSER_CAPTURE_ONLY')=='ar':
   await page.set_viewport_size({'width':390,'height':844})
   await page.goto(BASE+'/ar/studio?agent='+default_agent['id'])
   await page.locator('#agent-chat-message').wait_for()
   await page.wait_for_function("!document.getElementById('agent-chat-message').disabled")
   await screenshot('studio-ar-390')
   print('PASS: resolved Arabic390 screenshot refreshed; read-only capture, no inference')
   await browser.close()
   return
  assert not (await (await page.request.get(BASE+'/api/v1/agents/'+default_agent['id']+'/sources')).json())['sources'],'Browser new-customer fixture must have no sources'
  if os.getenv('LAUNCH_BROWSER_RESUME')!='builder':
   await page.get_by_role('button',name='New conversation',exact=True).click()
   first=await send('Prepare a review outline from my supplied fact: synthetic order TEST-101 is late. I want a checklist for an operations reviewer. Do not propose a request yet.',{'draft','discovery'})
   assert default_agent['chat_profile']=='customer_v1'
   await screenshot('studio-en-1440')
   checks.append('Default login opens separate customer-profile private chat; useful typed response without sources at 1440px')

   await page.get_by_role('button',name='Review a private project brief',exact=True).first.click()
   assert await page.locator('textarea[name=problem]').input_value()==first['question'][:1500]
   assert not await page.locator('input[name=organization]').input_value()
   assert not await page.locator('input[name=email]').input_value()
   assert not await page.locator('textarea[name=sources]').input_value()
   await page.locator('input[name=organization]').fill('Synthetic browser company')
   await page.locator('input[name=email]').fill('reviewer@example.invalid')
   await page.locator('select[name=service]').select_option(index=1)
   await page.locator('textarea[name=sources]').fill('Synthetic order list supplied by me; no system access.')
   await page.locator('textarea[name=acceptance]').fill('A reviewer can see missing details and next steps.')
   await page.get_by_role('button',name='Review your brief',exact=True).click()
   save=page.get_by_role('button',name='Save to my account',exact=True)
   assert await save.is_disabled()
   await page.get_by_label('I reviewed this brief and consent to storing it privately in my account.',exact=False).check()
   async with page.expect_response(lambda response:'/api/v1/project-briefs' in response.url and response.request.method=='POST') as event:
    await save.click()
   assert (await event.value).ok
   await page.get_by_text('Saved privately in your account. Nobody has been notified.',exact=False).wait_for()
   await page.get_by_role('button',name='Close brief',exact=True).click()
   checks.append('Brief prefill contains only user message; required fields, explicit review/consent/save; truthful private save')

  await page.set_viewport_size({'width':768,'height':1024})
  await page.get_by_role('navigation',name='Studio navigation').get_by_role('button',name='Create an assistant',exact=True).click()
  await page.get_by_label('One task and the result you want',exact=True).fill('Prepare a distribution exception brief from supplied facts, ask about missing details, and propose only internal review requests when asked.')
  await page.get_by_label('Sector or business context (optional)',exact=True).fill('Synthetic distributor')
  await page.get_by_role('button',name='Review configuration',exact=True).click()
  name='Synthetic release assistant '+uuid.uuid4().hex[:6]
  await page.get_by_label('Assistant name',exact=True).fill(name)
  await page.get_by_label('Response model',exact=False).select_option(default_agent['model'])
  await screenshot('builder-en-768')
  async with page.expect_response(lambda response:urlparse(response.url).path=='/api/v1/agents' and response.request.method=='POST') as event:
   await page.get_by_role('button',name='Create private assistant',exact=True).click()
  created_response=await event.value
  assert created_response.ok
  created=(await created_response.json())['agent']
  assert created['id']!=default_agent['id'] and created['name']==name and created['chat_profile']=='customer_v1'
  settings_url=await page.get_by_role('link',name='Open saved settings',exact=True).get_attribute('href')
  assert created['id'] in settings_url and 'tab=settings' in settings_url
  saved=(await (await page.request.get(BASE+'/api/v1/agents/'+created['id'])).json())['agent']
  assert 'distribution exception' in saved['instructions'] and saved['name']==name
  await page.get_by_role('button',name='Dismiss notice',exact=True).click()
  await page.locator('#agent-chat-message').wait_for()
  await send('Draft a short checklist for reviewing synthetic late orders. I have no source yet. What is the most useful missing fact?',{'draft','discovery'})
  checks.append('Describe/review/create provisions a distinct persisted agent with saved ID/name/settings URL and a working private test at 768px')

  await section('Optional sources')
  await page.get_by_role('button',name='Synthetic retail returns policy',exact=True).click()
  before=(await (await page.request.get(BASE+'/api/v1/agents/'+created['id']+'/sources')).json())['sources']
  assert not before
  await page.get_by_role('button',name='Use sample in source editor',exact=True).click()
  assert not await page.get_by_label('Separately approve this source',exact=False).is_checked()
  assert not (await (await page.request.get(BASE+'/api/v1/agents/'+created['id']+'/sources')).json())['sources']
  async with page.expect_response(lambda response:'/sources' in response.url and response.request.method=='POST') as event:
   await page.get_by_role('button',name='Add source',exact=True).click()
  assert (await event.value).ok
  await page.get_by_role('heading',name='Saved sources (1)',exact=True).wait_for()
  source=(await (await page.request.get(BASE+'/api/v1/agents/'+created['id']+'/sources')).json())['sources'][0]
  assert not source['public_approved']
  await section('Conversation')
  grounded=await send('What is the synthetic return window for an unopened item with proof of purchase? Is an opened faulty item eligible?',{'grounded'})
  assert grounded['citations'] and any('14' in citation['quote'] for citation in grounded['citations'])
  conversation=grounded['conversation_id']
  await page.reload()
  await page.locator('#agent-chat-message').wait_for()
  await page.get_by_role('log').get_by_text(grounded['question'],exact=True).wait_for()
  followup=await send('Repeat the previous policy explanation and its missing case.',{'grounded'})
  assert followup['conversation_id']==conversation and followup['citations']
  checks.append('Synthetic sample inspect/editor does not create source; explicit source add remains private; cited answer/history refresh/full-turn follow-up')

  request_run=await send('Please propose an internal review request titled "Synthetic opened-item review" with details "Policy owner should review the eligibility of an opened faulty item; do not issue a refund or contact anyone." Show the exact proposal for my decision.')
  activity=(await (await page.request.get(BASE+'/api/v1/agents/'+created['id']+'/activity')).json())
  pending=next((item for item in activity['approvals'] if item['status']=='pending'),None)
  assert pending,'Model must produce the required explicit internal proposal in this acceptance case'
  await section('Requests & usage')
  await page.get_by_text(pending['title'],exact=True).wait_for()
  await page.get_by_text(pending['details'],exact=True).wait_for()
  async with page.expect_response(lambda response:'/decision' in response.url and response.request.method=='POST') as event:
   await page.get_by_role('button',name='Approve exact saved request',exact=True).first.click()
  decision=await event.value
  assert decision.ok
  assert decision.request.post_data_json=={'decision':'approved'}
  await page.get_by_text('Approved in your account — no external delivery',exact=True).wait_for()
  checks.append('Exact stored title/details reviewed; approval HTTP body decision-only; approved state explicitly internal')

  await section('Optional sources')
  page.once('dialog',lambda dialog:dialog.accept())
  await page.get_by_role('button',name='Delete source',exact=True).click()
  await page.get_by_role('heading',name='Saved sources (0)',exact=True).wait_for()
  await section('Conversation')
  visible=(await (await page.request.get(BASE+f'/api/v1/agents/{created["id"]}/conversations/{conversation}')).json())['runs']
  redacted=next(run for run in visible if run['id']==grounded['id'])
  assert redacted.get('historyState')=='knowledge_changed' and not redacted['citations'] and not redacted.get('chat')
  assert not await page.get_by_role('log').get_by_text('Answer from approved sources',exact=True).count()
  checks.append('Source delete refreshes/redacts cached conversation; API history removes original factual parts/citations')

  await page.set_viewport_size({'width':390,'height':844})
  await page.goto(BASE+'/ar/studio?agent='+created['id']+'&conversation='+conversation)
  await page.locator('#agent-chat-message').wait_for()
  assert await page.evaluate('document.documentElement.dir')=='rtl'
  await page.get_by_role('log').get_by_text(grounded['question'],exact=True).wait_for()
  await screenshot('studio-ar-390')
  await page.get_by_role('button',name='حذف المحادثة…',exact=True).click()
  assert await page.get_by_role('button',name='تأكيد حذف المحادثة',exact=True).is_visible()
  still_there=await page.request.get(BASE+f'/api/v1/agents/{created["id"]}/conversations/{conversation}')
  assert (await still_there.json())['runs'],'Confirmation step must not delete'
  await page.get_by_role('button',name='الاحتفاظ بالمحادثة',exact=True).click()
  await page.get_by_role('button',name='حذف المحادثة…',exact=True).click()
  async with page.expect_response(lambda response:'/conversations/' in response.url and response.request.method=='DELETE') as event:
   await page.get_by_role('button',name='تأكيد حذف المحادثة',exact=True).click()
  assert (await event.value).ok
  checks.append('Arabic 390px RTL/no overflow and explicit keep/confirm conversation deletion')

  # Home screenshots are candidate evidence; lead compares with protected baseline hashes/screens.
  for width in (390,768,1440):
   await page.set_viewport_size({'width':width,'height':900})
   await page.goto(BASE+'/')
   await screenshot('home-candidate-'+str(width))
  checks.append('Candidate homepage at 390/768/1440 captured without horizontal overflow; baseline comparison owned by lead')
  assert not errors,errors
  result={'environment':'isolated local app with real Auth/PostgREST and synthetic accounts; deterministic provider fixture via Node preload' ,'status':'PASS','executionSegments':{'resume':os.getenv('LAUNCH_BROWSER_RESUME'),'earlierReceipt':'browser-model-selector-failure.json' if os.getenv('LAUNCH_BROWSER_RESUME')=='builder' else None},'checks':checks,'pageErrors':errors,'limitations':['Comprehension tool is supporting text review, not a consenting-reader usability test.','Home screenshots require comparison with lead baseline; capture alone is not parity.','Provider output is deterministic fixture data; this gate verifies UI/storage/authorization contracts, not live model reasoning or semantic quality. Live adapter/schema/model checks are a separate Vercel gate.']}
  (OUT/'browser.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
  print(json.dumps(result,ensure_ascii=False))
  await browser.close()

try:
 asyncio.run(main())
except Exception as error:
 (OUT/'browser-failure.json').write_text(json.dumps({'status':'FAIL','environment':'real local Auth/PostgREST with deterministic provider fixture','completed':checks,'error':type(error).__name__+': '+str(error),'pageErrors':errors},ensure_ascii=False,indent=2)+'\n')
 raise
