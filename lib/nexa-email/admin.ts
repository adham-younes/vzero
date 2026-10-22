import 'server-only'
import {signedIn,json,adminClient} from '@/lib/supabase/server'
import {InputError} from '@/lib/account-validation'
import {mailConfig} from './config'
import {MailError} from './errors'
export async function mailAdmin(){
 const session=await signedIn()
 const {data,error}=await session.client.from('profiles').select('id').eq('id',session.user.id).maybeSingle()
 if(error)throw new MailError('mail_unavailable',503)
 if(!data)throw new InputError('sign_in_required',401)
 if(!mailConfig().admins.has(session.user.id))throw new MailError('mail_access_denied',403)
 return {actor:session.user.id,db:adminClient()}
}
export async function mailEndpoint(work:()=>Promise<unknown>){
 try{return json(await work())}catch(error){
  const known=error instanceof MailError||error instanceof InputError
  return json({error:known?error.code:'mail_unavailable'},known?error.status:503)
 }
}
export async function mailMutation(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)throw new InputError('invalid_origin',403)
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw new InputError('invalid_content_type',415)
 const reader=request.body?.getReader();if(!reader)throw new InputError('invalid_input')
 let timer:ReturnType<typeof setTimeout>|undefined
 try{
  const body=await Promise.race([(async()=>{let size=0;const parts:Uint8Array[]=[];while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>300000){void reader.cancel().catch(()=>{});throw new InputError('body_too_large',413)}parts.push(value)}return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(parts,size))) as unknown})(),new Promise<never>((_resolve,reject)=>{timer=setTimeout(()=>{void reader.cancel().catch(()=>{});reject(new InputError('request_timeout',408))},5000)})])
  if(!body||typeof body!=='object'||Array.isArray(body))throw new InputError('invalid_input')
  return body as Record<string,unknown>
 }catch(error){if(error instanceof InputError)throw error;throw new InputError('invalid_input')}
 finally{clearTimeout(timer);try{reader.releaseLock()}catch{}}
}
export function exactKeys(body:Record<string,unknown>,allowed:string[]){if(Object.keys(body).some(k=>!allowed.includes(k)))throw new InputError('invalid_input')}
export function uuid(value:unknown){if(typeof value!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))throw new InputError('invalid_input');return value}
export function versionHash(body:Record<string,unknown>){if(!Number.isSafeInteger(body.version)||Number(body.version)<1||typeof body.snapshotHash!=='string'||!/^[a-f0-9]{64}$/.test(body.snapshotHash))throw new InputError('invalid_input');return {version:body.version as number,hash:body.snapshotHash}}
