import 'server-only'
import {createHash} from 'node:crypto'
import {adminClient} from '../supabase/server'
import type {ChatScope,RunChatSnapshotV2,SourceDependency} from './chat-contract'
export type StoredRun=Record<string,any>
export const storedRunFields='id,org_id,agent_id,actor_id,access_kind,conversation_id,model,status,question,answer,citations,usage,error_code,created_at,finished_at,version_id,snapshot,retention_expires_at'
export const publicRunFields='id,agent_id,conversation_id,model,status,question,answer,citations,usage,error_code,created_at,finished_at,version_id'
const digest=(s:string)=>createHash('sha256').update(s).digest('hex')
export function runScope(run:StoredRun):ChatScope{return {orgId:run.org_id,agentId:run.agent_id,actorId:run.actor_id,accessKind:run.access_kind,conversationId:run.conversation_id,identity:run.snapshot?.identity,sourceIds:run.snapshot?.sourceIds,versionId:run.version_id,generation:run.snapshot?.generation}}
export function sourceDependencies(run:StoredRun):SourceDependency[]{
 const chat=run.snapshot?.chat_v2 as RunChatSnapshotV2|undefined
 if(chat)return Array.isArray(chat.sourceDependencies)?chat.sourceDependencies:[]
 return (run.citations||[]).map((c:any)=>({sourceId:c.sourceId,chunkId:c.chunkId,contentHash:digest(c.quote||'')}))
}
export async function isRunContentVisible(scope:ChatScope,run:StoredRun):Promise<{visible:boolean;reason?:'knowledge_changed'|'expired'}>{
 if(run.org_id!==scope.orgId||run.agent_id!==scope.agentId||run.actor_id!==scope.actorId||run.access_kind!==scope.accessKind||run.conversation_id!==scope.conversationId||run.snapshot?.identity!==scope.identity)return {visible:false,reason:'knowledge_changed'}
 if(run.retention_expires_at&&Date.parse(run.retention_expires_at)<=Date.now())return {visible:false,reason:'expired'}
 if(run.status!=='succeeded')return {visible:true}
 const db=adminClient(),deps=sourceDependencies(run),chat=run.snapshot?.chat_v2
 if(!chat&&!deps.length&&run.usage?.retrieval!=='no_match'&&run.usage?.response_kind!=='conversation')return {visible:false,reason:'knowledge_changed'}
 if(chat&&(!Array.isArray(chat.sourceDependencies)||chat.schemaVersion!==2))return {visible:false,reason:'knowledge_changed'}
 let allowed=scope.sourceIds
 if(scope.accessKind!=='studio'){
  const {data:p,error}=await db.from('agent_publications').select('active,version_id,generation,widget_enabled').eq('org_id',scope.orgId).eq('agent_id',scope.agentId).maybeSingle()
  if(error)throw error
  if(!p?.active||p.version_id!==scope.versionId||p.generation!==scope.generation||(scope.accessKind==='widget'&&!p.widget_enabled))return {visible:false,reason:'knowledge_changed'}
  const {data:v,error:ve}=await db.from('agent_versions').select('source_ids,public_source_ids').eq('org_id',scope.orgId).eq('agent_id',scope.agentId).eq('id',scope.versionId).single()
  if(ve)throw ve
  allowed=scope.accessKind==='widget'?v.public_source_ids:v.source_ids
 }
 if(!deps.length)return {visible:true}
 const {data:chunks,error}=await db.from('knowledge_chunks').select('id,source_id,content').eq('org_id',scope.orgId).eq('agent_id',scope.agentId).in('id',deps.map(d=>d.chunkId))
 if(error)throw error
 const {data:sources,error:se}=await db.from('knowledge_sources').select('id,public_approved').eq('org_id',scope.orgId).eq('agent_id',scope.agentId).eq('status','ready').in('id',deps.map(d=>d.sourceId))
 if(se)throw se
 const valid=deps.every(d=>{const c=chunks?.find(c=>c.id===d.chunkId&&c.source_id===d.sourceId),s=sources?.find(s=>s.id===d.sourceId);return c&&s&&digest(c.content)===d.contentHash&&(!allowed||allowed.includes(d.sourceId))&&(scope.accessKind!=='widget'||s.public_approved)})
 return valid?{visible:true}:{visible:false,reason:'knowledge_changed'}
}
export async function presentRun(scope:ChatScope,run:StoredRun,privateChat=false){
 const visibility=await isRunContentVisible(scope,run)
 const visible=Object.fromEntries(publicRunFields.split(',').map(k=>[k,run[k]]))
 if(run.status!=='succeeded'){visible.answer=null;visible.citations=[];if(privateChat)visible.historyState='available';return visible}
 if(!visibility.visible){visible.answer=run.snapshot?.language==='ar'?'لم تعد هذه الإجابة متاحة بعد تغيير المعرفة أو حذفها. أضف مصدرًا حاليًا وأعد السؤال.':'This answer is unavailable because its knowledge changed or was removed. Add current evidence and ask again.';visible.citations=[];visible.usage={};if(privateChat)visible.historyState=visibility.reason;return visible}
 if(privateChat){visible.historyState='available';if(run.snapshot?.chat_v2?.response)visible.chat=run.snapshot.chat_v2.response}
 return visible
}
