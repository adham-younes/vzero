import 'server-only'
import {adminClient} from '@/lib/supabase/server'
import {mailAdmin,mailMutation,exactKeys} from '@/lib/nexa-email/admin'
import {MailError} from '@/lib/nexa-email/errors'
import {MAILBOXES,SHA} from './policy'
import {bytes,digest,requireToken} from './io'
import {archive} from './service'
export async function importMail(request:Request){
 requireToken(request,'OWNER_MAIL_IMPORT_TOKEN')
 const until=Date.parse(process.env.OWNER_MAIL_IMPORT_UNTIL||'')
 if(!Number.isFinite(until)||Date.now()>until)throw new MailError('mail_import_closed',403)
 const db=adminClient()
 if(request.method==='GET'){
  const r=await db.from('owner_mail_archive').select('id,sha256,byte_count,folder').eq('source','spacemail').range(0,9999)
  if(r.error)throw new MailError('mail_archive_unavailable',503)
  return {messages:r.data}
 }
 let b
 try{b=JSON.parse((await bytes(request,2*1024*1024)).toString())}catch{throw new MailError('mail_import_invalid',400)}
 if(b.inbox!=='adham@agynexa.si'||typeof b.source_id!=='string'||b.source_id.length>2048||typeof b.raw!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(b.raw)||!SHA.test(b.sha256))throw new MailError('mail_import_invalid',400)
 const raw=Buffer.from(b.raw,'base64');if(digest(raw)!==b.sha256)throw new MailError('mail_import_hash_mismatch',400)
 for(const k of ['folder','subject','sender','text_body','message_at'])if(typeof b[k]!=='string'||b[k].includes('\0'))throw new MailError('mail_import_invalid',400)
 if(!Number.isFinite(Date.parse(b.message_at))||b.folder.length>256||b.subject.length>2000||b.sender.length>1024||b.text_body.length>262144||!Array.isArray(b.recipients)||b.recipients.some((v:unknown)=>typeof v!=='string'||v.length>1024)||!Array.isArray(b.attachments)||b.attachments.length>100)throw new MailError('mail_import_invalid',400)
 const id='spacemail:'+digest(b.source_id)
 return archive(db,{id,inbox:b.inbox,source:'spacemail',direction:'historical',folder:b.folder,subject:b.subject,sender:b.sender,recipients:b.recipients,message_at:b.message_at,text_body:b.text_body,format:'eml',attachments:b.attachments.map((a:{filename:unknown;size:unknown})=>({filename:String(a.filename||'').replace(/\0/g,'').slice(0,1000),size:Number.isSafeInteger(a.size)&&Number(a.size)>=0?Number(a.size):null}))},raw)
}
export async function getArchive(request:Request){
 const {db}=await mailAdmin(),url=new URL(request.url),id=url.searchParams.get('id')
 if(id){
  if(id.length>200)throw new MailError('mail_invalid_id',400)
  const r=await db.from('owner_mail_archive').select('*').eq('id',id).single()
  if(r.error||!r.data)throw new MailError('mail_not_found',404)
  if(url.searchParams.get('download')==='true'){
   let path=r.data.object_path,ext=r.data.format
   const attachment=url.searchParams.get('attachment')
   if(attachment!==null){const index=Number(attachment);if(!Number.isSafeInteger(index)||index<0||!r.data.attachments[index]?.path)throw new MailError('mail_not_found',404);path=r.data.attachments[index].path;ext='bin'}
   const b=await db.storage.from('owner-mail').download(path)
   if(b.error||!b.data)throw new MailError('mail_archive_unavailable',503)
   return new Response(b.data,{headers:{'Content-Type':'application/octet-stream','Content-Disposition':`attachment; filename="message-${digest(id).slice(0,12)}.${ext}"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'"}})
  }
  const {object_path:_,...message}=r.data
  const j=await db.from('owner_mail_jobs').select('state,reason,attempts,sent_id').eq('id',id).maybeSingle()
  return {message,job:j.data}
 }
 const inbox=url.searchParams.get('inbox')||MAILBOXES[0].address
 if(!MAILBOXES.some(m=>m.address===inbox))throw new MailError('mail_inbox_invalid',400)
 const page=Number(url.searchParams.get('page')||0)
 if(!Number.isSafeInteger(page)||page<0||page>10000)throw new MailError('mail_invalid_page',400)
 let q=db.from('owner_mail_archive').select('id,inbox,folder,direction,subject,sender,message_at,source,format',{count:'exact'}).eq('inbox',inbox)
 const folder=url.searchParams.get('folder');if(folder)q=q.eq('folder',folder.slice(0,256))
 const [messages,settings,jobs]=await Promise.all([q.order('message_at',{ascending:false}).order('id').range(page*50,page*50+49),db.from('owner_mail_settings').select('inbox,auto_reply'),db.from('owner_mail_jobs').select('id,state,reason,created_at').eq('inbox',inbox).in('state',['pending','review']).order('created_at',{ascending:false}).limit(20)])
 if(messages.error||settings.error||jobs.error)throw new MailError('mail_archive_unavailable',503)
 return {messages:messages.data,count:messages.count,page,settings:settings.data,attention:jobs.data}
}
export async function settings(request:Request){
 const {db}=await mailAdmin(),b=await mailMutation(request);exactKeys(b,['inbox','auto_reply'])
 if(!MAILBOXES.some(m=>m.address===b.inbox)||typeof b.auto_reply!=='boolean')throw new MailError('mail_invalid_setting',400)
 const r=await db.from('owner_mail_settings').update({auto_reply:b.auto_reply,updated_at:new Date().toISOString()}).eq('inbox',b.inbox).select('inbox,auto_reply').single()
 if(r.error)throw new MailError('mail_settings_unavailable',503)
 return r.data
}
