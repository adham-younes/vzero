import 'server-only'
import {adminClient} from '../supabase/server'
import {InputError} from '../account-validation'
import type {ChatScope,TurnContext} from './chat-contract'
import {fitResponseItems} from './output-capacity'
import {boundTurns} from './conversation'
import {isRunContentVisible,sourceDependencies,storedRunFields,presentRun} from './history-visibility'
export function cursorDecode(value:string|null){if(!value)return null;try{const c=JSON.parse(Buffer.from(value,'base64url').toString());if(typeof c.time!=='string'||!/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(c.time)||typeof c.id!=='string'||!/^[0-9a-f-]{36}$/.test(c.id))throw 0;return c as {time:string;id:string}}catch{throw new InputError('invalid_cursor')}}
const cursor=(r:any)=>Buffer.from(JSON.stringify({time:r.created_at,id:r.id})).toString('base64url')
function scoped(scope:ChatScope){let q=adminClient().from('agent_runs').select(storedRunFields).eq('org_id',scope.orgId).eq('agent_id',scope.agentId).eq('access_kind',scope.accessKind);q=scope.actorId?q.eq('actor_id',scope.actorId):q.is('actor_id',null);return q}
export async function loadConversationContext(scope:ChatScope):Promise<TurnContext[]>{
 const {data,error}=await scoped(scope).eq('conversation_id',scope.conversationId).eq('status','succeeded').order('created_at',{ascending:false}).order('id',{ascending:false}).limit(30);if(error)throw error
 const turns:TurnContext[]=[]
 for(const r of data||[]){if(!(await isRunContentVisible(scope,r)).visible)continue;const parts=r.snapshot?.chat_v2?.response?.parts||[{kind:r.citations.length?'grounded':'missing_evidence',text:r.answer||'',basis:r.citations.length?'approved_sources':'suggestion',citations:r.citations}];if(!r.answer)continue;turns.push({runId:r.id,userText:r.question,assistantParts:parts,sourceDependencies:sourceDependencies(r)});if(turns.length>=6)break}
 return boundTurns(turns.reverse())
}
export async function readVisibleConversation(scope:ChatScope,before:string|null){
 const c=cursorDecode(before);let q=scoped(scope).eq('conversation_id',scope.conversationId).order('created_at',{ascending:false}).order('id',{ascending:false}).limit(31)
 if(c)q=q.or(`created_at.lt.${c.time},and(created_at.eq.${c.time},id.lt.${c.id})`)
 const {data,error}=await q;if(error)throw error
 const rows=(data||[]).slice(0,30).filter(r=>r.snapshot?.identity===scope.identity)
 const runs=await Promise.all(rows.map(r=>presentRun(scope,r,true)))
 const page=fitResponseItems(runs,{nextCursor:null},'runs')
 return {runs:page.items.reverse(),nextCursor:page.truncated||data&&data.length>30?cursor(rows[page.items.length-1]):null}
}
export async function listConversations(scope:Omit<ChatScope,'conversationId'>,after:string|null){
 // Database RPC groups scoped runs before paging; bounded summaries, no generated/private text.
 const c=cursorDecode(after)
 const {data,error}=await adminClient().rpc('studio_list_conversations',{p_org:scope.orgId,p_agent:scope.agentId,p_actor:scope.actorId,p_before:c?.time||null,p_before_id:c?.id||null});if(error)throw error
 const rows=(data||[]).slice(0,50)
 return {conversations:rows.map((r:any)=>({id:r.id,title:r.title,updatedAt:r.updated_at})),nextCursor:data?.length>50?Buffer.from(JSON.stringify({time:rows[49].updated_at,id:rows[49].id})).toString('base64url'):null}
}
