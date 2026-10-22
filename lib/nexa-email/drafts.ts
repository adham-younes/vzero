import {createHash} from 'node:crypto'
import {NEXA_IDENTITY,NEXA_RESEND_INBOX_ID,type SendPayload,type InboxReply} from './types'
import {MailError} from './errors'
import {parseMailbox} from './inbound'
function fail():never{throw new MailError('invalid_mail_draft',400)}
export function inboxReplyContext(value:unknown):InboxReply{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new MailError('send_disabled',503)
 const r=value as Record<string,unknown>,uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
 if(Object.keys(r).some(k=>!['inboxId','threadId','emailId','parentMessageId'].includes(k))||r.inboxId!==NEXA_RESEND_INBOX_ID||typeof r.threadId!=='string'||!uuid.test(r.threadId)||typeof r.emailId!=='string'||!uuid.test(r.emailId)||r.parentMessageId!==null&&(typeof r.parentMessageId!=='string'||r.parentMessageId.length>512||!/^<[^\s<>@]+@[^\s<>@]+>$/.test(r.parentMessageId)))fail()
 return {inboxId:NEXA_RESEND_INBOX_ID,threadId:r.threadId,emailId:r.emailId,parentMessageId:r.parentMessageId as string|null}
}
export function prepareDraft(input:Record<string,unknown>,headers:Record<string,string>,inboxReply?:InboxReply){
 if(Object.keys(input).some(k=>!['to','cc','bcc','subject','text','threadId','replyToMessageId','requestKey','version'].includes(k)))fail()
 const addresses=(value:unknown,required=false)=>{
  if(value===undefined&&!required)return []
  if(!Array.isArray(value)||value.length>(required?10:10)||(required&&value.length===0))return fail()
  return value.map(v=>typeof v==='string'?parseMailbox(v).address:fail())
 }
 const to=addresses(input.to,true),cc=addresses(input.cc),bcc=addresses(input.bcc)
 const all=[...to,...cc,...bcc];if(new Set(all).size!==all.length||all.length>10)fail()
 if(typeof input.subject!=='string'||!input.subject.trim()||input.subject.length>1000||/[\r\n\0]/.test(input.subject))fail()
 if(typeof input.text!=='string'||!input.text.trim()||Buffer.byteLength(input.text,'utf8')>262144||input.text.includes('\0'))fail()
 if(Object.keys(headers).some(k=>!['In-Reply-To','References'].includes(k))||Object.values(headers).some(v=>v.length>4096||/[\r\n\0]/.test(v)))fail()
 const payload:SendPayload={from:`${NEXA_IDENTITY.displayName} <${NEXA_IDENTITY.address}>`,to,cc,bcc,subject:input.subject.trim(),text:input.text,headers}
 if(inboxReply)payload.inboxReply=inboxReplyContext(inboxReply)
 const hash=createHash('sha256').update(JSON.stringify(payload)).digest('hex')
 return {payload,hash}
}
