import {json,failure} from '@/lib/supabase/server'
import {ownedAgent,abuseLimit} from '@/lib/studio/runtime'
import {assertSourceOrigin,readSourceUpload} from '@/lib/studio/source-body'
import {extractSourceFile} from '@/lib/studio/source-import'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=60
export async function POST(request:Request,context:{params:Promise<{agentId:string}>}){
 try{
  assertSourceOrigin(request)
  const {agentId}=await context.params,owner=await ownedAgent(agentId)
  await abuseLimit('source-import:global',20);await abuseLimit('source-import:'+owner.user.id,6)
  const file=await readSourceUpload(request),source=await extractSourceFile(file,request.signal)
  // A deleted/revoked workspace cannot receive an extraction after its access changes.
  await ownedAgent(agentId)
  return json(source)
 }catch(error){return failure(error)}
}
