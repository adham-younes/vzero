import 'server-only'
import {createHash,createHmac,randomBytes,timingSafeEqual} from 'node:crypto'
import {adminClient,json} from '@/lib/supabase/server'
import {mailAdmin} from '@/lib/nexa-email/admin'
import {MailError} from '@/lib/nexa-email/errors'
import {InputError} from '@/lib/account-validation'
import {requireConsole} from './console'
import {CONNECTOR_SCOPES,mintConnectorToken} from './connector'

export const MAIL_ISSUER='https://mail.agynexa.si'
export const MAIL_RESOURCE=MAIL_ISSUER+'/api/private-mail/mcp'
const CLIENT='nexa-mail-chatgpt'
const REDIRECT='https://chatgpt.com/connector_platform_oauth_redirect'
const SCOPE=CONNECTOR_SCOPES.join(' ')
const hash=(s:string)=>createHash('sha256').update(s).digest('hex')
function sign(s:string){const key=process.env.SUPABASE_SECRET_KEY;if(!key)throw new MailError('temporarily_unavailable',503);return createHmac('sha256',key).update('nexa-mail-consent-v1:'+s).digest('base64url')}
function escape(s:string){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))}
function fail(code='invalid_request'):never{throw new MailError(code,400)}
function parameters(p:URLSearchParams){
 for(const key of p.keys())if(p.getAll(key).length!==1)fail()
 if(p.get('client_id')!==CLIENT||p.get('redirect_uri')!==REDIRECT)fail('invalid_client')
 if(p.get('response_type')!=='code'||p.get('code_challenge_method')!=='S256'||! /^[A-Za-z0-9_-]{43}$/.test(p.get('code_challenge')||''))fail()
 const scopes=(p.get('scope')||SCOPE).split(' ').filter(Boolean)
 if(scopes.length!==3||new Set(scopes).size!==3||scopes.some(x=>!CONNECTOR_SCOPES.includes(x as typeof CONNECTOR_SCOPES[number])))fail('invalid_scope')
 if(p.get('resource')&&p.get('resource')!==MAIL_RESOURCE)fail('invalid_target')
 const state=p.get('state')||'';if(!state||state.length>2048)fail()
 return {client:CLIENT,redirect:REDIRECT,challenge:p.get('code_challenge')!,state,resource:MAIL_RESOURCE,scope:SCOPE}
}
export function mailAuthorizationMetadata(){return {issuer:MAIL_ISSUER,authorization_endpoint:MAIL_ISSUER+'/api/private-mail/oauth/authorize',token_endpoint:MAIL_ISSUER+'/api/private-mail/oauth/token',response_types_supported:['code'],grant_types_supported:['authorization_code'],code_challenge_methods_supported:['S256'],token_endpoint_auth_methods_supported:['none'],scopes_supported:[...CONNECTOR_SCOPES],authorization_response_iss_parameter_supported:true}}
export function mailResourceMetadata(){return {resource:MAIL_RESOURCE,authorization_servers:[MAIL_ISSUER],scopes_supported:[...CONNECTOR_SCOPES],bearer_methods_supported:['header'],resource_name:'NEXA Mail'}}
async function form(request:Request){
 if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))fail()
 const reader=request.body?.getReader();if(!reader)fail();let size=0;const parts:Uint8Array[]=[]
 try{while(true){const x=await reader.read();if(x.done)break;size+=x.value.length;if(size>12000){await reader.cancel();fail()}parts.push(x.value)}}finally{reader.releaseLock()}
 const p=new URLSearchParams(Buffer.concat(parts).toString('utf8'));for(const key of p.keys())if(p.getAll(key).length!==1)fail();return p
}
async function limit(request:Request){
 const ip=request.headers.get('x-vercel-forwarded-for')||'unknown'
 const r=await adminClient().rpc('consume_auth_limit',{bucket_key:hash('mail-oauth:'+ip),max_attempts:60})
 if(r.error)throw new MailError('temporarily_unavailable',503);if(r.data!==true)throw new MailError('rate_limited',429)
}
export async function mailOAuth(request:Request,action:string){
 try{
  await requireConsole();await limit(request)
  if(action==='authorize'){
   // OAuth clients can initiate a top-level POST with parameters in the URL.
   // Normalize initiation to GET; this never creates a code or grants access.
   if(request.method==='POST'&&new URL(request.url).searchParams.has('response_type')){
    parameters(new URL(request.url).searchParams)
    return new Response(null,{status:303,headers:{Location:request.url,'Cache-Control':'no-store'}})
   }
   if(request.method==='GET'){
    const p=parameters(new URL(request.url).searchParams)
    let owner;try{owner=await mailAdmin()}catch(e){if(e instanceof InputError&&e.status===401)return new Response('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><p>سجّل الدخول إلى بريد NEXA في تبويب آخر، ثم حدّث صفحة التفويض.</p><a href="/private-mail" target="_blank" rel="noopener">دخول المالك</a></html>',{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});throw e}
    const payload=Buffer.from(JSON.stringify({...p,owner:owner.actor,exp:Date.now()+600000,nonce:randomBytes(24).toString('base64url')})).toString('base64url')
    const ticket=payload+'.'+sign(payload)
    return new Response(`<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>ربط NEXA Mail بـChatGPT</title><style>body{background:#050505;color:#eee;font:18px system-ui;max-width:620px;margin:10vh auto;padding:24px;line-height:1.8}button{background:#10b981;color:#050505;padding:14px 24px;border:0;border-radius:10px;font:inherit}a{color:#10b981}</style><h1>ربط بريدك بـChatGPT</h1><p>يسمح هذا الاتصال لـChatGPT بقراءة رسائل الصندوقين وبيانات مرفقاتها، وقراءة المعرفة المعتمدة، وإرسال ردود ضمن قواعد NEXA.</p><p>الرسائل الحساسة تبقى للمراجعة. لا يتيح حذف الرسائل أو الدخول إلى Gmail. ينتهي الاتصال بعد 30 يومًا ويمكن إلغاؤه من إعدادات البريد.</p><form method="post" action="/api/private-mail/oauth/authorize"><input type="hidden" name="ticket" value="${escape(ticket)}"><button type="submit">السماح وربط ChatGPT</button></form><p><a href="/private-mail">إلغاء والعودة للبريد</a></p></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY'}})
   }
   if(request.method!=='POST')fail()
   if(request.headers.get('origin')!==MAIL_ISSUER)throw new MailError('invalid_origin',403)
   const owner=await mailAdmin(),p=await form(request),ticket=p.get('ticket')||'',parts=ticket.split('.')
   if(parts.length!==2||! /^[A-Za-z0-9_-]{43}$/.test(parts[1]))fail()
   const expected=Buffer.from(sign(parts[0])),received=Buffer.from(parts[1]);if(expected.length!==received.length||!timingSafeEqual(expected,received))fail()
   const data=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'))
   if(data.owner!==owner.actor||!Number.isSafeInteger(data.exp)||data.exp<Date.now()||data.client!==CLIENT||data.redirect!==REDIRECT||data.resource!==MAIL_RESOURCE||data.scope!==SCOPE)fail()
   const code=randomBytes(32).toString('base64url')
   const result=await owner.db.from('owner_mail_oauth_codes').insert({code_hash:hash(code),consent_hash:hash(data.nonce),owner_id:owner.actor,client_id:CLIENT,redirect_uri:REDIRECT,challenge:data.challenge,resource:MAIL_RESOURCE,expires_at:new Date(Date.now()+300000).toISOString()})
   if(result.error)throw new MailError('consent_expired',400)
   const redirect=new URL(REDIRECT);redirect.searchParams.set('code',code);redirect.searchParams.set('state',data.state);redirect.searchParams.set('iss',MAIL_ISSUER)
   return new Response(null,{status:303,headers:{Location:redirect.toString(),'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}})
  }
  if(action==='token'&&request.method==='POST'){
   const p=await form(request),code=p.get('code')||'',verifier=p.get('code_verifier')||''
   if(p.get('grant_type')!=='authorization_code')fail('unsupported_grant_type')
   if(p.get('client_id')!==CLIENT||p.get('redirect_uri')!==REDIRECT||p.has('client_secret')||request.headers.has('authorization'))fail('invalid_client')
   if(p.get('resource')&&p.get('resource')!==MAIL_RESOURCE)fail('invalid_target')
   if(! /^[A-Za-z0-9_-]{43}$/.test(code)||! /^[A-Za-z0-9._~-]{43,128}$/.test(verifier))fail('invalid_grant')
   const challenge=createHash('sha256').update(verifier).digest('base64url'),db=adminClient()
   const claimed=await db.from('owner_mail_oauth_codes').update({consumed_at:new Date().toISOString()}).eq('code_hash',hash(code)).eq('client_id',CLIENT).eq('redirect_uri',REDIRECT).eq('challenge',challenge).eq('resource',MAIL_RESOURCE).is('consumed_at',null).gt('expires_at',new Date().toISOString()).select('owner_id').maybeSingle()
   if(claimed.error)throw new MailError('temporarily_unavailable',503);if(!claimed.data)fail('invalid_grant')
   const token=await mintConnectorToken(db,claimed.data.owner_id,'ChatGPT OAuth')
   return json({access_token:token.token,token_type:'Bearer',expires_in:Math.max(0,Math.floor((Date.parse(token.expires_at)-Date.now())/1000)),scope:SCOPE})
  }
  throw new MailError('not_found',404)
 }catch(e){const known=e instanceof MailError||e instanceof InputError;return json({error:known?e.code:'server_error'},known?e.status:500)}
}
