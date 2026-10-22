import json,uuid
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();OUT=ROOT.parents[1]/'outputs/studio-ui-review';OUT.mkdir(parents=True,exist_ok=True)
AID='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';CID='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';checks=[];errors=[];requests=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/Users/adham/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless=True)
 for lang in ['en','ar']:
  for label,width,height in [('desktop',1440,1000),('mobile',390,844)]:
   c=browser.new_context(viewport={'width':width,'height':height});page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));runs=[]
   agent={'id':AID,'org_id':'cccccccc-cccc-4ccc-8ccc-cccccccccccc','name':'Work assistant' if lang=='en' else 'مساعد العمل','instructions':'Synthetic design fixture only.','template':'serviceflow','language':lang,'model':'openai/gpt-oss-20b','revision':1,'chat_profile':'customer_v1'}
   def handle(route):
    q=route.request;path=q.url.split('3033')[-1];body=q.post_data_json if q.post_data else {};requests.append({'path':path.split('?')[0],'method':q.method})
    if path=='/api/v1/workspace/chat':data={'workspace':{'id':agent['org_id'],'name':'Synthetic review'},'agent':agent}
    elif path=='/api/v1/agents':data={'agents':[agent]}
    elif path=='/api/account':data={'user':{'displayName':'Design review account' if lang=='en' else 'حساب مراجعة تجريبي','email':'review@example.test'}}
    elif path=='/api/v1/studio/models':data={'models':[{'id':i,'configured':True,'stage':'production','label':'English upstream label'} for i in ['openai/gpt-oss-120b','openai/gpt-oss-20b','qwen/qwen3.8-27b']]}
    elif path.endswith('/sources'):data={'sources':[]}
    elif path.endswith('/activity'):data={'runs':runs,'approvals':[],'versions':[],'keys':[],'publication':None}
    elif path.endswith('/conversations'):data={'conversations':[{'id':CID,'title':'Synthetic saved task' if lang=='en' else 'مهمة تجريبية محفوظة','updated_at':'2026-10-22T10:00:00Z'}] if runs else [],'nextCursor':None}
    elif '/conversations/' in path:
     if q.method=='DELETE':runs.clear();data={'deleted':True}
     else:data={'runs':runs,'nextCursor':None}
    elif path.endswith('/test-runs'):
     run={'id':body['runId'],'conversation_id':body['conversationId'],'model':body['model'],'question':body['message'],'status':'succeeded','answer':'Synthetic response from supplied facts.' if lang=='en' else 'دي مسودة تجريبية من المعلومات اللي قدمتها.','citations':[],'usage':{'input_tokens':0},'created_at':'2026-10-22T10:00:00Z','chat':{'schemaVersion':2,'parts':[{'kind':'draft','text':'Synthetic response from supplied facts.' if lang=='en' else 'دي مسودة تجريبية من المعلومات اللي قدمتها.','basis':'suggestion','citations':[]}],'nextQuestion':None,'briefDraft':None}};runs.append(run);data={'run':run}
    elif path.startswith('/api/v1/projects'):data={'projects':[],'hasMore':False}
    elif path=='/api/v1/studio/actions' and q.method=='POST':
     assert body['kind']=='agent.create';proposal={'id':'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','kind':'agent.create','payload':body['payload'],'version':1,'snapshot_hash':'a'*64,'status':'proposed','result':None,'created_at':'2026-10-22T10:00:00Z','applied_at':None};handle.proposal=proposal;data={'action':proposal}
    elif path.endswith('/apply'):
     assert body=={'version':1,'snapshotHash':'a'*64};proposal=handle.proposal;agent.update({'id':'dddddddd-dddd-4ddd-8ddd-dddddddddddd',**proposal['payload']});proposal.update({'status':'applied','result':{'kind':'agent.create','id':agent['id']}});data={'action':proposal,'result':proposal['result']}
    elif path.startswith('/api/v1/studio/actions'):data={'actions':[],'hasMore':False}
    elif path==f'/api/v1/agents/{agent["id"]}':data={'agent':agent}
    else:raise AssertionError('Unexpected UI boundary '+path)
    route.fulfill(status=200,content_type='application/json',body=json.dumps(data))
   page.route('**/api/**',handle);page.goto('http://localhost:3033'+('/ar' if lang=='ar' else '')+'/studio');message=page.get_by_label('Your message' if lang=='en' else 'رسالتك',exact=True);message.wait_for();page.get_by_role('heading',name='How can I help you today?' if lang=='en' else 'أساعدك في إيه النهارده؟').wait_for();page.wait_for_function('document.fonts.status==="loaded"')
   assert page.locator('.site-header').count()==0 and page.locator('footer').count()==0
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth && document.documentElement.scrollHeight<=innerHeight+1')
   rect=message.bounding_box();assert rect['y']+rect['height']<height-25
   colors=page.locator('main').evaluate('(e)=>({bg:getComputedStyle(e).getPropertyValue("--background").trim(),primary:getComputedStyle(e).getPropertyValue("--primary").trim()})');assert {k:v.lower() for k,v in colors.items()}=={'bg':'#050505','primary':'#10b981'},colors
   assert page.locator('html').get_attribute('dir')==('rtl' if lang=='ar' else 'ltr')
   if lang=='ar':assert 'English upstream label' not in page.locator('select').inner_text();assert 'Response model' not in page.locator('main').inner_text()
   checks.append(f'{lang} {label}: dedicated viewport, correct tokens/locale, no overflow, composer anchored')
   page.screenshot(path=str(OUT/f'{lang}-{label}-welcome.png'))
   if label=='mobile':
    page.get_by_role('button',name='Open navigation' if lang=='en' else 'فتح التنقل').click();page.get_by_role('button',name='New chat' if lang=='en' else 'محادثة جديدة',exact=True).wait_for();page.screenshot(path=str(OUT/f'{lang}-mobile-navigation.png'));page.get_by_role('button',name='Close navigation' if lang=='en' else 'إغلاق التنقل',exact=True).last.click();checks.append(f'{lang} mobile navigation opens and closes')
   message.fill('Please organize the notes I provide.' if lang=='en' else 'رتب الملاحظات اللي هقدمها.');page.get_by_role('button',name='Send message' if lang=='en' else 'إرسال الرسالة',exact=True).click();page.get_by_text('Synthetic response from supplied facts.' if lang=='en' else 'دي مسودة تجريبية من المعلومات اللي قدمتها.',exact=True).wait_for()
   actionlabel='Review a project from my message' if lang=='en' else 'مراجعة مشروع من رسالتي';assert not page.get_by_role('button',name=actionlabel,exact=True).is_visible();page.get_by_label('Response actions' if lang=='en' else 'خيارات الرد',exact=True).click();page.get_by_role('button',name=actionlabel,exact=True).wait_for();page.get_by_label('Response actions' if lang=='en' else 'خيارات الرد',exact=True).click();checks.append(f'{lang} {label}: send/history refresh preserved; review actions tucked into response menu')
   if label=='desktop':page.screenshot(path=str(OUT/f'{lang}-desktop-conversation.png'))
   page.get_by_role('button',name='Add an approved text source' if lang=='en' else 'إضافة مصدر نصي معتمد',exact=True).click();page.get_by_role('heading',name='Try a synthetic example' if lang=='en' else 'جرّب مثالًا تجريبيًا',exact=True).wait_for();page.get_by_role('button',name='Back to chat' if lang=='en' else 'العودة للمحادثة',exact=True).click();message.wait_for();checks.append(f'{lang} {label}: real source-management entry/back-to-chat preserved')
   if lang=='en' and label=='desktop':
    message.fill('Create an assistant to organize supplier requests');page.get_by_role('button',name='Send message',exact=True).click();page.get_by_role('heading',name='What should your assistant help with?',exact=True).wait_for();page.get_by_role('button',name='Review configuration',exact=True).click();page.get_by_label('Assistant name',exact=True).fill('Synthetic reviewed assistant');page.get_by_role('button',name='Save assistant action for review',exact=True).click();page.get_by_role('heading',name='Review the exact action',exact=True).wait_for();assert 'Synthetic reviewed assistant' in page.locator('pre').inner_text();page.screenshot(path=str(OUT/'en-desktop-exact-review.png'));page.get_by_role('button',name='Approve and apply exact action',exact=True).click();page.get_by_text('Private assistant created',exact=False).wait_for();message.wait_for();checks.append('Typed assistant intent retains explicit saved-payload review and exact version/hash apply callback; opens returned assistant (HTTP fixture)')
   c.close()
 browser.close()
assert not errors,errors
(OUT/'verification.json').write_text(json.dumps({'environment':'actual local Next app, browser HTTP API fixtures with synthetic profile/history; no Auth/DB/model/delivery claim','status':'PASS','checks':checks,'runtime_errors':errors,'api_request_count':len(requests),'deployment':False},indent=2)+'\n');print('PASS',len(checks),'targeted UI groups; 4 locale/viewport screenshots; no browser runtime errors')
