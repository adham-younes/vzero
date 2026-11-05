import 'server-only'
import {createHash,timingSafeEqual} from 'node:crypto'
import {MailError} from '@/lib/nexa-email/errors'
export const digest=(v:Uint8Array|string)=>createHash('sha256').update(v).digest('hex')
export async function bytes(response:Response|Request,max:number){
 if(Number(response.headers.get('content-length'))>max)throw new MailError('mail_body_too_large',413)
 const reader=response.body?.getReader();if(!reader)throw new MailError('mail_empty_body',400)
 let timer:ReturnType<typeof setTimeout>|undefined
 try{return await Promise.race([(async()=>{const parts:Uint8Array[]=[];let size=0;while(true){const r=await reader.read();if(r.done)break;size+=r.value.length;if(size>max)throw new MailError('mail_body_too_large',413);parts.push(r.value)}return Buffer.concat(parts,size)})(),new Promise<never>((_,reject)=>{timer=setTimeout(()=>{void reader.cancel().catch(()=>{});reject(new MailError('mail_read_timeout',503))},15000)})])}finally{clearTimeout(timer);void reader.cancel().catch(()=>{});try{reader.releaseLock()}catch{}}
}
export async function provider(path:string,payload?:unknown,key?:string){
 const apiKey=process.env.RESEND_API_KEY;if(!apiKey)throw new MailError('mail_not_configured',503)
 const r=await fetch('https://api.resend.com'+path,{method:payload?'POST':'GET',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json',...(key?{'Idempotency-Key':key}:{})},body:payload?JSON.stringify(payload):undefined,signal:AbortSignal.timeout(12000),redirect:'error',cache:'no-store'})
 if(!r.ok){void r.body?.cancel();throw new MailError(r.status===409?'mail_provider_conflict':'mail_provider_unavailable',503)}
 return JSON.parse((await bytes(r,4*1024*1024)).toString())
}
export async function download(url:string){
 const u=new URL(url)
 if(u.protocol!=='https:'||u.username||u.password||u.port||!['cdn.resend.app','inbound-cdn.resend.com','outbound-cdn.resend.com'].includes(u.hostname))throw new MailError('mail_download_host_invalid',503)
 const r=await fetch(u,{signal:AbortSignal.timeout(15000),redirect:'error',cache:'no-store'})
 if(!r.ok)throw new MailError('mail_download_failed',503)
 return bytes(r,50*1024*1024)
}
export function requireToken(request:Request,name:'OWNER_MAIL_WORKER_TOKEN'|'OWNER_MAIL_IMPORT_TOKEN'){
 const actual=request.headers.get('authorization')||'',secret=process.env[name]
 if(!secret||secret.length<32||!timingSafeEqual(Buffer.from(digest(actual)),Buffer.from(digest('Bearer '+secret))))throw new MailError('mail_access_denied',403)
}
