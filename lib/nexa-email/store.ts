import 'server-only'
import type {SupabaseClient} from '@supabase/supabase-js'
import type {MailThread,MailDraft,MailOutbox,MailMessage,SendPayload} from './types'
import {MailError} from './errors'
type Row=Record<string,any>
export async function mailRpc(db:SupabaseClient,name:string,args:Record<string,unknown>){const {data,error}=await db.rpc(name,args);if(error||!data||typeof data!=='object')throw new MailError('mail_unavailable',503);return data as Row}
export const threadFields='id,subject,external_sender,last_message_at,message_count,is_read,archived'
export const draftFields='id,thread_id,version,payload,snapshot_hash,approved_version,approved_hash,status,created_at,updated_at'
export const outboxFields='id,draft_id,draft_version,payload,snapshot_hash,status,provider_id,error_code,first_attempt_at,created_at,updated_at'
export function threadDto(r:Row):MailThread{return {id:r.id,subject:r.subject,external_sender:r.external_sender,last_message_at:r.last_message_at,message_count:r.message_count,is_read:r.is_read,archived:r.archived}}
export function draftDto(r:Row):MailDraft{return {id:r.id,thread_id:r.thread_id,version:r.version,payload:r.payload as SendPayload,snapshot_hash:r.snapshot_hash,approved_version:r.approved_version,approved_hash:r.approved_hash,status:r.status,created_at:r.created_at,updated_at:r.updated_at}}
export function outboxDto(r:Row):MailOutbox{return {id:r.id,draft_id:r.draft_id,draft_version:r.draft_version,payload:r.payload as SendPayload,snapshot_hash:r.snapshot_hash,status:r.status,provider_id:r.provider_id,error_code:r.error_code,first_attempt_at:r.first_attempt_at,created_at:r.created_at,updated_at:r.updated_at}}
export function messageDto(r:Row):MailMessage{return {...r.payload,id:r.id,thread_id:r.thread_id,created_at:r.created_at,direction:r.direction,sender_trust:r.direction==='outbound'?'nexa':'unverified'} as MailMessage}
export function stateResult(r:Row,ok:string[]){if(r.state==='not_found')throw new MailError('mail_not_found',404);if(r.state==='approval_required')throw new MailError('approval_required',409);if(!ok.includes(r.state))throw new MailError('draft_conflict',409);return r}
export function cursorIn(value:string|null){if(!value)return null;try{if(value.length>500)throw Error();const v=JSON.parse(Buffer.from(value,'base64url').toString('utf8'));if(typeof v.time!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|\+00:00)$/.test(v.time)||typeof v.id!=='string'||!/^[a-f0-9-]{36}$/i.test(v.id))throw Error();return v as {time:string;id:string}}catch{throw new MailError('invalid_cursor',400)}}
export function cursorOut(rows:Row[],field:string){const r=rows.at(-1);return r?Buffer.from(JSON.stringify({time:r[field],id:r.id})).toString('base64url'):null}
