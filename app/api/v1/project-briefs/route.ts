import {briefInput,readMutation,InputError,uuidPattern} from '@/lib/account-validation'
import {signedIn,json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
const fields='id,request_key,organization,contact_email,service,problem,sources,acceptance,created_at'
export async function GET(){try{
 const {client}=await signedIn();const {data,error}=await client.from('project_briefs').select(fields).order('created_at',{ascending:false}).limit(100)
 if(error)throw error
 return json({briefs:data})
}catch(error){return failure(error)}}
export async function POST(request:Request){try{
 const body=briefInput(await readMutation(request));const {client,user}=await signedIn()
 const {data,error}=await client.from('project_briefs').insert({...body,owner_id:user.id}).select(fields).single()
 if(!error)return json({brief:data},201)
 if(error.code==='23505'){
  const {data:existing,error:readError}=await client.from('project_briefs').select(fields).eq('request_key',body.request_key).single()
  if(readError)throw readError
  if(Object.entries(body).some(([k,v])=>existing[k as keyof typeof existing]!==v))throw new InputError('request_conflict',409)
  return json({brief:existing})
 }
 if(error.code==='P0001')throw new InputError('brief_limit',429)
 throw error
}catch(error){return failure(error)}}
export async function DELETE(request:Request){try{
 const body=await readMutation(request);if(typeof body.id!=='string'||!uuidPattern.test(body.id))throw new InputError('invalid_input')
 const {client}=await signedIn();const {data,error}=await client.from('project_briefs').delete().eq('id',body.id).select('id')
 if(error)throw error
 if(!data?.length)throw new InputError('not_found',404)
 return json({ok:true})
}catch(error){return failure(error)}}
