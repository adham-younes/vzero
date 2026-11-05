import 'server-only'
import {setTimeout as delay} from 'node:timers/promises'
import {InputError} from '@/lib/account-validation'
import type {RawProviderChatV2} from './chat-contract'
import {modelRegistry,pricingDate,pricingSource,type ModelId} from './models'
import type {AgentTools} from './settings'

export function openAIKey(){const key=process.env.OPENAI_API_KEY?.trim();if(!key)throw new InputError('provider_not_configured',503);return key}
export function configuredModels(){return Object.entries(modelRegistry).map(([id,info])=>({id,...info,provider:'openai',configured:!!process.env.OPENAI_API_KEY?.trim(),availability:'not_checked',structuredWithTools:true,structuredWithStreaming:false}))}
export function numberSetting(name:string,fallback:number,min:number,max:number){const n=Number(process.env[name]);return Number.isFinite(n)&&n>=min&&n<=max?Math.floor(n):fallback}
export type GroundedAnswer={answerable:boolean;answer:string;citations:{chunkId:string}[];support:{propose:boolean;title:string;details:string}}
const object=(properties:Record<string,unknown>)=>({type:'object',additionalProperties:false,required:Object.keys(properties),properties})
const supportSchema=object({propose:{type:'boolean'},title:{type:'string'},details:{type:'string'}})
const schema=object({answerable:{type:'boolean'},answer:{type:'string'},citations:{type:'array',items:object({chunkId:{type:'string'}})},support:supportSchema})
const partSchema=(kinds:string[],citationIds?:string[])=>object({kind:{type:'string',enum:kinds},text:{type:'string'},...(citationIds?{citationChunkIds:{type:'array',minItems:1,items:{type:'string',enum:citationIds}}}:{})})
const chatSchema=(citationIds:string[])=>object({parts:{type:'array',items:{anyOf:[...(citationIds.length?[partSchema(['grounded'],citationIds)]:[]),partSchema(['capability']),partSchema(['discovery','draft']),partSchema(['missing_evidence','unavailable_action'])]}},nextQuestion:{type:['string','null']},briefDraft:{type:'null'},support:supportSchema})
export function parseAnswer(content:string):GroundedAnswer{
 let v:GroundedAnswer
 try{v=JSON.parse(content)}catch{throw new InputError('invalid_model_output',502)}
 if(!v||typeof v.answerable!=='boolean'||typeof v.answer!=='string'||!v.answer.trim()||!Array.isArray(v.citations)||v.citations.length>6||v.citations.some(c=>!c||typeof c.chunkId!=='string')||!v.support||typeof v.support.propose!=='boolean'||typeof v.support.title!=='string'||v.support.title.length>160||typeof v.support.details!=='string'||v.support.details.length>3000)throw new InputError('invalid_model_output',502)
 return v
}
// Request metadata is allowlisted. Raw provider errors, credentials and reasoning never reach the browser.
export async function openAIResponse(body:Record<string,unknown>,signal:AbortSignal,customerKey?:string|null){
 let response:Response|undefined
 for(let attempt=0;attempt<2;attempt++){
  response=await fetch('https://api.openai.com/v1/responses',{method:'POST',cache:'no-store',redirect:'error',signal,headers:{Authorization:`Bearer ${customerKey||openAIKey()}`,'Content-Type':'application/json'},body:JSON.stringify({...body,store:false})})
  if(response.status!==429)break
  const details=await response.clone().json().catch(()=>null)
  if(details?.error?.code==='insufficient_quota')throw new InputError('provider_billing',503)
  const retry=response.headers.get('retry-after'),seconds=retry===null?1:Number(retry)
  if(attempt||!Number.isFinite(seconds)||seconds<0||seconds>5)throw new InputError('provider_rate_limited',429)
  await response.body?.cancel();await delay(Math.ceil(seconds*1000),undefined,{signal})
 }
 if(!response?.ok){const status=response?.status;await response?.body?.cancel();throw new InputError(status===401||status===403?'provider_access_denied':status===402?'provider_billing':status===400||status===404?'provider_model_unsupported':'provider_unavailable',status===400?502:503)}
 const data=await response.json()
 if(data.status!=='completed')throw new InputError(data.status==='incomplete'?'response_incomplete':'provider_unavailable',502)
 return {data,requestId:String(response.headers.get('x-request-id')||data.id||'').slice(0,160)}
}
export function responseText(data:{output?:Array<{type?:string;content?:Array<{type?:string;text?:string}>}>}){
 return (data.output||[]).filter(x=>x.type==='message').flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text||'').join('')
}
function safeUrl(value:unknown){if(typeof value!=='string')return null;try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password?url.href:null}catch{return null}}
export async function openAIAnswer(model:ModelId,messages:{role:'system'|'user'|'assistant';content:string}[],signal:AbortSignal,citationIds:string[],chatV2=false,enabled?:AgentTools,customerKey?:string|null){
 const started=Date.now(),tools:Record<string,unknown>[]=[]
 // Tools are restricted to customer trials and activated customer API agents. Public widgets remain grounded.
 if(chatV2&&enabled?.webSearch)tools.push({type:'web_search',search_context_size:'low',external_web_access:true})
 if(chatV2&&enabled?.codeInterpreter)tools.push({type:'code_interpreter',container:{type:'auto',memory_limit:'1g'}})
 const {data,requestId}=await openAIResponse({model,input:messages,reasoning:{effort:'high'},max_output_tokens:numberSetting('AGYNEXA_MAX_OUTPUT_TOKENS',modelRegistry[model].maxOutput,2048,12000),max_tool_calls:4,...(tools.length?{tools,include:['web_search_call.action.sources']}:{}),text:{format:{type:'json_schema',name:chatV2?'customer_chat_v2':'grounded_answer',strict:true,schema:chatV2?chatSchema(citationIds):schema}}},signal,customerKey)
 const content=responseText(data);if(!content)throw new InputError('invalid_model_output',502)
 let answer:GroundedAnswer|RawProviderChatV2
 try{answer=chatV2?JSON.parse(content) as RawProviderChatV2:parseAnswer(content)}catch{throw new InputError('invalid_model_output',502)}
 if(chatV2&&Array.isArray((answer as RawProviderChatV2).parts))for(const part of (answer as RawProviderChatV2).parts){if(part){part.basis=part.kind==='grounded'?'approved_sources':part.kind==='capability'?'product_capabilities':'suggestion';if(part.kind!=='grounded'&&!Object.hasOwn(part,'citationChunkIds'))part.citationChunkIds=[]}}
 const toolCalls:Array<{type:string;status:string}>=[],sources:Array<{url:string;title:string}>=[],artifacts:Array<{id:string;containerId:string;filename:string}>=[]
 for(const item of data.output||[]){
  if(item.type==='web_search_call'||item.type==='code_interpreter_call')toolCalls.push({type:item.type,status:String(item.status||'unknown')})
  for(const source of item.type==='web_search_call'?item.action?.sources||[]:[]){const url=safeUrl(source.url);if(url)sources.push({url,title:String(source.title||url).slice(0,300)})}
  for(const part of item.type==='message'?item.content||[]:[])for(const annotation of part.annotations||[]){
   if(annotation.type==='url_citation'){const url=safeUrl(annotation.url);if(url)sources.push({url,title:String(annotation.title||url).slice(0,300)})}
   if(annotation.type==='container_file_citation'&&/^cfile_[a-zA-Z0-9_-]+$/.test(annotation.file_id)&&/^cntr_[a-zA-Z0-9_-]+$/.test(annotation.container_id))artifacts.push({id:annotation.file_id,containerId:annotation.container_id,filename:String(annotation.filename||'output').slice(0,180)})
  }
 }
 const input=Math.max(0,Number(data.usage?.input_tokens)||0),output=Math.max(0,Number(data.usage?.output_tokens)||0),cached=Math.max(0,Math.min(input,Number(data.usage?.input_tokens_details?.cached_tokens)||0)),prices=modelRegistry[model]
 return {answer,usage:{provider:'openai',reasoning_effort:'high',input_tokens:input,output_tokens:output,cached_input_tokens:cached,latency_ms:Date.now()-started,request_id:requestId,estimated_cost_usd:((input-cached)*prices.inputPrice+cached*0.05+output*prices.outputPrice)/1000000,cost_scope:'model_tokens_only_tools_billed_separately',pricing_date:pricingDate,pricing_source:pricingSource,key_slot:1,tool_calls:toolCalls,sources:sources.filter((s,i,a)=>a.findIndex(x=>x.url===s.url)===i).slice(0,25),artifacts:artifacts.filter((s,i,a)=>a.findIndex(x=>x.id===s.id)===i).slice(0,10)}}
}
export async function checkProvider(){
 return await Promise.all(Object.keys(modelRegistry).map(async id=>{
  try{const response=await fetch(`https://api.openai.com/v1/models/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${openAIKey()}`},cache:'no-store',redirect:'error',signal:AbortSignal.timeout(10000)});await response.body?.cancel();return {model:id,status:response.ok?'listed':response.status===404?'not_listed':'rejected',http:response.status}}
  catch{return {model:id,status:'unavailable'}}
 }))
}
