import 'server-only'
import {MailError} from './errors'
import type {MailProvider,SendPayload} from './types'
import {NEXA_RESEND_INBOX_ID} from './types'
import {NEXA_IDENTITY} from './types'
import {normalizeInboxEmail} from './inbound'
import {inboxReplyContext} from './drafts'
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_RESPONSE=2*1024*1024
/** Bounded REST is used because the pinned SDK has no injectable fetch transport. */
export function createMailProvider(apiKey:string,fetchImpl:typeof fetch=fetch):MailProvider{
 if(!apiKey||/[\r\n]/.test(apiKey))throw new MailError('provider_not_configured',503)
 async function request(path:string,send:boolean,payload?:Record<string,unknown>,key?:string):Promise<unknown>{
  const controller=new AbortController();let reader:ReadableStreamDefaultReader<Uint8Array>|undefined,responseBody:ReadableStream<Uint8Array>|null|undefined,timer:ReturnType<typeof setTimeout>|undefined
  const malformed=()=>new MailError(send?'provider_send_unknown':'provider_response_invalid',send?503:502)
  async function read(response:Response){
   if(Number(response.headers.get('content-length'))>MAX_RESPONSE)throw malformed()
   reader=response.body?.getReader();if(!reader)throw malformed()
   let size=0;const parts:Uint8Array[]=[]
   while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_RESPONSE){void reader.cancel().catch(()=>{});throw malformed()}parts.push(value)}
   try{return JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(Buffer.concat(parts,size))) as unknown}catch{throw malformed()}
  }
  async function run(){
   const headers:Record<string,string>={Authorization:'Bearer '+apiKey,Accept:'application/json'}
   if(send){headers['Content-Type']='application/json';headers['Idempotency-Key']=key!}
   const response=await fetchImpl('https://api.resend.com'+path,{method:send?'POST':'GET',headers,body:send?JSON.stringify(payload):undefined,redirect:'error',cache:'no-store',signal:controller.signal})
   responseBody=response.body
   if(response.status===429){void response.body?.cancel().catch(()=>{});throw new MailError('provider_busy',503)}
   if(response.status>=500||response.status===408){void response.body?.cancel().catch(()=>{});throw new MailError(send?'provider_send_unknown':'provider_busy',503)}
   if(send&&response.status===409){
    const body=await read(response)
    const name=body&&typeof body==='object'&&!Array.isArray(body)?(body as Record<string,unknown>).name:null
    throw new MailError(name==='concurrent_idempotent_requests'?'provider_busy':'provider_send_conflict',name==='concurrent_idempotent_requests'?503:409)
   }
   if(response.status>=400){void response.body?.cancel().catch(()=>{});throw new MailError(send?'provider_send_rejected':'provider_response_invalid',send?400:502)}
   if(!response.ok||response.redirected||!response.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw malformed()
   return read(response)
  }
  try{return await Promise.race([run(),new Promise<never>((_resolve,reject)=>{timer=setTimeout(()=>{controller.abort();void reader?.cancel().catch(()=>{});reject(new MailError(send?'provider_send_unknown':'provider_busy',503))},10000)})])}
  catch(error){if(error instanceof MailError)throw error;throw new MailError(send?'provider_send_unknown':'provider_busy',503)}
  finally{clearTimeout(timer);controller.abort();if(reader){void reader.cancel().catch(()=>{});try{reader.releaseLock()}catch{}}else{void responseBody?.cancel().catch(()=>{})}}
 }
 return {
  async domain(){const d=await request('/domains/02bbff77-bf27-4ebc-a7f0-86b1e2679c13',false) as Record<string,unknown>;if(d?.id!=='02bbff77-bf27-4ebc-a7f0-86b1e2679c13'||d.name!=='agynexa.si')throw new MailError('provider_response_invalid',502);const inbox=await request('/inboxes/'+NEXA_RESEND_INBOX_ID,false) as Record<string,unknown>;if(inbox?.id!==NEXA_RESEND_INBOX_ID||inbox.email_address!==NEXA_IDENTITY.address||inbox.from_name!==NEXA_IDENTITY.displayName||inbox.receiving_address!=='b24184f6@iejioorkau.resend.app')throw new MailError('provider_response_invalid',502);return {status:d.status==='verified'?'verified':'pending',accountMatched:true}},
  async receive(emailId:string){if(!UUID.test(emailId))throw new MailError('provider_response_invalid',502);return request('/emails/receiving/'+emailId+'?html_format=cid',false)},
  async receiveInbox(threadId:string,emailId:string){if(!UUID.test(threadId)||!UUID.test(emailId))throw new MailError('provider_response_invalid',502);return request('/inboxes/'+NEXA_RESEND_INBOX_ID+'/threads/'+threadId+'/emails/'+emailId,false)},
  async send(payload:SendPayload,idempotencyKey:string){
   if(!/^[\x21-\x7e]{1,240}$/.test(idempotencyKey)||payload.from!==`${NEXA_IDENTITY.displayName} <${NEXA_IDENTITY.address}>`)throw new MailError('provider_send_rejected',400)
   const reply=inboxReplyContext(payload.inboxReply),base='/inboxes/'+NEXA_RESEND_INBOX_ID+'/threads/'+reply.threadId+'/emails/'+reply.emailId
   // The original Inbox message is immutable. Bind the provider's effective recipients to the reviewed To.
   // A mutable provider draft is never read, edited, created or sent by this dispatch path.
   let parent
   try{parent=normalizeInboxEmail(await request(base,false),reply.emailId,'b24184f6@iejioorkau.resend.app')}
   catch(error){if(error instanceof MailError&&error.code==='provider_busy')throw error;throw new MailError('provider_send_conflict',409)}
   const recipients=parent.reply_to?.length?parent.reply_to:[parent.from_address]
   if(parent.message_id!==reply.parentMessageId||JSON.stringify(recipients)!==JSON.stringify(payload.to))throw new MailError('provider_send_conflict',409)
   const data=await request(base+'/reply',true,{text:payload.text,subject:payload.subject,cc:payload.cc,bcc:payload.bcc},idempotencyKey)
   if(!data||typeof data!=='object'||Array.isArray(data)||typeof (data as Record<string,unknown>).id!=='string'||!UUID.test((data as Record<string,unknown>).id as string))throw new MailError('provider_send_unknown',503)
   return {id:(data as {id:string}).id}
  },
 }
}
