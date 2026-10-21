import 'server-only'
import {setTimeout as delay} from 'node:timers/promises'
import {InputError} from '@/lib/account-validation'
import type {RawProviderChatV2} from './chat-contract'
import {modelRegistry,pricingDate,pricingSource,type ModelId} from './models'

const keyNames=['GROQ_API_KEY','GROQ_API_KEY_2','GROQ_API_KEY_3'] as const
function credential(model:ModelId){const key=process.env[keyNames[modelRegistry[model].slot-1]]?.trim();if(!key)throw new InputError('provider_not_configured',503);return key}
export function configuredModels(){return Object.entries(modelRegistry).map(([id,info])=>({id,...info,configured:!!process.env[keyNames[info.slot-1]]?.trim(),availability:'not_checked',structuredWithTools:false,structuredWithStreaming:false}))}
export function numberSetting(name:string,fallback:number,min:number,max:number){const n=Number(process.env[name]);return Number.isFinite(n)&&n>=min&&n<=max?Math.floor(n):fallback}
export type GroundedAnswer={answerable:boolean;answer:string;citations:{chunkId:string}[];support:{propose:boolean;title:string;details:string}}
const schema={type:'object',additionalProperties:false,required:['answerable','answer','citations','support'],properties:{answerable:{type:'boolean'},answer:{type:'string'},citations:{type:'array',items:{type:'object',additionalProperties:false,required:['chunkId'],properties:{chunkId:{type:'string'}}}},support:{type:'object',additionalProperties:false,required:['propose','title','details'],properties:{propose:{type:'boolean'},title:{type:'string'},details:{type:'string'}}}}}
export function parseAnswer(content:string):GroundedAnswer{
 let v:GroundedAnswer
 try{v=JSON.parse(content)}catch{throw new InputError('invalid_model_output',502)}
 if(!v||typeof v.answerable!=='boolean'||typeof v.answer!=='string'||!v.answer.trim()||v.answer.length>12000||!Array.isArray(v.citations)||v.citations.length>6||v.citations.some(c=>!c||typeof c.chunkId!=='string')||!v.support||typeof v.support.propose!=='boolean'||typeof v.support.title!=='string'||v.support.title.length>160||typeof v.support.details!=='string'||v.support.details.length>3000)throw new InputError('invalid_model_output',502)
 return v
}
export async function groqAnswer(model:ModelId,messages:{role:'system'|'user'|'assistant';content:string}[],signal:AbortSignal,citationIds:string[],chatV2=false){
 const responseSchema=chatV2?chatSchema(citationIds):schema
 const key=credential(model);const started=Date.now();let response:Response|undefined
 for(let attempt=0;attempt<2;attempt++){
  response=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',cache:'no-store',signal,headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages,stream:false,max_completion_tokens:modelRegistry[model].maxOutput,reasoning_effort:model.startsWith('qwen/')?'none':'low',reasoning_format:'hidden',response_format:{type:'json_schema',json_schema:{name:chatV2?'customer_chat_v2':'grounded_answer',strict:true,schema:responseSchema}}})})
  if(response.status!==429)break
  const retry=response.headers.get('retry-after');const seconds=retry===null?1:Number(retry)
  if(attempt||!Number.isFinite(seconds)||seconds<0||seconds>5)throw new InputError('provider_rate_limited',429)
  await delay(Math.ceil(seconds*1000),undefined,{signal})
 }
 if(!response?.ok){const status=response?.status;throw new InputError(status===401||status===403?'provider_access_denied':status===402?'provider_billing':status===400||status===404?'provider_model_unsupported':'provider_unavailable',status===400?502:503)}
 const data=await response.json();const content=data.choices?.[0]?.message?.content
 if(typeof content!=='string'||data.choices?.[0]?.finish_reason!=='stop')throw new InputError('invalid_model_output',502)
 const answer=chatV2?JSON.parse(content) as RawProviderChatV2:parseAnswer(content);
 // Non-grounded schema variants have no citation field; attach the canonical empty list server-side.
 if(chatV2&&Array.isArray((answer as RawProviderChatV2).parts))for(const part of (answer as RawProviderChatV2).parts){if(part){part.basis=part.kind==='grounded'?'approved_sources':part.kind==='capability'?'product_capabilities':'suggestion';if(part.kind!=='grounded'&&!Object.hasOwn(part,'citationChunkIds'))part.citationChunkIds=[]}}
const input=Math.max(0,Number(data.usage?.prompt_tokens)||0),output=Math.max(0,Number(data.usage?.completion_tokens)||0);const prices=modelRegistry[model]
 return {answer,usage:{input_tokens:input,output_tokens:output,latency_ms:Date.now()-started,request_id:String(data.x_groq?.id||response.headers.get('x-request-id')||data.id||'').slice(0,160),estimated_cost_usd:(input*prices.inputPrice+output*prices.outputPrice)/1000000,pricing_date:pricingDate,pricing_source:pricingSource,key_slot:prices.slot}}
}
export async function checkProvider(){
 return await Promise.all(Object.keys(modelRegistry).map(async id=>{
  const model=id as ModelId
  try{const response=await fetch('https://api.groq.com/openai/v1/models',{headers:{Authorization:`Bearer ${credential(model)}`},cache:'no-store',signal:AbortSignal.timeout(10000)});if(!response.ok)return {model,status:'rejected',http:response.status};const data=await response.json();return {model,status:data.data?.some((x:{id:string})=>x.id===model)?'listed':'not_listed',http:response.status}}
  catch{return {model,status:'unavailable'}}
 }))
}

const object=(properties:Record<string,unknown>)=>({type:'object',additionalProperties:false,required:Object.keys(properties),properties})
const partSchema=(kinds:string[],citationIds?:string[])=>object({kind:{type:'string',enum:kinds},text:{type:'string'},...(citationIds?{citationChunkIds:{type:'array',minItems:1,items:{type:'string',enum:citationIds}}}:{})})
// Only the grounded schema variant can contain citation IDs. The adapter attaches
// [] to other variants and derives basis from kind. Only kind discriminates the union;
// Groq rejects a union with multiple enum discriminator candidates. Server validation remains strict.
const chatSchema=(citationIds:string[])=>object({parts:{type:'array',items:{anyOf:[...(citationIds.length?[partSchema(['grounded'],citationIds)]:[]),partSchema(['capability']),partSchema(['discovery','draft']),partSchema(['missing_evidence','unavailable_action'])]}},nextQuestion:{type:['string','null']},briefDraft:{type:'null'},support:object({propose:{type:'boolean'},title:{type:'string'},details:{type:'string'}})})
