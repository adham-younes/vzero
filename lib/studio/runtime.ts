import 'server-only'
import {createHash,randomUUID} from 'node:crypto'
import {adminClient} from '@/lib/supabase/server'
import {InputError,field} from '@/lib/account-validation'
import {agentId} from './validation'
import {studioSession,ownerWorkspace} from './server'
import {groqAnswer,numberSetting,type GroundedAnswer} from './provider'
import {modelRegistry,type ModelId} from './models'
import type {Agent} from './settings'
import {customerChatEnabled,normalizedSearchEnabled,validateChatResponse,type ChatScope,type RawProviderChatV2} from './chat-contract'
import {loadConversationContext} from './conversation-store'
import {assertOutputCapacity} from './output-capacity'
import {chatSystemPolicy} from './chat-policy'
import {customerTurn,customerLanguageReply} from './customer-behavior'
import {presentRun} from './history-visibility'
import {conversationalReply,missingKnowledgeReply,replyLanguage,buildRetrievalQuery} from './conversation'

export function hash(text:string){return createHash('sha256').update(text).digest('hex')}
export function dbError(error:{code?:string;message?:string}|null){
 if(!error)return
 const allowed=['request_conflict','revision_conflict','sources_required','public_sources_required','evaluation_model_only','sign_in_required','not_found','invalid_input','concurrency_limit']
 const code=allowed.find(x=>error.message?.includes(x))
 throw code?new InputError(code,code==='not_found'?404:code==='sign_in_required'?401:code==='concurrency_limit'?429:409):new Error('Database operation failed')
}
export async function ownedAgent(id:string){
 agentId(id);const session=await studioSession();const org=await ownerWorkspace(session);if(!org)throw new InputError('not_found',404)
 const {data,error}=await session.client.from('agents').select('*').eq('id',id).eq('org_id',org.id).maybeSingle();dbError(error);if(!data)throw new InputError('not_found',404)
 return {...session,agent:data as Agent}
}
export async function mutate(id:string,operation:string,payload:Record<string,unknown>){const ctx=await ownedAgent(id);const {data,error}=await ctx.client.rpc('studio_mutate',{agent:id,operation,payload});dbError(error);return data}
export async function evaluator(userId:string){const {data,error}=await adminClient().from('studio_evaluators').select('user_id').eq('user_id',userId).maybeSingle();dbError(error);return !!data}
export async function abuseLimit(bucket:string,limit=60){
 const {data,error}=await adminClient().rpc('consume_auth_limit',{bucket_key:hash('studio:'+bucket+':'+Math.floor(Date.now()/60000)),max_attempts:Math.min(100,limit)});dbError(error);if(!data)throw new InputError('try_later',429)
}
export type RunScope={agent:Agent;sourceIds:string[];versionId:string|null;kind:'studio'|'api'|'widget';identity:string;actorId:string|null;generation?:number;keyId?:string;assertAccess:()=>Promise<void>}
export async function draftScope(id:string,model?:string):Promise<RunScope>{
 const ctx=await ownedAgent(id);const a={...ctx.agent};if(model)a.model=model as ModelId
 if(!Object.hasOwn(modelRegistry,a.model))throw new InputError('unsupported_model')
 const {data,error}=await ctx.client.from('knowledge_sources').select('id').eq('agent_id',id).eq('status','ready');dbError(error)
 return {agent:a,sourceIds:(data||[]).map(x=>x.id),versionId:null,kind:'studio',actorId:ctx.user.id,identity:ctx.user.id,assertAccess:async()=>{await ownedAgent(id)}}
}
export type Citation={chunkId:string;sourceId:string;title:string;quote:string}
type Chunk={id:string;source_id:string;title:string;content:string;score:number}
export function groundedCitations(items:{chunkId:string}[],chunks:Chunk[]):Citation[]{
 return items.map(item=>{const chunk=chunks.find(c=>c.id===item.chunkId);if(!chunk)throw new InputError('invalid_citation',502);return {chunkId:chunk.id,sourceId:chunk.source_id,title:chunk.title,quote:chunk.content}})
}
export const publicRunFields='id,agent_id,conversation_id,model,status,question,answer,citations,usage,error_code,created_at,finished_at,version_id'
export function visibleRun(r:Record<string,unknown>){return Object.fromEntries(publicRunFields.split(',').map(k=>[k,r[k]]))}
export async function executeRun(scope:RunScope,body:Record<string,unknown>,request:Request){
 const allowed=scope.kind==='studio'?['message','requestKey','conversationId','runId','model']:['message','requestKey','conversationId']
 if(Object.keys(body).some(key=>!allowed.includes(key)))throw new InputError('invalid_input')
 const question=field(body.message,3000),requestKey=agentId(field(body.requestKey,36)),id=body.runId!==undefined?agentId(field(body.runId,36)):randomUUID(),conversation=body.conversationId!==undefined?agentId(field(body.conversationId,36)):requestKey
 const db=adminClient();await scope.assertAccess()
 await abuseLimit('global-runs',numberSetting('AGYNEXA_GLOBAL_RUNS_PER_MINUTE',100,1,100));await abuseLimit(scope.kind+':'+scope.identity,numberSetting('AGYNEXA_RUNS_PER_MINUTE',60,1,100))
 const chatScope:ChatScope={orgId:scope.agent.org_id,agentId:scope.agent.id,actorId:scope.actorId,accessKind:scope.kind,identity:scope.identity,conversationId:conversation,sourceIds:scope.sourceIds,versionId:scope.versionId,generation:scope.generation}
 const customer=scope.kind==='studio'&&scope.agent.chat_profile==='customer_v1'&&customerChatEnabled()
 const snapshot={...scope.agent,sourceIds:scope.sourceIds,identity:scope.identity,generation:scope.generation,keyId:scope.keyId}
 const fingerprint=hash(JSON.stringify({question,model:scope.agent.model,identity:scope.identity,version:scope.versionId,conversation}))
 let expectedHash=fingerprint
 const startPayload={run:{id,org_id:scope.agent.org_id,agent_id:scope.agent.id,actor_id:scope.actorId,conversation_id:conversation,access_kind:scope.kind,request_key:requestKey,input_hash:expectedHash,snapshot,model:scope.agent.model,version_id:scope.versionId,question},concurrency_limit:numberSetting('AGYNEXA_RUN_CONCURRENCY',6,1,20)}
 let started=await db.rpc('start_agent_run',startPayload)
 // Existing clients may replay an old baseline hash that included source/revision state.
 // Resolve only a genuine legacy collision, after exact scope/input binding; normal turns add no read.
 if(started.error?.message?.includes('request_conflict')){
  let lookup=db.from('agent_runs').select('*').eq('org_id',scope.agent.org_id).eq('agent_id',scope.agent.id).eq('access_kind',scope.kind).eq('request_key',requestKey).eq('conversation_id',conversation)
  lookup=scope.actorId?lookup.eq('actor_id',scope.actorId):lookup.is('actor_id',null)
  const {data:old,error:oldError}=await lookup.maybeSingle();dbError(oldError)
  if(old&&old.question===question&&old.model===scope.agent.model&&old.version_id===scope.versionId&&old.snapshot?.identity===scope.identity){
   const legacyHash=hash(JSON.stringify({question,model:old.model,identity:scope.identity,version:old.version_id,revision:old.snapshot.revision,sources:old.snapshot.sourceIds,conversation}))
   if(old.input_hash===legacyHash){expectedHash=legacyHash;startPayload.run.input_hash=legacyHash;started=await db.rpc('start_agent_run',startPayload)}
  }
 }
 dbError(started.error);const start=started.data
 if(start.existing){
  if(start.run.actor_id!==scope.actorId||start.run.conversation_id!==conversation||start.run.input_hash!==expectedHash||start.run.snapshot?.identity!==scope.identity)throw new InputError('request_conflict',409)
  return presentRun(chatScope,start.run,scope.kind==='studio')
 }
 // The request/hosting lifecycle and explicit cancellation govern execution. No artificial response delay/deadline.
 const cancel=new AbortController(),signal=AbortSignal.any([cancel.signal,request.signal]);let checking=false
 const timer=setInterval(async()=>{if(checking)return;checking=true;try{const {data,error}=await db.from('agent_runs').select('status').eq('id',id).eq('org_id',scope.agent.org_id).maybeSingle();if(error||!data||data.status!=='running')cancel.abort()}catch{cancel.abort()}finally{checking=false}},1500)
 let result:Record<string,unknown>,usage:Record<string,unknown>={}
 try{
  const turns=await loadConversationContext(chatScope)
  const behavior=customer?customerTurn(question,turns,scope.agent.language,scope.agent.name):null
  const effectiveQuestion=behavior?.effectiveQuestion||question
  const retrieval=buildRetrievalQuery(effectiveQuestion,turns)
  const normalized=normalizedSearchEnabled()
  const {data,error}=await db.rpc(normalized?'search_agent_knowledge_v2':'search_agent_knowledge',{workspace:scope.agent.org_id,agent:scope.agent.id,source_ids:scope.sourceIds,query:retrieval.query,...(normalized?{history_query:retrieval.historyQuery}:{})});dbError(error)
  let chunks=(data||[]) as Chunk[]
  if(retrieval.continuation&&turns.length){
   const priorIds=turns.at(-1)!.sourceDependencies.slice(0,2).map(d=>d.chunkId)
   if(priorIds.length){
    const prior=await db.from('knowledge_chunks').select('id,source_id,content').eq('org_id',scope.agent.org_id).eq('agent_id',scope.agent.id).in('source_id',scope.sourceIds).in('id',priorIds);dbError(prior.error)
    const extra=(prior.data||[]).map(c=>({...c,title:turns.at(-1)!.assistantParts.flatMap(p=>p.citations).find(x=>x.chunkId===c.id)?.title||'Approved source',score:0}))
    chunks=[...chunks.slice(0,4),...extra,...chunks.slice(4)].filter((c,i,a)=>a.findIndex(x=>x.id===c.id)===i).slice(0,6)
   }
  }
  const refusal=missingKnowledgeReply(question,scope.agent.language,scope.sourceIds.length>0,scope.kind==='studio')
  const social=customer?behavior!.localReply:conversationalReply(question,scope.agent)
  const dependencies=[...chunks.map(c=>({sourceId:c.source_id,chunkId:c.id,contentHash:hash(c.content)})),...turns.flatMap(t=>t.sourceDependencies)].filter((d,i,all)=>all.findIndex(x=>x.chunkId===d.chunkId&&x.sourceId===d.sourceId&&x.contentHash===d.contentHash)===i)
  if(social){
   const chat={schemaVersion:2,parts:[{kind:'capability',text:social,basis:'product_capabilities',citations:[]}],nextQuestion:null,briefDraft:null}
   result={status:'succeeded',answer:social,citations:[],usage:{input_tokens:0,output_tokens:0,estimated_cost_usd:0,response_kind:'conversation'},...(customer?{support:{propose:false,title:'',details:''},chat_v2:{schemaVersion:2,profile:'customer_v1',policyVersion:'2026-10-v1',response:chat,sourceDependencies:[]}}:{})}
  }
  else if(!customer&&!chunks.length)result={status:'succeeded',answer:refusal,citations:[],usage:{input_tokens:0,output_tokens:0,estimated_cost_usd:0,retrieval:'no_match'}}
  else{
   const canSupport=scope.kind==='studio'&&scope.agent.template==='serviceflow'
   const messages=[{role:'system' as const,content:chatSystemPolicy(scope.agent,scope.kind,effectiveQuestion,customer,canSupport,behavior?.language)},...turns.flatMap(t=>[{role:'user' as const,content:t.userText},...(behavior?.languageOnly?[]:[{role:'assistant' as const,content:t.assistantParts.map(p=>p.text).join('\n\n')}])]),{role:'user' as const,content:JSON.stringify({question:effectiveQuestion,passages:chunks.map(c=>({chunkId:c.id,text:c.content}))})}]
   const generate=(repair:boolean)=>groqAnswer(scope.agent.model,repair?[...messages,{role:'system' as const,content:`The previous attempt used the wrong language. Regenerate the same response in ${behavior!.language}, using only the current user facts and authorized passages. Do not add a task, sector or fact. Preserve the required JSON schema and citation constraints.`}]:messages,signal,chunks.map(c=>c.id),customer)
   const provider=customer?await customerLanguageReply(async repair=>{const value=await generate(repair);return {...value,answer:value.answer as RawProviderChatV2}},behavior!.language):await generate(false);usage=provider.usage
   if(customer){
    const raw=provider.answer as RawProviderChatV2,chat=validateChatResponse(raw,{customer:true,support:canSupport},chunks)
    const citations=chat.parts.flatMap(p=>p.citations).filter((c,i,a)=>a.findIndex(x=>x.chunkId===c.chunkId)===i)
    const metadata={schemaVersion:2,profile:'customer_v1',policyVersion:'2026-10-v1',response:chat,sourceDependencies:dependencies}
    result={status:'succeeded',answer:chat.parts.map(p=>p.text).join('\n\n')+(chat.nextQuestion?'\n\n'+chat.nextQuestion:''),citations,usage,support:raw.support,chat_v2:metadata}
   }else{
    const raw=provider.answer as GroundedAnswer;let citations=groundedCitations(raw.citations,chunks),answer=raw.answer
    if(!raw.answerable||!citations.length){answer=refusal;citations=[]}
    const support=canSupport&&raw.answerable&&citations.length?raw.support:{propose:false,title:'',details:''}
    const chat={schemaVersion:2,parts:[{kind:citations.length?'grounded':'missing_evidence',text:answer,basis:citations.length?'approved_sources':'suggestion',citations}],nextQuestion:null,briefDraft:null}
    result={status:'succeeded',answer,citations,usage,support,chat_v2:{schemaVersion:2,profile:'grounded_v1',policyVersion:'2026-10-v1',response:chat,sourceDependencies:dependencies}}
   }
  }
  if(result.status==='succeeded')assertOutputCapacity({run:{question,model:scope.agent.model,answer:result.answer,citations:result.citations,usage:result.usage,chat:scope.kind==='studio'?(result.chat_v2 as {response?:unknown}|undefined)?.response:undefined}})
  signal.throwIfAborted();await scope.assertAccess()
 }catch(error){result={status:signal.aborted?'cancelled':'failed',error_code:signal.aborted?'execution_cancelled':error instanceof InputError?error.code:'provider_unavailable',usage}}
 finally{clearInterval(timer)}
 const {data:finished,error:finishError}=await db.rpc('finish_agent_run',{run_id:id,result});dbError(finishError)
 return presentRun(chatScope,finished,scope.kind==='studio')
}
