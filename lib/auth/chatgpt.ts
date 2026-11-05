import 'server-only'
import {createHash,randomBytes} from 'node:crypto'
import {cookies} from 'next/headers'
import {createRemoteJWKSet,jwtVerify} from 'jose'
import {InputError} from '@/lib/account-validation'
import {adminClient,sessionClient,signedIn,rateLimit} from '@/lib/supabase/server'
import {safeAuthReturn} from '@/lib/auth-return'
const issuer='https://auth.openai.com'
const cookieName='agynexa_chatgpt_oauth'
const digest=(value:string)=>createHash('sha256').update(value).digest('hex')
const random=()=>randomBytes(32).toString('base64url')
export function chatGPTConfig(){
 const clientId=process.env.OPENAI_CLIENT_ID?.trim()||'',method=process.env.OPENAI_CLIENT_AUTH_METHOD?.trim()||'',secret=process.env.OPENAI_CLIENT_SECRET?.trim()
 const redirectUri=process.env.OPENAI_REDIRECT_URI?.trim()||'https://agynexa.si/api/auth/chatgpt/callback'
 let validRedirect=false;try{const u=new URL(redirectUri);validRedirect=u.protocol==='https:'&&u.hostname==='agynexa.si'&&u.pathname==='/api/auth/chatgpt/callback'&&!u.search&&!u.hash}catch{}
 const configured=/^oaiapp_[A-Za-z0-9_-]+$/.test(clientId)&&['none','client_secret_basic'].includes(method)&&(method==='none'||!!secret)&&validRedirect
 return {configured,clientId,method,secret,redirectUri}
}
export function chatGPTProvider(){const c=chatGPTConfig();return {configured:c.configured,href:'/api/auth/chatgpt/start',planUsage:false,...(c.configured?{clientId:c.clientId}:{})}}
let discoveryCache:{expires:number;value:{issuer:string;authorization_endpoint:string;token_endpoint:string;jwks_uri:string}}|undefined
async function discovery(){
 if(discoveryCache&&discoveryCache.expires>Date.now())return discoveryCache.value
 const response=await fetch(`${issuer}/.well-known/openid-configuration`,{cache:'no-store',redirect:'error',signal:AbortSignal.timeout(10000)})
 if(!response.ok)throw new InputError('chatgpt_unavailable',503)
 const value=await response.json()
 if(value.issuer!==issuer||['authorization_endpoint','token_endpoint','jwks_uri'].some(k=>{try{return new URL(value[k]).origin!==issuer}catch{return true}}))throw new InputError('chatgpt_unavailable',503)
 discoveryCache={expires:Date.now()+3600000,value};return value
}
export async function beginChatGPT(request:Request){
 const c=chatGPTConfig();if(!c.configured)throw new InputError('chatgpt_unavailable',503)
 const input=new URL(request.url),locale=input.searchParams.get('locale')==='ar'?'ar':'en',link=input.searchParams.get('link')==='1'
 const site=input.origin
 if(site!=='https://agynexa.si')throw new InputError('chatgpt_unavailable',503)
 const fetchSite=request.headers.get('sec-fetch-site');if(fetchSite==='cross-site')throw new InputError('chatgpt_failed',403)
 const linking=link?await signedIn():null
 if(linking){const {data,error}=await linking.client.from('profiles').select('id').eq('id',linking.user.id).maybeSingle();if(error||!data)throw new InputError('sign_in_required',401)}
 const ip=process.env.VERCEL==='1'?(request.headers.get('x-vercel-forwarded-for')||'unknown'):'local'
 await rateLimit(request,'login','chatgpt-oauth:'+ip)
 const returnTo=safeAuthReturn(input.searchParams.get('returnTo'),locale==='ar')
 // The existing transaction hashes the entire cookie, binding its public return context to this browser.
 // No prompt, credential or external URL is accepted; no additional database field is needed.
 const meta=await discovery(),state=random(),verifier=randomBytes(64).toString('base64url'),nonce=random(),browser=`${random()}.${Buffer.from(returnTo).toString('base64url')}`,db=adminClient()
 const {error:cleanup}=await db.from('chatgpt_oauth_transactions').delete().lt('expires_at',new Date().toISOString());if(cleanup)throw cleanup
 const {error}=await db.from('chatgpt_oauth_transactions').insert({state_hash:digest(state),browser_hash:digest(browser),code_verifier:verifier,nonce,locale,user_id:linking?.user.id||null,expires_at:new Date(Date.now()+600000).toISOString()});if(error)throw error
 const jar=await cookies();jar.set(cookieName,browser,{httpOnly:true,secure:true,sameSite:'lax',path:'/api/auth/chatgpt',maxAge:600})
 const url=new URL(meta.authorization_endpoint);url.search=new URLSearchParams({client_id:c.clientId,redirect_uri:c.redirectUri,response_type:'code',scope:'openid profile email',state,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256',nonce}).toString()
 return url.href
}
export async function completeChatGPT(request:Request){
 let callbackLocale:'ar'|'en'='en',callbackReturn:string|null=null
 try{
 const c=chatGPTConfig();if(!c.configured)throw new InputError('chatgpt_unavailable',503)
 const url=new URL(request.url),state=url.searchParams.get('state'),jar=await cookies(),browser=jar.get(cookieName)?.value
 jar.delete({name:cookieName,path:'/api/auth/chatgpt'})
 if(!state||state.length>200||!browser||browser.length>3000)throw new InputError('chatgpt_failed')
 const db=adminClient()
 // DELETE ... RETURNING provides one-time consumption across serverless instances.
 const {data:t,error}=await db.from('chatgpt_oauth_transactions').delete().eq('state_hash',digest(state)).eq('browser_hash',digest(browser)).gt('expires_at',new Date().toISOString()).select('*').maybeSingle()
 if(error||!t)throw new InputError('chatgpt_failed')
 const locale=t.locale==='ar'?'ar':'en';callbackLocale=locale
 // Decode only after the one-time database transaction verifies the complete cookie hash.
 const encodedReturn=browser.split('.')[1]
 callbackReturn=safeAuthReturn(encodedReturn&&/^[A-Za-z0-9_-]+$/.test(encodedReturn)?Buffer.from(encodedReturn,'base64url').toString('utf8'):null,locale==='ar')
 const fail=(code:string):never=>{throw Object.assign(new InputError(code),{locale})}
 if(url.searchParams.has('error'))fail('chatgpt_cancelled')
 const code=url.searchParams.get('code');if(!code||code.length>4096)fail('chatgpt_failed')
 const meta=await discovery(),headers:Record<string,string>={accept:'application/json','Content-Type':'application/x-www-form-urlencoded'}
 if(c.method==='client_secret_basic'){const encode=(v:string)=>new URLSearchParams({v}).toString().slice(2);headers.Authorization=`Basic ${Buffer.from(`${encode(c.clientId)}:${encode(c.secret!)}`).toString('base64')}`}
 const tokenResponse=await fetch(meta.token_endpoint,{method:'POST',headers,body:new URLSearchParams({grant_type:'authorization_code',code:code!,redirect_uri:c.redirectUri,client_id:c.clientId,code_verifier:t.code_verifier}),cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15000)})
 if(!tokenResponse.ok){await tokenResponse.body?.cancel();fail('chatgpt_failed')}
 const tokens=await tokenResponse.json();if(typeof tokens.id_token!=='string')fail('chatgpt_failed')
 const {payload}=await jwtVerify(tokens.id_token,createRemoteJWKSet(new URL(meta.jwks_uri)),{issuer,audience:c.clientId,algorithms:['RS256','ES256'],requiredClaims:['sub','exp','iat'],clockTolerance:5})
 if(payload.nonce!==t.nonce||typeof payload.sub!=='string'||!payload.sub||payload.sub.length>300||(typeof payload.iat==='number'&&payload.iat>Date.now()/1000+5))fail('chatgpt_failed')
 const identity={issuer,client_id:c.clientId,subject:payload.sub!}
 const lookup=()=>db.from('chatgpt_identities').select('user_id').match(identity).maybeSingle()
 const {data:known,error:readError}=await lookup();if(readError)throw readError
 let userId=known?.user_id as string|undefined
 if(t.user_id){
  const current=await signedIn();if(current.user.id!==t.user_id)fail('chatgpt_identity_conflict')
  const {data:active,error:activeError}=await current.client.from('profiles').select('id').eq('id',current.user.id).maybeSingle();if(activeError||!active)fail('chatgpt_identity_conflict')
  if(userId&&userId!==current.user.id)fail('chatgpt_identity_conflict')
  userId=current.user.id
 }else if(!userId){
  if(payload.email_verified!==true||typeof payload.email!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)||payload.email.length>254)fail('chatgpt_email_unverified')
  const created=await db.auth.admin.createUser({email:payload.email as string,email_confirm:true,user_metadata:{display_name:typeof payload.name==='string'?payload.name.slice(0,100):'AGYNEXA user'}})
  if(created.error){const reread=await lookup();if(reread.data)userId=reread.data.user_id;else fail('chatgpt_link_required')}
  else userId=created.data.user.id
 }
 if(!known){const {error:linkError}=await db.from('chatgpt_identities').insert({...identity,user_id:userId});if(linkError){const reread=await lookup();if(reread.data?.user_id!==userId)fail('chatgpt_identity_conflict')}}
 const account=await db.auth.admin.getUserById(userId!),email=account.data.user?.email;
 if(account.error||!email)throw new InputError('chatgpt_failed')
 // Issue the app's existing Supabase session only after verified OIDC identity. No email is sent.
 const link=await db.auth.admin.generateLink({type:'magiclink',email}),tokenHash=link.data.properties?.hashed_token
 if(link.error||link.data.user?.id!==userId||!tokenHash)throw new InputError('chatgpt_failed')
 const client=await sessionClient(),verified=await client.auth.verifyOtp({token_hash:tokenHash,type:'email'})
 if(verified.error||verified.data.user?.id!==userId||!verified.data.session)fail('chatgpt_failed')
 return callbackReturn
 }catch(error){if(error&&typeof error==='object')Object.assign(error,{locale:callbackLocale,returnTo:callbackReturn});throw error}
}
