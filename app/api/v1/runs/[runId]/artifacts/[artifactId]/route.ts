import {adminClient,failure} from '@/lib/supabase/server'
import {InputError} from '@/lib/account-validation'
import {agentId} from '@/lib/studio/validation'
import {studioSession,ownerWorkspace} from '@/lib/studio/server'
import {isRunContentVisible,runScope,storedRunFields} from '@/lib/studio/history-visibility'
import {customerProviderKey} from '@/lib/studio/customer-provider'
import {publishedScope} from '@/lib/studio/publishing'
import type {StoredRun} from '@/lib/studio/history-visibility'
import {openAIKey} from '@/lib/studio/provider'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(request:Request,c:{params:Promise<{runId:string;artifactId:string}>}){try{
 const {runId,artifactId}=await c.params;agentId(runId);if(!/^cfile_[a-zA-Z0-9_-]+$/.test(artifactId))throw new InputError('not_found',404)
 let run:StoredRun,orgId:string,assertAccess:()=>Promise<void>
 if(request.headers.has('authorization')){
  const {data,error}=await adminClient().from('agent_runs').select(storedRunFields).eq('id',runId).eq('access_kind','api').maybeSingle();if(error)throw error;if(!data)throw new InputError('not_found',404)
  const access=await publishedScope(data.agent_id,request)
  if(access.identity!==data.snapshot?.identity||access.agent.org_id!==data.org_id||access.versionId!==data.version_id||access.generation!==data.snapshot?.generation)throw new InputError('not_found',404)
  run=data;orgId=data.org_id;assertAccess=access.assertAccess
 }else{
  const session=await studioSession(),workspace=await ownerWorkspace(session);if(!workspace)throw new InputError('not_found',404)
  const {data,error}=await adminClient().from('agent_runs').select(storedRunFields).eq('id',runId).eq('org_id',workspace.id).eq('actor_id',session.user.id).eq('access_kind','studio').maybeSingle();if(error)throw error;if(!data)throw new InputError('not_found',404)
  run=data;orgId=workspace.id;assertAccess=async()=>{const current=await studioSession(),currentWorkspace=await ownerWorkspace(current);if(current.user.id!==session.user.id||currentWorkspace?.id!==orgId)throw new InputError('sign_in_required',401)}
 }
 if(run.status!=='succeeded'||!(await isRunContentVisible(runScope(run),run)).visible)throw new InputError('not_found',404)
 const artifact=run.usage?.artifacts?.find((a:{id:string})=>a.id===artifactId)
 if(!artifact||!/^cntr_[a-zA-Z0-9_-]+$/.test(artifact.containerId))throw new InputError('not_found',404)
 // Credentials remain scoped to this workspace. An expired provider container returns an explicit error.
 const key=run.usage?.billing_mode==='customer_api_key'?await customerProviderKey(orgId):openAIKey();if(!key)throw new InputError('customer_credentials_required',403)
 const response=await fetch(`https://api.openai.com/v1/containers/${artifact.containerId}/files/${artifact.id}/content`,{headers:{Authorization:`Bearer ${key}`},cache:'no-store',redirect:'error',signal:AbortSignal.timeout(20000)})
 if(!response.ok){await response.body?.cancel();throw new InputError('artifact_expired',410)}
 const length=Number(response.headers.get('content-length')||0);if(length>4*1024*1024){await response.body?.cancel();throw new InputError('response_too_large',413)}
 const reader=response.body?.getReader();if(!reader)throw new InputError('artifact_expired',410)
 const chunks:Uint8Array[]=[];let size=0
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4*1024*1024){await reader.cancel();throw new InputError('response_too_large',413)}chunks.push(value)}
 await assertAccess();if(!(await isRunContentVisible(runScope(run),run)).visible)throw new InputError('not_found',404)
 const safeName=String(artifact.filename).split('/').pop()!.replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,120)||'output'
 return new Response(Buffer.concat(chunks),{headers:{'Content-Type':'application/octet-stream','Content-Disposition':`attachment; filename="${safeName}"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})
}catch(e){return failure(e)}}
