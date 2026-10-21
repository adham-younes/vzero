import {readMutation,InputError} from '@/lib/account-validation'
import {json,failure} from '@/lib/supabase/server'
import {customerChatEnabled} from '@/lib/studio/chat-contract'
import {agentSettings} from '@/lib/studio/validation'
import {studioSession,ownerWorkspace,agentFields} from '@/lib/studio/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(){try{
 const session=await studioSession();const workspace=await ownerWorkspace(session)
 if(!workspace)return json({workspace:null,agents:[]})
 const {data,error}=await session.client.from('agents').select(agentFields).eq('org_id',workspace.id).order('created_at',{ascending:false})
 if(error)throw error
 return json({workspace,agents:data})
}catch(error){return failure(error)}}
export async function POST(request:Request){try{
 const body=agentSettings(await readMutation(request),true)
 if('chat_profile' in body&&!customerChatEnabled())throw new InputError('customer_chat_unavailable',503)
 const session=await studioSession();const workspace=await ownerWorkspace(session)
 if(!workspace)throw new InputError('workspace_required',409)
 const {data,error}=await session.client.from('agents').insert({...body,org_id:workspace.id,created_by:session.user.id}).select(agentFields).single()
 if(!error)return json({agent:data},201)
 if(error.code==='23505'){
  const {data:existing,error:readError}=await session.client.from('agents').select(`${agentFields},request_key`).eq('org_id',workspace.id).eq('request_key','request_key' in body?body.request_key:'').single()
  if(readError)throw readError
  if(Object.entries(body).some(([key,value])=>(existing as Record<string,unknown>)[key]!==value))throw new InputError('request_conflict',409)
  const {request_key:_,...agent}=existing
  return json({agent})
 }
 throw error
}catch(error){return failure(error)}}
