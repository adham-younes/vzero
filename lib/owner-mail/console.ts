import 'server-only'
import {headers} from 'next/headers'
import {isMailConsoleHost} from './host'
import PostalMime from 'postal-mime'
import {adminClient} from '@/lib/supabase/server'
import {MailError} from '@/lib/nexa-email/errors'
import {MAILBOXES,UUID} from './policy'
import {digest} from './io'
import {processManualReply} from './service'

export type MailActor={id:string;kind:'owner'|'chatgpt'}
type Row=Record<string,unknown>
const baseColumns='id,inbox,source,direction,folder,subject,sender,recipients,message_at,preview,attachment_count,reply_state,review_reason'
export async function requireConsole(){if(!isMailConsoleHost((await headers()).get('host')))throw new MailError('not_found',404)}
export function mailId(value:unknown){if(typeof value!=='string'||!value.length||value.length>220||!/^[a-zA-Z0-9@._:-]+$/.test(value))throw new MailError('invalid_input',400);return value}
function text(value:unknown,max:number,min=1){if(typeof value!=='string'||value.trim().length<min||value.length>max)throw new MailError('invalid_input',400);return value.trim()}
export async function audit(actor:MailActor,action:string,id:string){const {error}=await adminClient().from('owner_mail_console_audit').insert({actor:actor.id,action:actor.kind+':'+action,resource_id:id});if(error)throw new MailError('mail_audit_unavailable',503)}
export async function listMail(input:{inbox?:string;status?:string;q?:string;cursor?:string}={}){
 const db=adminClient();let query=db.from('owner_mail_console_messages').select(baseColumns).order('message_at',{ascending:false}).order('id',{ascending:false}).limit(51)
 if(input.inbox){if(!MAILBOXES.some(m=>m.address===input.inbox))throw new MailError('invalid_input',400);query=query.eq('inbox',input.inbox)}
 const states:Record<string,string[]>={review:['review'],replied:['sent'],sent:['sent'],pending:['pending'],historical:['historical']}
 if(input.status&&input.status!=='all'&&input.status!=='inbox'){
  if(!states[input.status])throw new MailError('invalid_input',400)
  query=query.in('reply_state',states[input.status])
 }
 if(input.q){const term=text(input.q,200).replace(/[^\p{L}\p{N}\s@._-]/gu,' ').trim();if(term)query=query.or(`subject.ilike.%${term}%,sender.ilike.%${term}%,preview.ilike.%${term}%`)}
 if(input.cursor){
  try{const c=JSON.parse(Buffer.from(input.cursor,'base64url').toString());if(typeof c.at!=='string'||new Date(c.at).toISOString()!==c.at)throw Error();mailId(c.id);query=query.or(`message_at.lt.${c.at},and(message_at.eq.${c.at},id.lt.${c.id})`)}catch{throw new MailError('invalid_cursor',400)}
 }
 const {data,error}=await query;if(error)throw new MailError('mail_unavailable',503)
 const rows=data||[],items=rows.slice(0,50).map(r=>({...r,text_body:r.preview})),last=items.at(-1)
 return {items,nextCursor:rows.length>50&&last?Buffer.from(JSON.stringify({at:new Date(String(last.message_at)).toISOString(),id:last.id})).toString('base64url'):null}
}
async function rawMail(id:string){
 const {data,error}=await adminClient().from('owner_mail_archive').select('*').eq('id',mailId(id)).maybeSingle()
 if(error)throw new MailError('mail_unavailable',503);if(!data||!MAILBOXES.some(m=>m.address===data.inbox))throw new MailError('mail_not_found',404)
 return data
}
export async function readMail(id:string){
 const db=adminClient(),row=await rawMail(id)
 const {data:job,error}=await db.from('owner_mail_jobs').select('id,state,reason,handling_mode,policy_reason,thread_id,inbox_id').eq('id',row.id).maybeSingle()
 if(error)throw new MailError('mail_unavailable',503)
 let history:Row[]=[]
 if(job?.thread_id){
  const related=await db.from('owner_mail_jobs').select('id').eq('inbox_id',job.inbox_id).eq('thread_id',job.thread_id).order('created_at',{ascending:true}).limit(30)
  if(related.error)throw new MailError('mail_unavailable',503)
  const ids=(related.data||[]).map(r=>r.id)
  if(ids.length){const found=await db.from('owner_mail_archive').select('id,inbox,subject,sender,text_body,message_at,direction').in('id',ids).order('message_at',{ascending:true});if(found.error)throw new MailError('mail_unavailable',503);history=found.data||[]}
 }
 const {object_path:_,sha256:__,...safe}=row
 return {message:{...safe,reply_state:job?.state||'historical',review_reason:job?.policy_reason||job?.reason||null,attachment_count:Array.isArray(row.attachments)?row.attachments.length:0,attachments:(row.attachments||[]).map((a:Row,index:number)=>({index,filename:String(a.filename||'attachment'),size:a.size??null}))},job,history}
}
export async function replyMail(id:string,reply:string,requestId:string,actor:MailActor){
 if(!UUID.test(requestId))throw new MailError('invalid_input',400)
 const row=await rawMail(id)
 if(row.source!=='resend'||row.direction!=='inbound')throw new MailError('historical_reply_unavailable',409)
 await audit(actor,'reply_requested',row.id)
 return processManualReply(adminClient(),actor.id,row.id,text(reply,5800))
}
export async function holdMail(id:string,mode:unknown,actor:MailActor){
 const row=await rawMail(id);if(row.direction!=='inbound'||row.source!=='resend')throw new MailError('historical_reply_unavailable',409)
 if(mode!=='manual'&&mode!=='auto')throw new MailError('invalid_input',400)
 // Holding never starts a provider call. An active send/lease is not interrupted.
 if(mode==='manual'){
  const db=adminClient(),current=await db.from('owner_mail_jobs').select('state,reason').eq('id',row.id).maybeSingle()
  const job=current.data
  if(current.error||!job||!(['pending','review'].includes(job.state)||job.state==='skipped'&&job.reason==='automatic_replies_disabled'))throw new MailError('mail_claim_conflict',409)
  let update=db.from('owner_mail_jobs').update({handling_mode:'manual',handler_actor:actor.id,state:job.state==='skipped'?'pending':job.state}).eq('id',row.id).eq('state',job.state).is('first_send_at',null).or('lease_until.is.null,lease_until.lt.'+new Date().toISOString())
  if(job.state==='skipped')update=update.eq('reason','automatic_replies_disabled')
  const {data,error}=await update.select('id').maybeSingle()
  if(error||!data)throw new MailError('mail_claim_conflict',409)
 }else{
  const {data,error}=await adminClient().rpc('owner_mail_release_manual',{p_id:row.id,p_actor:actor.id})
  if(error||data!==true)throw new MailError('mail_claim_conflict',409)
 }
 await audit(actor,'hold_'+mode,row.id);return {ok:true}
}
export async function listKnowledge(){
 const {data,error}=await adminClient().from('owner_mail_knowledge').select('id,title,content,kind,visibility,active,source_label,approved_at,created_at,updated_at').order('updated_at',{ascending:false}).limit(200)
 if(error)throw new MailError('mail_knowledge_unavailable',503);return {items:data||[]}
}
export async function saveKnowledge(id:string|null,body:Record<string,unknown>,actor:MailActor){
 const allowed=['title','content','kind','visibility','active','source_label'];if(Object.keys(body).some(k=>!allowed.includes(k)))throw new MailError('invalid_input',400)
 const row:Record<string,unknown>={updated_by:actor.id,updated_at:new Date().toISOString()}
 if(!id||body.title!==undefined)row.title=text(body.title,160)
 if(!id||body.content!==undefined)row.content=text(body.content,8000)
 if(!id||body.kind!==undefined){if(!['identity','project','goal','reference'].includes(String(body.kind)))throw new MailError('invalid_input',400);row.kind=body.kind}
 if(!id||body.visibility!==undefined){if(!['public_reply','owner_private'].includes(String(body.visibility)))throw new MailError('invalid_input',400);row.visibility=body.visibility}
 if(body.active!==undefined){if(typeof body.active!=='boolean')throw new MailError('invalid_input',400);row.active=body.active}
 if(!id||body.source_label!==undefined)row.source_label=text(body.source_label||'Owner supplied',200)
 if(id){if(!UUID.test(id))throw new MailError('invalid_input',400);const old=await adminClient().from('owner_mail_knowledge').select('visibility').eq('id',id).single();if(old.error)throw new MailError('mail_not_found',404);if((row.visibility||old.data.visibility)==='public_reply')row.approved_at=new Date().toISOString()}
 else {row.active=body.active??true;row.approved_at=body.visibility==='public_reply'?new Date().toISOString():null}
 if(row.visibility==='owner_private')row.approved_at=null
 const query=id?adminClient().from('owner_mail_knowledge').update(row).eq('id',id):adminClient().from('owner_mail_knowledge').insert(row)
 const {data,error}=await query.select('id').single();if(error)throw new MailError('mail_knowledge_unavailable',503)
 await audit(actor,'knowledge_saved',data.id);return {id:data.id}
}
export async function disableKnowledge(id:string,actor:MailActor){if(!UUID.test(id))throw new MailError('invalid_input',400);const {error}=await adminClient().from('owner_mail_knowledge').update({active:false,updated_by:actor.id,updated_at:new Date().toISOString()}).eq('id',id);if(error)throw new MailError('mail_knowledge_unavailable',503);await audit(actor,'knowledge_disabled',id);return {ok:true}}
async function storedObject(path:string,expected?:string){
 const {data,error}=await adminClient().storage.from('owner-mail').download(path)
 if(error||!data||data.size>50*1024*1024)throw new MailError('mail_download_unavailable',503)
 const binary=Buffer.from(await data.arrayBuffer());if(expected&&digest(binary)!==expected)throw new MailError('mail_archive_conflict',409);return binary
}
export async function downloadMail(id:string,attachment:string|null){
 const row=await rawMail(id);let data:Buffer,name:string,type='application/octet-stream'
 if(attachment===null||attachment==='original'){
  data=await storedObject(row.object_path,row.sha256);name='message.'+row.format;type=row.format==='eml'?'message/rfc822':'application/json'
 }else{
  if(!/^\d{1,3}$/.test(attachment))throw new MailError('invalid_input',400)
  const index=Number(attachment),meta=row.attachments?.[index];if(!meta)throw new MailError('mail_not_found',404)
  name=String(meta.filename||'attachment')
  if(row.format==='eml'){
   const original=await storedObject(row.object_path,row.sha256)
   const parsed=await PostalMime.parse(original,{maxNestingDepth:20,maxHeadersSize:262144,maxPartCount:500,maxRfc822NestingDepth:5})
   // MIME parsers may include different inline parts. Never use positional indexes
   // from the imported manifest to select a differently parsed attachment list.
   const matches=parsed.attachments.filter(part=>(part.filename||'attachment')===name&&(meta.size===null||meta.size===undefined||(typeof part.content==='string'?Buffer.byteLength(part.content):part.content.byteLength)===meta.size))
   if(matches.length!==1)throw new MailError('mail_attachment_ambiguous',409)
   const part=matches[0]
   data=typeof part.content==='string'?Buffer.from(part.content):Buffer.from(part.content);name=part.filename||name
  }else{if(typeof meta.path!=='string'||!meta.path.startsWith(row.inbox+'/'))throw new MailError('mail_not_found',404);data=await storedObject(meta.path,meta.sha256)}
 }
 const filename=name.replace(/[\r\n\0/\\]/g,'_').slice(0,180)
 return new Response(new Uint8Array(data),{headers:{'Content-Type':type,'Content-Disposition':`attachment; filename="download"; filename*=UTF-8''${encodeURIComponent(filename)}`,'Content-Length':String(data.length),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}})
}
