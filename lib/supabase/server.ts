import 'server-only'
import {createServerClient} from '@supabase/ssr'
import {createClient} from '@supabase/supabase-js'
import {cookies} from 'next/headers'
import {createHmac} from 'node:crypto'
import {InputError} from '@/lib/account-validation'

function config() {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
 if(url!=='https://xsyxvswbiptbyxyqhdim.supabase.co' && url!=='https://xsyxvswbiptbyxyqhdim.supabase.co/')throw new Error('Invalid project configuration')
 if(!key)throw new Error('Missing public key')
 return {url,key}
}
export function adminClient(){
 const {url}=config();const key=process.env.SUPABASE_SECRET_KEY?.trim()
 if(!key)throw new Error('Missing secret key')
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(url,options)=>fetch(url,{...options,cache:'no-store',signal:AbortSignal.timeout(10000)})}})
}
// Only route handlers consume this client. Cookie writes and refresh occur here;
// marketing pages do not read sessions, and no browser Supabase client is used.
export async function sessionClient(){
 const {url,key}=config();const jar=await cookies()
 return createServerClient(url,key,{
  cookieOptions:{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/'},
  cookies:{getAll:()=>jar.getAll(),setAll:values=>{for(const {name,value,options} of values)jar.set(name,value,{...options,httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/'})}},
  global:{fetch:(url,options)=>fetch(url,{...options,cache:'no-store',signal:AbortSignal.timeout(10000)})},
 })
}
export async function signedIn(){
 const client=await sessionClient();const {data,error}=await client.auth.getUser()
 if(error||!data.user)throw new InputError('sign_in_required',401)
 return {client,user:data.user}
}
export function json(value:unknown,status=200){return Response.json(value,{status,headers:{'Cache-Control':'private, no-store','Pragma':'no-cache','X-Content-Type-Options':'nosniff'}})}
export function failure(error:unknown){return error instanceof InputError?json({error:error.code},error.status):json({error:'temporarily_unavailable'},503)}
export async function rateLimit(request:Request,action:'register'|'login',email:string){
 const secret=process.env.SUPABASE_SECRET_KEY?.trim();if(!secret)throw new Error('Missing secret key')
 // Vercel overwrites this trusted header. Never trust client x-forwarded-for.
 const ip=process.env.VERCEL==='1'?(request.headers.get('x-vercel-forwarded-for')||'unknown'):'local'
 const hash=(value:string)=>createHmac('sha256',secret).update(value).digest('hex')
 const entries=[{key:hash(action+':ip:'+ip),limit:action==='register'?10:40},{key:hash(action+':email:'+email),limit:action==='register'?5:20}]
 if(action==='register')entries.push({key:hash('register:global'),limit:100})
 const client=adminClient()
 for(const item of entries){const {data,error}=await client.rpc('consume_auth_limit',{bucket_key:item.key,max_attempts:item.limit});if(error)throw new Error('Rate limiter unavailable');if(data!==true)throw new InputError('try_later',429)}
}
