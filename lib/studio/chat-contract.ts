import {InputError} from '../account-validation'
import type {Citation} from './runtime'
export type ChatProfile='grounded_v1'|'customer_v1'
export type ChatScope={orgId:string;agentId:string;actorId:string|null;accessKind:'studio'|'api'|'widget';conversationId:string;identity:string;sourceIds?:string[];versionId?:string|null;generation?:number}
export type SourceDependency={sourceId:string;chunkId:string;contentHash:string}
export type ChatPartKind='capability'|'discovery'|'draft'|'grounded'|'missing_evidence'|'unavailable_action'
export type ChatPart={kind:ChatPartKind;text:string;basis:'product_capabilities'|'user_supplied'|'suggestion'|'approved_sources';citations:Citation[]}
export type BriefDraft={serviceId:string|null;problem:string;sources:string;acceptance:string;assumptions:string[];missingInputs:string[]}
export type ChatResponseV2={schemaVersion:2;parts:ChatPart[];nextQuestion:string|null;briefDraft:BriefDraft|null}
export type TurnContext={runId:string;userText:string;assistantParts:ChatPart[];sourceDependencies:SourceDependency[]}
export type RunChatSnapshotV2={schemaVersion:2;profile:ChatProfile;policyVersion:'2026-10-v1';response:ChatResponseV2;sourceDependencies:SourceDependency[]}
export type RawProviderChatV2={parts:{kind:ChatPartKind;text:string;basis:ChatPart['basis'];citationChunkIds:string[]}[];nextQuestion:string|null;briefDraft:BriefDraft|null;support:{propose:boolean;title:string;details:string}}
export type AuthorizedChunk={id:string;source_id:string;title:string;content:string;score?:number}
export const capabilityRegistry={read:'Only text you explicitly add to this assistant: pasted text or UTF-8 TXT/MD, at most 12000 bytes.',prepare:'Clarify a task, organize supplied facts, prepare drafts, and answer from approved text with original citations.',review:'Only the signed-in owner can create sources, publish, or approve the exact stored internal request.',unavailable:'No business system access, live lookup, external sending, refunds, payments, code execution, or shared staff inbox.'} as const
const kinds=['capability','discovery','draft','grounded','missing_evidence','unavailable_action']
const bases=['product_capabilities','user_supplied','suggestion','approved_sources']
function invalid():never{throw new InputError('invalid_model_output',502)}
function keys(value:unknown,allowed:string[]){if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!allowed.includes(k)))invalid()}
export function validateChatResponse(raw:RawProviderChatV2,policy:{customer:boolean;support:boolean},chunks:AuthorizedChunk[]):ChatResponseV2{
 keys(raw,['parts','nextQuestion','briefDraft','support'])
 if(!Array.isArray(raw.parts)||raw.parts.length<1||raw.parts.length>6)invalid()
 const parts=raw.parts.map(p=>{
  keys(p,['kind','text','basis','citationChunkIds'])
  if(!kinds.includes(p.kind)||!bases.includes(p.basis)||typeof p.text!=='string'||!p.text.trim()||!Array.isArray(p.citationChunkIds)||p.citationChunkIds.length>6||p.citationChunkIds.some(id=>typeof id!=='string'))invalid()
  if(p.kind==='grounded'){if(p.basis!=='approved_sources'||!p.citationChunkIds.length)invalid()}
  else if(p.basis==='approved_sources'||p.citationChunkIds.length)invalid()
  if(p.kind==='capability'&&p.basis!=='product_capabilities')invalid()
  if(p.kind==='draft'&&!['user_supplied','suggestion'].includes(p.basis))invalid()
  if(!policy.customer&&['discovery','draft'].includes(p.kind))invalid()
  const citations=[...new Set(p.citationChunkIds)].map(id=>{const c=chunks.find(c=>c.id===id);if(!c)invalid();return {chunkId:c.id,sourceId:c.source_id,title:c.title,quote:c.content}})
  return {kind:p.kind,text:p.text.trim(),basis:p.basis,citations}
 })
 if(new Set(parts.flatMap(p=>p.citations.map(c=>c.chunkId))).size>6)invalid()
 if(raw.nextQuestion!==null&&(typeof raw.nextQuestion!=='string'||raw.nextQuestion.length>500))invalid()
 // Brief prefill is deliberately derived from user input in the UI, not model/source text.
 if(raw.briefDraft!==null)invalid()
 keys(raw.support,['propose','title','details'])
 if(typeof raw.support.propose!=='boolean'||typeof raw.support.title!=='string'||raw.support.title.length>160||typeof raw.support.details!=='string'||raw.support.details.length>3000)invalid()
 if(raw.support.propose&&(!policy.support||!raw.support.title.trim()||!raw.support.details.trim()))invalid()
 return {schemaVersion:2,parts,nextQuestion:raw.nextQuestion,briefDraft:null}
}
export function customerChatEnabled(){return process.env.STUDIO_CUSTOMER_CHAT_V2_ENABLED==='true'}
export function normalizedSearchEnabled(){return process.env.STUDIO_SEARCH_NORMALIZATION_V2_ENABLED==='true'}
