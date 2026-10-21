import 'server-only'
import {randomBytes} from 'node:crypto'
import {adminClient} from '@/lib/supabase/server'
import {InputError} from '@/lib/account-validation'
import {agentId} from './validation'
import {hash,dbError,abuseLimit,type RunScope} from './runtime'
import {studioEnabled} from './server'
import type {Agent} from './settings'
export function newToken(prefix:string){return prefix+randomBytes(32).toString('base64url')}
export function bearer(request:Request){const token=request.headers.get('authorization')?.match(/^Bearer ([A-Za-z0-9_-]{40,128})$/)?.[1];if(!token)throw new InputError('invalid_credentials',401);return token}
export function trustedIp(request:Request){return process.env.VERCEL==='1'?request.headers.get('x-vercel-forwarded-for')||'unknown':'local'}
export async function publishedScope(id:string,request:Request,widget=false):Promise<RunScope>{
 if(!studioEnabled())throw new InputError('studio_unavailable',503)
 agentId(id);const db=adminClient();const token=hash(bearer(request));let keyId:string|undefined;let expectedGeneration:number|undefined
 if(widget){const {data,error}=await db.rpc('studio_widget_session',{operation:'read',token_hash:token});dbError(error);if(!data||data.agent_id!==id)throw new InputError('invalid_credentials',401);expectedGeneration=data.generation}
 else{const {data,error}=await db.from('agent_api_keys').select('id,agent_id,revoked_at,expires_at').eq('token_hash',token).eq('agent_id',id).maybeSingle();dbError(error);if(!data||data.revoked_at||Date.parse(data.expires_at)<=Date.now())throw new InputError('invalid_credentials',401);keyId=data.id}
 const {data:p,error:pe}=await db.from('agent_publications').select('*').eq('agent_id',id).eq('active',true).maybeSingle();dbError(pe);if(!p||widget&&(!p.widget_enabled||p.generation!==expectedGeneration))throw new InputError('not_published',404)
 const {data:v,error:ve}=await db.from('agent_versions').select('*').eq('id',p.version_id).eq('org_id',p.org_id).eq('agent_id',id).single();dbError(ve)
 const assertAccess=async()=>{
  const {data:current,error}=await db.from('agent_publications').select('active,generation,widget_enabled').eq('agent_id',id).single();dbError(error);if(!current||!current.active||current.generation!==p.generation||widget&&!current.widget_enabled)throw new InputError('not_published',404)
  if(keyId){const {data:k,error:e}=await db.from('agent_api_keys').select('revoked_at,expires_at').eq('id',keyId).single();dbError(e);if(!k||k.revoked_at||Date.parse(k.expires_at)<=Date.now())throw new InputError('invalid_credentials',401)}
  if(widget){const {data:s,error:e}=await db.rpc('studio_widget_session',{operation:'read',token_hash:token});dbError(e);if(!s)throw new InputError('invalid_credentials',401)}
 }
 return {agent:{...v.settings,...(widget?{instructions:'Answer only using the approved public passages.'}:{})} as Agent,sourceIds:widget?v.public_source_ids:v.source_ids,versionId:v.id,kind:widget?'widget':'api',identity:token,actorId:null,generation:p.generation,keyId,assertAccess}
}
export async function widgetSession(publicId:string,request:Request){
 if(!studioEnabled())throw new InputError('studio_unavailable',503)
 agentId(publicId);await abuseLimit('widget-session:'+trustedIp(request),20)
 const db=adminClient();const {data:p,error}=await db.from('agent_publications').select('agent_id,generation').eq('public_id',publicId).eq('active',true).eq('widget_enabled',true).maybeSingle();dbError(error);if(!p)throw new InputError('not_published',404)
 await abuseLimit('widget-agent:'+p.agent_id,60)
 const token=newToken('agw_');const {error:e}=await db.rpc('studio_widget_session',{operation:'create',token_hash:hash(token),agent:p.agent_id,generation:p.generation});dbError(e)
 return {token,agentId:p.agent_id,expiresIn:600}
}
