import 'server-only'
import {randomUUID} from 'node:crypto'
import {mailAdmin,mailMutation,exactKeys,uuid,versionHash} from './admin'
import {inboundConfig,mailConfig,mailCapabilities,NEXA_IDENTITY} from './config'
import {adminClient} from '@/lib/supabase/server'
import {MailError} from './errors'
import {readVerifiedInbound,normalizeReceivedEmail,normalizeInboxEmail} from './inbound'
import {createMailProvider} from './provider'
import {prepareDraft} from './drafts'
import {mailRpc,threadFields,draftFields,outboxFields,threadDto,draftDto,outboxDto,messageDto,stateResult,cursorIn,cursorOut} from './store'
import {NEXA_RESEND_INBOX_ID,type InboxReply,type MailOverview,type MailThreadDetail} from './types'
export async function webhook(request:Request){
 const c=inboundConfig(),event=await readVerifiedInbound(request,c.secret,c.ingress)
 if(!event)return {ok:true,ignored:true}
 if(event.transport!=='inbox')return {ok:true,ignored:true}
 const db=adminClient(),lease=randomUUID()
 const reserve=await mailRpc(db,'nexa_mail_reserve',{p_event:event.event_id,p_hash:event.payload_hash,p_email:event.email_id,p_lease:lease})
 if(reserve.state==='completed')return {ok:true,replayed:true}
 if(reserve.state==='conflict')throw new MailError('webhook_conflict',409)
 if(reserve.state!=='acquired')throw new MailError('webhook_busy',503)
 try{
  const provider=createMailProvider(c.apiKey)
  const raw=event.transport==='inbox'?await provider.receiveInbox(event.thread_id!,event.email_id):await provider.receive(event.email_id)
  const message=event.transport==='inbox'?normalizeInboxEmail(raw,event.email_id,c.ingress):normalizeReceivedEmail(raw,event.email_id,c.ingress)
  if(message.to.join('\n')!==event.recipients.join('\n'))throw new MailError('recipient_mismatch',400)
  message.provider_inbox_id=NEXA_RESEND_INBOX_ID;message.provider_thread_id=event.thread_id
  const result=await mailRpc(db,'nexa_mail_complete',{p_event:event.event_id,p_lease:lease,p_inbox:NEXA_IDENTITY.address,p_message:message})
  if(result.state!=='completed')throw new MailError('webhook_busy',503)
  return {ok:true}
 }catch(error){await Promise.resolve(db.rpc('nexa_mail_release',{p_event:event.event_id,p_lease:lease})).catch(()=>{});throw error}
}
export async function overview(request:Request):Promise<MailOverview>{
 const {db}=await mailAdmin(),url=new URL(request.url),folder=url.searchParams.get('folder')||'inbox'
 if(!['inbox','archive','drafts','outbox'].includes(folder))throw new MailError('invalid_input',400)
 const cursor=cursorIn(url.searchParams.get('cursor')),field=folder==='inbox'||folder==='archive'?'last_message_at':'created_at'
 let query=folder==='drafts'?db.from('nexa_mail_drafts').select(draftFields):folder==='outbox'?db.from('nexa_mail_outbox').select(outboxFields):db.from('nexa_mail_threads').select(threadFields).eq('inbox',NEXA_IDENTITY.address).eq('archived',folder==='archive')
 if(cursor)query=query.or(`${field}.lt.${cursor.time},and(${field}.eq.${cursor.time},id.lt.${cursor.id})`)
 const {data,error}=await query.order(field,{ascending:false}).order('id',{ascending:false}).limit(26)
 if(error)throw new MailError('mail_unavailable',503)
 const raw=data||[],hasMore=raw.length>25,rows=raw.slice(0,25)
 return {identity:NEXA_IDENTITY,capabilities:mailCapabilities(),...(url.searchParams.get('verifyProvider')==='true'?{providerDomain:await verifyProviderDomain()}:{}),folder,threads:folder==='inbox'||folder==='archive'?rows.map(threadDto):[],drafts:folder==='drafts'?rows.map(draftDto):[],outbox:folder==='outbox'?rows.map(outboxDto):[],hasMore,nextCursor:hasMore?cursorOut(rows,field):null}
}
export async function threadDetail(request:Request,id:string):Promise<MailThreadDetail>{
 const {db}=await mailAdmin();uuid(id)
 const {data:thread,error}=await db.from('nexa_mail_threads').select(threadFields).eq('id',id).eq('inbox',NEXA_IDENTITY.address).maybeSingle()
 if(error)throw new MailError('mail_unavailable',503);if(!thread)throw new MailError('mail_not_found',404)
 const cursor=cursorIn(new URL(request.url).searchParams.get('cursor'));let query=db.from('nexa_mail_messages').select('id,thread_id,payload,direction,created_at').eq('thread_id',id).eq('inbox',NEXA_IDENTITY.address)
 if(cursor)query=query.or(`created_at.lt.${cursor.time},and(created_at.eq.${cursor.time},id.lt.${cursor.id})`)
 const {data,error:messageError}=await query.order('created_at',{ascending:false}).order('id',{ascending:false}).limit(51)
 if(messageError)throw new MailError('mail_unavailable',503)
 const raw=data||[],hasMore=raw.length>50,rows=raw.slice(0,50)
 return {thread:threadDto(thread),messages:rows.map(messageDto).reverse(),hasMore,nextCursor:hasMore?cursorOut(rows,'created_at'):null}
}
export async function updateThread(request:Request,id:string){
 const {db,actor}=await mailAdmin();uuid(id);const body=await mailMutation(request);exactKeys(body,['isRead','archived'])
 if(!Object.keys(body).length||Object.values(body).some(v=>typeof v!=='boolean'))throw new MailError('invalid_input',400)
 const r=stateResult(await mailRpc(db,'nexa_mail_thread_state',{p_id:id,p_actor:actor,p_read:body.isRead??null,p_archived:body.archived??null}),['updated'])
 return {thread:threadDto(r.thread)}
}
export async function createDraft(request:Request){
 const {db,actor}=await mailAdmin(),body=await mailMutation(request);exactKeys(body,['requestKey','to','cc','bcc','subject','text','threadId','replyToMessageId']);const requestKey=uuid(body.requestKey),thread=body.threadId===undefined?null:uuid(body.threadId);let headers:Record<string,string>={},inboxReply:InboxReply|undefined
 if(thread&&body.replyToMessageId===undefined){const {data,error}=await db.from('nexa_mail_threads').select('id').eq('id',thread).eq('inbox',NEXA_IDENTITY.address).maybeSingle();if(error)throw new MailError('mail_unavailable',503);if(!data)throw new MailError('mail_not_found',404)}
 if(body.replyToMessageId!==undefined){
  if(!thread)throw new MailError('invalid_input',400)
  const {data,error}=await db.from('nexa_mail_messages').select('message_id,payload').eq('id',uuid(body.replyToMessageId)).eq('thread_id',thread).eq('inbox',NEXA_IDENTITY.address).maybeSingle()
  if(error)throw new MailError('mail_unavailable',503);if(!data)throw new MailError('mail_not_found',404)
  if(data.message_id){const refs=[...(data.payload.references||[]),data.message_id].slice(-20);headers={'In-Reply-To':data.message_id,References:[...new Set(refs)].join(' ')}}
  if(data.payload.provider_inbox_id===NEXA_RESEND_INBOX_ID)inboxReply={threadId:uuid(data.payload.provider_thread_id),emailId:uuid(data.payload.provider_email_id)}
 }
 const prepared=prepareDraft(body,headers,inboxReply),r=stateResult(await mailRpc(db,'nexa_mail_save_draft',{p_id:null,p_actor:actor,p_request:requestKey,p_version:0,p_hash:prepared.hash,p_payload:prepared.payload,p_thread:thread}),['saved'])
 return {draft:draftDto(r.draft)}
}
export async function editDraft(request:Request,id:string){
 const {db,actor}=await mailAdmin();uuid(id);const body=await mailMutation(request);exactKeys(body,['version','to','cc','bcc','subject','text']);if(!Number.isSafeInteger(body.version)||Number(body.version)<1)throw new MailError('invalid_input',400)
 const {data,error}=await db.from('nexa_mail_drafts').select('payload').eq('id',id).maybeSingle();if(error)throw new MailError('mail_unavailable',503);if(!data)throw new MailError('mail_not_found',404)
 const prepared=prepareDraft(body,data.payload.headers||{},data.payload.inboxReply),r=stateResult(await mailRpc(db,'nexa_mail_save_draft',{p_id:id,p_actor:actor,p_request:randomUUID(),p_version:body.version,p_hash:prepared.hash,p_payload:prepared.payload,p_thread:null}),['saved']);return {draft:draftDto(r.draft)}
}
export async function approveDraft(request:Request,id:string){
 const {db,actor}=await mailAdmin();uuid(id);const body=await mailMutation(request);exactKeys(body,['version','snapshotHash']);const v=versionHash(body)
 const r=stateResult(await mailRpc(db,'nexa_mail_approve',{p_id:id,p_actor:actor,p_version:v.version,p_hash:v.hash}),['approved']);return {draft:draftDto(r.draft)}
}
export async function queueDraft(request:Request,id:string){
 const {db,actor}=await mailAdmin();uuid(id);const body=await mailMutation(request);exactKeys(body,['version','snapshotHash','requestKey']);const v=versionHash(body)
 const r=stateResult(await mailRpc(db,'nexa_mail_queue',{p_id:id,p_actor:actor,p_version:v.version,p_hash:v.hash,p_request:uuid(body.requestKey)}),['queued']);return {outbox:outboxDto(r.outbox)}
}
export async function dispatch(request:Request,id:string){
 const {db,actor}=await mailAdmin();uuid(id);const body=await mailMutation(request);exactKeys(body,[])
 const c=mailConfig();if(!c.sendEnabled||!c.apiKey)throw new MailError('send_disabled',503)
 const {data:stored,error:storedError}=await db.from('nexa_mail_outbox').select('status,payload').eq('id',id).maybeSingle()
 if(storedError)throw new MailError('mail_unavailable',503);if(!stored)throw new MailError('mail_not_found',404)
 // Frozen historical intents keep their approved payload; never silently rename/send them.
 if(stored.status==='queued'&&stored.payload?.from!==`${NEXA_IDENTITY.displayName} <${NEXA_IDENTITY.address}>`)throw new MailError('draft_conflict',409)
 const attempt=randomUUID(),claim=await mailRpc(db,'nexa_mail_claim',{p_id:id,p_actor:actor,p_attempt:attempt})
 if(claim.state==='not_found')throw new MailError('mail_not_found',404)
 if(claim.state==='accepted'||claim.state==='rejected'||claim.state==='delivery_unknown')return {outbox:outboxDto(claim.outbox)}
 if(claim.state!=='claimed')throw new MailError('send_in_progress',409)
 const o=claim.outbox
 try{
  const result=await createMailProvider(c.apiKey).send(o.payload,'nexa-mail/'+o.id)
  const done=await mailRpc(db,'nexa_mail_finish',{p_id:id,p_actor:actor,p_attempt:attempt,p_status:'accepted',p_provider:result.id,p_error:null})
  if(done.state!=='accepted')throw new MailError('provider_send_unknown',503)
  return {outbox:outboxDto(done.outbox)}
 }catch(error){
  const code=error instanceof MailError?error.code:'provider_send_unknown'
  const status=code==='provider_busy'?'queued':['provider_send_rejected','provider_send_conflict'].includes(code)?'rejected':'delivery_unknown'
  await Promise.resolve(db.rpc('nexa_mail_finish',{p_id:id,p_actor:actor,p_attempt:attempt,p_status:status,p_provider:null,p_error:code})).catch(()=>{})
  throw error instanceof MailError?error:new MailError('provider_send_unknown',503)
 }
}

async function verifyProviderDomain(){try{return await createMailProvider(mailConfig().apiKey).domain()}catch{return {status:'unavailable' as const,accountMatched:false}}}
