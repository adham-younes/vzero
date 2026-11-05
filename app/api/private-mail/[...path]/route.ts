import {credentials,InputError} from '@/lib/account-validation'
import {adminClient,authFailure,json,rateLimit,sessionClient} from '@/lib/supabase/server'
import {mailAdmin,mailMutation,exactKeys} from '@/lib/nexa-email/admin'
import {mailConfig} from '@/lib/nexa-email/config'
import {MailError} from '@/lib/nexa-email/errors'
import {MAILBOXES,UUID} from '@/lib/owner-mail/policy'
import {mintConnectorToken} from '@/lib/owner-mail/connector'
import {sendOwnerLoginLink,verifyOwnerLoginLink} from '@/lib/owner-mail/login'
import {requireConsole,listMail,readMail,replyMail,holdMail,listKnowledge,saveKnowledge,disableKnowledge,downloadMail,audit,type MailActor} from '@/lib/owner-mail/console'
export const runtime='nodejs'
export const maxDuration=60
export const dynamic='force-dynamic'
type Context={params:Promise<{path:string[]}>}
async function handle(request:Request,ctx:Context){
 try{
  await requireConsole()
  const {path}=await ctx.params,method=request.method,url=new URL(request.url),name=path.join('/')
  if(name==='login-link'&&method==='POST'){const b=await mailMutation(request);exactKeys(b,['email']);return json(await sendOwnerLoginLink(request,b.email))}
  if(name==='login-link/verify'&&method==='POST'){const b=await mailMutation(request);exactKeys(b,['tokenHash']);return json(await verifyOwnerLoginLink(request,b.tokenHash))}
  if(name==='login'&&method==='POST'){
   const body=await mailMutation(request);exactKeys(body,['email','password']);const input=credentials(body);await rateLimit(request,'login',input.email)
   const client=await sessionClient(),{data,error}=await client.auth.signInWithPassword(input)
   if(error)throw authFailure(error,'invalid_credentials')
   if(!data.user||!data.session||!mailConfig().admins.has(data.user.id)){await client.auth.signOut({scope:'local'});throw new MailError('invalid_credentials',401)}
   const profile=await client.from('profiles').select('id').eq('id',data.user.id).maybeSingle()
   if(profile.error||!profile.data){await client.auth.signOut({scope:'local'});throw new MailError('invalid_credentials',401)}
   return json({ok:true})
  }
  if(name==='session'&&method==='GET'){
   try{const owner=await mailAdmin();return json({authenticated:true,owner:true})}catch(error){if(error instanceof InputError&&error.status===401)return json({authenticated:false,owner:false});throw error}
  }
  const owner=await mailAdmin(),actor:MailActor={id:owner.actor,kind:'owner'},db=owner.db
  if(method!=='GET'&&method!=='HEAD'&&request.headers.get('origin')!==url.origin)throw new MailError('invalid_origin',403)
  if(name==='logout'&&method==='POST'){const c=await sessionClient();await c.auth.signOut({scope:'local'});return json({ok:true})}
  if(name==='messages'&&method==='GET')return json(await listMail({inbox:url.searchParams.get('inbox')||undefined,status:url.searchParams.get('status')||undefined,q:url.searchParams.get('q')||undefined,cursor:url.searchParams.get('cursor')||undefined}))
  if(path[0]==='messages'&&path[1]){
   if(path.length===2&&method==='GET')return json(await readMail(path[1]))
   if(path[2]==='download'&&path.length===3&&method==='GET')return downloadMail(path[1],url.searchParams.get('attachment'))
   if(path[2]==='reply'&&path.length===3&&method==='POST'){const b=await mailMutation(request);exactKeys(b,['text','requestId']);return json(await replyMail(path[1],b.text as string,b.requestId as string,actor))}
   if(path[2]==='hold'&&path.length===3&&method==='POST'){const b=await mailMutation(request);exactKeys(b,['mode']);return json(await holdMail(path[1],b.mode,actor))}
  }
  if(name==='knowledge'&&method==='GET')return json(await listKnowledge())
  if(name==='knowledge'&&method==='POST')return json(await saveKnowledge(null,await mailMutation(request),actor))
  if(path[0]==='knowledge'&&path.length===2){
   if(method==='PATCH')return json(await saveKnowledge(path[1],await mailMutation(request),actor))
   if(method==='DELETE')return json(await disableKnowledge(path[1],actor))
  }
  if(name==='settings'&&method==='GET'){
   const [settings,tokens]=await Promise.all([db.from('owner_mail_settings').select('inbox,auto_reply'),db.from('owner_mail_connector_tokens').select('id,name,created_at,expires_at').eq('owner_id',owner.actor).is('revoked_at',null).gt('expires_at',new Date().toISOString()).order('created_at',{ascending:false})])
   if(settings.error||tokens.error)throw new MailError('mail_unavailable',503)
   return json({mailboxes:settings.data||[],gmail:{status:process.env.OWNER_MAIL_GMAIL_VERIFIED==='true'?'connected':'requires_connection',detail:process.env.OWNER_MAIL_GMAIL_VERIFIED==='true'?'يصل البريد الجديد عبر التحويل المتحقق منه.':'يحتاج ربط Gmail والتحقق من استقبال رسالة محوّلة. اتصال المحادثة وحده لا يشغّل خدمة البريد.'},connector:{tokens:tokens.data||[],endpoint:url.origin+'/api/private-mail/mcp'}})
  }
  if(name==='settings'&&method==='PATCH'){
   const b=await mailMutation(request);exactKeys(b,['inbox','auto_reply']);if(!MAILBOXES.some(m=>m.address===b.inbox)||typeof b.auto_reply!=='boolean')throw new MailError('invalid_input',400)
   const {error}=await db.from('owner_mail_settings').update({auto_reply:b.auto_reply,updated_at:new Date().toISOString()}).eq('inbox',b.inbox)
   if(error)throw new MailError('mail_unavailable',503);await audit(actor,'auto_reply_changed',String(b.inbox));return json({ok:true})
  }
  if(name==='connector/tokens'&&method==='POST'){
   const b=await mailMutation(request);exactKeys(b,['name']);const {count,error}=await db.from('owner_mail_connector_tokens').select('id',{count:'exact',head:true}).eq('owner_id',owner.actor).is('revoked_at',null).gt('expires_at',new Date().toISOString())
   if(error)throw new MailError('mail_unavailable',503);if((count||0)>=5)throw new MailError('connector_token_limit',409)
   const token=await mintConnectorToken(db,owner.actor,b.name as string);await audit(actor,'connector_token_created',token.id);return json(token)
  }
  if(path[0]==='connector'&&path[1]==='tokens'&&path.length===3&&method==='DELETE'){
   if(!UUID.test(path[2]))throw new MailError('invalid_input',400)
   const {error}=await db.from('owner_mail_connector_tokens').update({revoked_at:new Date().toISOString()}).eq('id',path[2]).eq('owner_id',owner.actor)
   if(error)throw new MailError('mail_unavailable',503);await audit(actor,'connector_token_revoked',path[2]);return json({ok:true})
  }
  throw new MailError('not_found',404)
 }catch(error){const known=error instanceof MailError||error instanceof InputError;return json({error:known?error.code:'mail_unavailable'},known?error.status:503)}
}
export const GET=handle
export const POST=handle
export const PATCH=handle
export const DELETE=handle
