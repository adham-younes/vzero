import 'server-only'
import {mailAdmin} from './admin'
import {mailCapabilities,NEXA_IDENTITY} from './config'
import {MailError} from './errors'
import {cursorIn,cursorOut} from './store'
import type {MailActivityItem,MailFeedKind} from './activity-contract'
const auditFields='id,action,object_id,actor_id,metadata,created_at'
const messageFields='id,thread_id,direction,created_at,subject:payload->>subject,sender:from_address,recipients:payload->to'
function safeMetadata(value:unknown){const result:Record<string,string|number|null>={};if(!value||typeof value!=='object'||Array.isArray(value))return result;for(const key of ['event_id','version','snapshot_hash','draft_id','provider_id','error_code']){const v=(value as Record<string,unknown>)[key];if(v===null||typeof v==='number'&&Number.isFinite(v))result[key]=v;else if(typeof v==='string')result[key]=v.slice(0,256)}return result}
export async function activityFeed(request:Request){
 const {db}=await mailAdmin(),params=new URL(request.url).searchParams,kind=(params.get('kind')||'audit') as MailFeedKind
 if(!['audit','received','sent'].includes(kind)||[...params.keys()].some(k=>!['kind','before','after'].includes(k))||params.has('before')&&params.has('after'))throw new MailError('invalid_input',400)
 const forward=params.has('after'),cursor=cursorIn(params.get(forward?'after':'before'))
 let query=kind==='audit'?db.from('nexa_mail_audit_feed').select(auditFields):db.from('nexa_mail_messages').select(messageFields).eq('inbox',NEXA_IDENTITY.address).eq('direction',kind==='sent'?'outbound':'inbound')
 if(cursor){const op=forward?'gt':'lt';query=query.or(`created_at.${op}.${cursor.time},and(created_at.eq.${cursor.time},id.${op}.${cursor.id})`)}
 const {data,error}=await query.order('created_at',{ascending:forward}).order('id',{ascending:forward}).limit(26)
 if(error)throw new MailError('mail_unavailable',503)
 const raw=(data||[]) as unknown as Record<string,any>[],rows=raw.slice(0,25),last=rows.at(-1),first=rows[0]
 const items:MailActivityItem[]=rows.map(row=>kind==='audit'?{id:row.id,createdAt:row.created_at,kind:String(row.action).slice(0,80),objectId:row.object_id,actorId:row.actor_id,threadId:null,subject:'',sender:'',recipients:[],metadata:safeMetadata(row.metadata)}:{id:row.id,createdAt:row.created_at,kind,objectId:row.id,actorId:null,threadId:row.thread_id,subject:String(row.subject||'').slice(0,1024),sender:String(row.sender||'').slice(0,254),recipients:Array.isArray(row.recipients)?row.recipients.filter((v:unknown)=>typeof v==='string').slice(0,32).map((v:string)=>v.slice(0,254)):[],metadata:{}})
 return {kind,items:forward?items.reverse():items,hasMore:raw.length>25,nextCursor:last?cursorOut([last],'created_at'):null,latestCursor:(forward?last:first)?cursorOut([forward?last!:first!],'created_at'):null,identity:NEXA_IDENTITY,capabilities:mailCapabilities()}
}
