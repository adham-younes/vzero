import {readMutation,InputError} from '@/lib/account-validation'
import {json,failure} from '@/lib/supabase/server'
import {agentId,agentSettings} from '@/lib/studio/validation'
import {studioSession,ownerWorkspace,agentFields} from '@/lib/studio/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
type Context={params:Promise<{agentId:string}>}
async function owned(context:Context){
 const id=agentId((await context.params).agentId)
 const session=await studioSession();const workspace=await ownerWorkspace(session)
 if(!workspace)throw new InputError('not_found',404)
 return {...session,id,orgId:workspace.id}
}
export async function GET(_request:Request,context:Context){try{
 const {client,id,orgId}=await owned(context)
 const {data,error}=await client.from('agents').select(agentFields).eq('id',id).eq('org_id',orgId).maybeSingle()
 if(error)throw error
 if(!data)throw new InputError('not_found',404)
 return json({agent:data})
}catch(error){return failure(error)}}
export async function PATCH(request:Request,context:Context){try{
 const body=await readMutation(request);const settings=agentSettings(body,false)
 const {client,id,orgId}=await owned(context)
 const {data,error}=await client.from('agents').update(settings).eq('id',id).eq('org_id',orgId).eq('revision',body.revision).select(agentFields).maybeSingle()
 if(error)throw error
 if(!data){
  const {data:exists,error:readError}=await client.from('agents').select('id').eq('id',id).eq('org_id',orgId).maybeSingle()
  if(readError)throw readError
  throw new InputError(exists?'revision_conflict':'not_found',exists?409:404)
 }
 return json({agent:data})
}catch(error){return failure(error)}}
