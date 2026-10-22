import 'server-only'
import {createHash} from 'node:crypto'
import {Resend} from 'resend'
import {MailError} from './errors'
import type {AttachmentMetadata,InboundMessage,VerifiedInbound} from './types'
import {NEXA_IDENTITY,NEXA_RESEND_INBOX_ID} from './types'

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const controls=/[\x00-\x1f\x7f]/
const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value)
const invalid=()=>new MailError('provider_response_invalid',502)
function bounded(value:unknown,max:number){if(typeof value!=='string'||Buffer.byteLength(value)>max||controls.test(value))throw invalid();return value}
function date(value:unknown){const s=bounded(value,64);if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(s)||!Number.isFinite(Date.parse(s)))throw invalid();return s}

/** A single bounded mailbox; display names and headers never grant authority. */
export function parseMailbox(value:string):{address:string;display:string}{
 if(typeof value!=='string'||Buffer.byteLength(value)>1024||controls.test(value))throw new MailError('invalid_mailbox',400)
 const input=value.trim(),match=/^([^<>]*)<([^<>]+)>$/.exec(input)
 let address=(match?match[2]:input).trim(),display=match?match[1].trim():''
 if(display.startsWith('"')&&display.endsWith('"'))display=display.slice(1,-1)
 if(Buffer.byteLength(display)>256||address.length>254||!/^[-!#$%&'*+/=?^_`{|}~A-Za-z0-9]+(?:\.[-!#$%&'*+/=?^_`{|}~A-Za-z0-9]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(address))throw new MailError('invalid_mailbox',400)
 const at=address.lastIndexOf('@');if(at>64)throw new MailError('invalid_mailbox',400)
 address=address.slice(0,at)+'@'+address.slice(at+1).toLowerCase()
 return {address,display}
}
function addresses(value:unknown,nullable=false){
 if(nullable&&value===null)return []
 if(!Array.isArray(value)||value.length>32)throw invalid()
 return value.map(item=>{try{return parseMailbox(item as string).address}catch{throw invalid()}})
}
/** One dedicated final recipient only; forwarding trace/header claims never authorize routing. */
function requireRecipient(recipients:string[],ingress:string){let target:string;try{target=parseMailbox(ingress).address}catch{throw invalid()}if(recipients.length!==1||recipients[0]!==target)throw new MailError('recipient_mismatch',400)}

async function rawBody(request:Request){
 const length=request.headers.get('content-length')
 if(length&&/^\d+$/.test(length)&&Number(length)>65536)throw new MailError('webhook_too_large',413)
 const reader=request.body?.getReader();if(!reader)throw new MailError('webhook_invalid',400)
 let timer:ReturnType<typeof setTimeout>|undefined
 const work=async()=>{let size=0;const parts:Uint8Array[]=[]
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>65536){void reader.cancel().catch(()=>{});throw new MailError('webhook_too_large',413)}parts.push(value)}
  const bytes=Buffer.concat(parts,size)
  try{return {bytes,text:new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes)}}catch{throw new MailError('webhook_invalid',400)}
 }
 try{return await Promise.race([work(),new Promise<never>((_resolve,reject)=>{timer=setTimeout(()=>{void reader.cancel().catch(()=>{});reject(new MailError('webhook_timeout',408))},5000)})])}
 catch(error){if(error instanceof MailError)throw error;throw new MailError('webhook_invalid',400)}
 finally{clearTimeout(timer);try{reader.releaseLock()}catch{}}
}
export async function readVerifiedInbound(request:Request,secret:string,ingressRecipient:string):Promise<VerifiedInbound|null>{
 const id=request.headers.get('svix-id')||'',timestamp=request.headers.get('svix-timestamp')||'',signature=request.headers.get('svix-signature')||''
 if(!/^[A-Za-z0-9_-]{1,200}$/.test(id)||!/^\d{1,12}$/.test(timestamp)||signature.length>2048||!/^v\d+,[A-Za-z0-9+/]+={0,2}(?: v\d+,[A-Za-z0-9+/]+={0,2})*$/.test(signature)||!secret)throw new MailError('webhook_invalid',400)
 const raw=await rawBody(request)
 let event:unknown
 try{
  // Verification is local: this instance never makes an API request or reads a key.
  event=new Resend('webhook-verification-only').webhooks.verify({payload:raw.text,headers:{id,timestamp,signature},webhookSecret:secret})
 }catch{throw new MailError('webhook_invalid',400)}
 try{
  if(!object(event)||typeof event.type!=='string'||! /^[a-z][a-z0-9_.]{0,79}$/.test(event.type)||!object(event.data))throw invalid()
  const created_at=date(event.created_at)
  if(event.type==='inbox.email.received'){
   const d=event.data
   if(d.source!=='system'||d.inbox_id!==NEXA_RESEND_INBOX_ID||typeof d.thread_id!=='string'||!UUID.test(d.thread_id)||typeof d.email_id!=='string'||!UUID.test(d.email_id)||!object(d.email)||d.email.id!==d.email_id||d.email.direction!=='inbound')throw invalid()
   if(d.thread!==undefined&&(!object(d.thread)||d.thread.id!==d.thread_id))throw invalid()
   const recipients=addresses(d.email.to);requireInboxRecipient(recipients,ingressRecipient)
   return {event_id:id,email_id:d.email_id,payload_hash:createHash('sha256').update(raw.bytes).digest('hex'),recipients,created_at,transport:'inbox',inbox_id:NEXA_RESEND_INBOX_ID,thread_id:d.thread_id}
  }
  if(event.type!=='email.received')return null
  if(typeof event.data.email_id!=='string'||!UUID.test(event.data.email_id))throw invalid()
  const recipients=addresses(event.data.to);requireRecipient(recipients,ingressRecipient)
  return {event_id:id,email_id:event.data.email_id,payload_hash:createHash('sha256').update(raw.bytes).digest('hex'),recipients,created_at}
 }catch(error){if(error instanceof MailError&&error.code==='recipient_mismatch')throw error;throw new MailError('webhook_invalid',400)}
}
// Inbox routing is bound to the signed, fixed provider resource and its scoped fetch path.
// Its API may report the canonical delivered address instead of the technical forwarding address.
function requireInboxRecipient(recipients:string[],ingress:string){if(recipients.length!==1||![ingress,NEXA_IDENTITY.address].includes(recipients[0]))throw new MailError('recipient_mismatch',400)}
export function normalizeInboxEmail(raw:unknown,expectedEmailId:string,ingress:string):InboundMessage{
 try{
  if(!object(raw)||raw.id!==expectedEmailId||raw.direction!=='inbound')throw invalid()
  const to=addresses(raw.to);requireInboxRecipient(to,ingress)
  const message=normalizeReceivedEmail({...raw,object:'email',subject:raw.subject===null?'':raw.subject,created_at:raw.received_at,headers:null,attachments:[]},expectedEmailId,to[0])
  message.reply_to=addresses(raw.reply_to,true)
  if(!Array.isArray(raw.attachments)||raw.attachments.length>32)throw invalid()
  message.attachments=raw.attachments.map(a=>{
   if(!object(a)||a.size!==null&&(!Number.isSafeInteger(a.size)||Number(a.size)<0))throw invalid()
   return {id:bounded(a.id,128),filename:a.filename===null?null:bounded(a.filename,1024),content_type:null,size:a.size===null?null:Number(a.size)}
  })
  return message
 }catch(error){if(error instanceof MailError&&error.code==='recipient_mismatch')throw error;throw invalid()}
}
function messageId(value:unknown):string|null{
 if(value===null||value===undefined||value==='')return null
 const s=bounded(value,512).trim()
 return /^<[^\s<>@]+@[^\s<>@]+>$/.test(s)?s:null
}
function references(raw:unknown){
 if(raw===undefined||raw===null||raw==='')return []
 const s=bounded(raw,8192).trim(),tokens=s.split(/ +/)
 if(tokens.length>32)throw invalid()
 return [...new Set(tokens.map(item=>{const id=messageId(item);if(!id)throw invalid();return id}))]
}
function attachment(raw:unknown):AttachmentMetadata{
 if(!object(raw)||!Number.isSafeInteger(raw.size)||Number(raw.size)<0)throw invalid()
 return {id:bounded(raw.id,128),filename:raw.filename===null?null:bounded(raw.filename,1024),content_type:bounded(raw.content_type,128),size:Number(raw.size)}
}
export function normalizeReceivedEmail(raw:unknown,expectedEmailId:string,ingressRecipient:string):InboundMessage{
 try{
  if(!UUID.test(expectedEmailId)||!object(raw)||raw.object!=='email'||raw.id!==expectedEmailId)throw invalid()
  const to=addresses(raw.to);requireRecipient(to,ingressRecipient)
  const from=parseMailbox(raw.from as string),cc=addresses(raw.cc,true)
  const headers:Record<string,unknown>={}
  if(raw.headers!==null){if(!object(raw.headers)||Object.keys(raw.headers).length>100)throw invalid();for(const [name,value] of Object.entries(raw.headers)){const key=bounded(name,128).toLowerCase();if(['in-reply-to','references'].includes(key)){if(Object.hasOwn(headers,key))throw invalid();headers[key]=bounded(value,8192)}}}
  // PostgreSQL cannot persist NUL; reject the original instead of silently altering it.
  if(raw.text!==null&&(typeof raw.text!=='string'||raw.text.includes('\0')))throw invalid()
  const text_available=raw.text!==null,bytes=Buffer.from(raw.text??''),original_text_bytes=bytes.length
  let end=Math.min(bytes.length,262144);if(end<bytes.length)while(end>0&&(bytes[end]&0xc0)===0x80)end--
  if(!Array.isArray(raw.attachments)||raw.attachments.length>32)throw invalid()
  return {provider_email_id:expectedEmailId,from_address:from.address,from_display:from.display,to,cc,subject:bounded(raw.subject,1024),text:bytes.subarray(0,end).toString('utf8'),text_available,text_truncated:bytes.length>262144,original_text_bytes,message_id:messageId(raw.message_id),in_reply_to:messageId(headers['in-reply-to']),references:references(headers.references),attachments:raw.attachments.map(attachment),provider_created_at:date(raw.created_at)}
 }catch(error){if(error instanceof MailError&&error.code==='recipient_mismatch')throw error;throw invalid()}
}
