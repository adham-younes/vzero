import 'server-only'
import {createHmac} from 'node:crypto'
import {adminClient,authFailure,sessionClient} from '@/lib/supabase/server'
import {field} from '@/lib/account-validation'
import {mailConfig} from '@/lib/nexa-email/config'
import {MailError} from '@/lib/nexa-email/errors'
import {digest,provider} from './io'

async function limit(request:Request,action:'link'|'verify',email=''){
 const key=process.env.SUPABASE_SECRET_KEY;if(!key)throw new MailError('mail_unavailable',503)
 const ip=process.env.VERCEL==='1'?(request.headers.get('x-vercel-forwarded-for')||'unknown'):'local'
 const entries=action==='link'?[[`link:email:${email}`,3],[`link:ip:${ip}`,6],['link:global',10]] as const:[[ `verify:ip:${ip}`,30]] as const
 for(const [value,max] of entries){
  const bucket=createHmac('sha256',key).update('owner-mail-login:'+value).digest('hex')
  const result=await adminClient().rpc('consume_auth_limit',{bucket_key:bucket,max_attempts:max})
  if(result.error)throw new MailError('mail_unavailable',503)
  if(result.data!==true)throw new MailError('try_later',429)
 }
}

export async function sendOwnerLoginLink(request:Request,value:unknown){
 const email=field(value,254).toLowerCase()
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new MailError('invalid_input',400)
 await limit(request,'link',email)
 const db=adminClient(),admins=[...mailConfig().admins]
 // Resolve only existing, verified owners. Never create an account through this flow.
 let ownerId:string|null=null
 for(const id of admins.slice(0,20)){
  const result=await db.auth.admin.getUserById(id)
  if(result.error)throw new MailError('mail_unavailable',503)
  if(result.data.user.email?.toLowerCase()===email&&result.data.user.email_confirmed_at){ownerId=id;break}
 }
 if(!ownerId)return {ok:true}
 const profile=await db.from('profiles').select('id').eq('id',ownerId).maybeSingle()
 if(profile.error)throw new MailError('mail_unavailable',503)
 if(!profile.data)return {ok:true}
 const result=await db.auth.admin.generateLink({type:'magiclink',email})
 const token=result.data.properties?.hashed_token
 if(result.error||result.data.user?.id!==ownerId||!token||!/^[a-f0-9]{40,128}$/i.test(token))throw new MailError('mail_login_unavailable',503)
 // The fragment is not sent in HTTP requests, access logs, or Referer headers.
 const link='https://mail.agynexa.si/private-mail#token_hash='+token
 await provider('/emails',{from:'NEXA Mail <nexa.agent@agynexa.si>',to:[email],subject:'رابط دخولك إلى NEXA Mail',text:`افتح الرابط التالي للدخول إلى بريدك الخاص. الرابط مؤقت ويستخدم مرة واحدة. لا تشاركه مع أحد.\n\n${link}\n\nإذا لم تطلب الدخول، تجاهل هذه الرسالة. كلمة مرور حسابك لم تتغير.`,headers:{'Auto-Submitted':'auto-generated','X-Auto-Response-Suppress':'All'}},'owner-mail-login/'+digest(token))
 return {ok:true}
}

export async function verifyOwnerLoginLink(request:Request,value:unknown){
 if(typeof value!=='string'||!/^[a-f0-9]{40,128}$/i.test(value))throw new MailError('invalid_input',400)
 await limit(request,'verify')
 const client=await sessionClient(),result=await client.auth.verifyOtp({token_hash:value,type:'magiclink'})
 if(result.error)throw authFailure(result.error,'invalid_credentials')
 const user=result.data.user
 if(!user||!result.data.session||!mailConfig().admins.has(user.id)){await client.auth.signOut({scope:'local'});throw new MailError('invalid_credentials',401)}
 const profile=await client.from('profiles').select('id').eq('id',user.id).maybeSingle()
 if(profile.error||!profile.data){await client.auth.signOut({scope:'local'});throw new MailError('invalid_credentials',401)}
 return {ok:true}
}
