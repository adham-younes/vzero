import 'server-only'
import {createHash,randomBytes} from 'node:crypto'
import {adminClient} from '@/lib/supabase/server'
import {mailConfig} from '@/lib/nexa-email/config'
import {MailError} from '@/lib/nexa-email/errors'
import {headers} from 'next/headers'
import {isMailConsoleHost} from './host'

export const CONNECTOR_SCOPES=['mail:read','mail:reply','knowledge:read'] as const
export type ConnectorScope=typeof CONNECTOR_SCOPES[number]
export type ConnectorContext={actor:{id:string;kind:'chatgpt'};scopes:Set<ConnectorScope>;tokenId:string}
type Database=ReturnType<typeof adminClient>
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const hash=(text:string)=>createHash('sha256').update(text).digest('hex')

async function enabled(){
 if(!isMailConsoleHost((await headers()).get('host')))throw new MailError('not_found',404)
}
async function liveOwner(db:Database,id:string){
 if(!uuid.test(id)||!mailConfig().admins.has(id))throw new MailError('mail_access_denied',403)
 const {data,error}=await db.from('profiles').select('id').eq('id',id).maybeSingle()
 if(error)throw new MailError('mail_unavailable',503)
 if(!data)throw new MailError('mail_access_denied',403)
}

// Only the authenticated owner API may call this. The secret is returned once.
export async function mintConnectorToken(db:Database,actor:string,name:string){
 await enabled()
 if(typeof name!=='string'||name.trim().length<1||name.trim().length>80||/[\u0000-\u001f\u007f]/.test(name))throw new MailError('invalid_connector_name',400)
 await liveOwner(db,actor)
 const token='nexa_mail_'+randomBytes(32).toString('base64url')
 const expires_at=new Date(Date.now()+30*24*60*60*1000).toISOString()
 const {data,error}=await db.from('owner_mail_connector_tokens').insert({
  owner_id:actor,name:name.trim(),token_hash:hash(token),scopes:[...CONNECTOR_SCOPES],expires_at,
 }).select('id,name,scopes,created_at,expires_at').single()
 if(error||!data)throw new MailError('mail_unavailable',503)
 return {...data,token}
}

export async function requireConnector(request:Request):Promise<ConnectorContext>{
 await enabled()
 const origin=request.headers.get('origin')
 if(origin!==null&&origin!==new URL(request.url).origin)throw new MailError('invalid_origin',403)
 const authorization=request.headers.get('authorization')||''
 if(!/^Bearer nexa_mail_[A-Za-z0-9_-]{43}$/.test(authorization))throw new MailError('connector_auth_required',401)
 const db=adminClient(),tokenHash=hash(authorization.slice(7))
 const {data,error}=await db.from('owner_mail_connector_tokens')
  .select('id,owner_id,scopes,expires_at,revoked_at').eq('token_hash',tokenHash).maybeSingle()
 if(error)throw new MailError('mail_unavailable',503)
 if(!data||data.revoked_at!==null||!Number.isFinite(Date.parse(data.expires_at))||Date.parse(data.expires_at)<=Date.now())throw new MailError('connector_auth_required',401)
 await liveOwner(db,data.owner_id)
 if(!Array.isArray(data.scopes)||data.scopes.length===0||data.scopes.some((scope:unknown)=>!CONNECTOR_SCOPES.includes(scope as ConnectorScope)))throw new MailError('connector_auth_required',401)
 // The existing limiter is hourly; a hashed minute key makes this a 60/minute limit.
 const bucket=hash(`owner-mail-mcp:${data.id}:${Math.floor(Date.now()/60000)}`)
 const limited=await db.rpc('consume_auth_limit',{bucket_key:bucket,max_attempts:60})
 if(limited.error)throw new MailError('mail_unavailable',503)
 if(limited.data!==true)throw new MailError('connector_rate_limited',429)
 return {actor:{id:data.owner_id,kind:'chatgpt'},scopes:new Set(data.scopes as ConnectorScope[]),tokenId:data.id}
}
