import 'server-only'
import {adminClient} from '@/lib/supabase/server'
import {MailError} from '@/lib/nexa-email/errors'
import {SHA} from './policy'
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
