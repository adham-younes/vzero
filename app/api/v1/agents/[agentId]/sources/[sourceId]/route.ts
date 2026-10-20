import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readMutation} from '@/lib/account-validation'
import {mutate,ownedAgent,dbError} from '@/lib/studio/runtime'
import {agentId} from '@/lib/studio/validation'
type C={params:Promise<{agentId:string;sourceId:string}>}
export async function DELETE(r:Request,c:C){try{await readMutation(r);const p=await c.params;return json(await mutate(p.agentId,'source_delete',{sourceId:agentId(p.sourceId)}))}catch(e){return failure(e)}}
export async function GET(_r:Request,c:C){try{const p=await c.params;const ctx=await ownedAgent(p.agentId);const {data,error}=await ctx.client.from('knowledge_sources').select('id,title,content,status,public_approved').eq('agent_id',p.agentId).eq('id',agentId(p.sourceId)).eq('status','ready').maybeSingle();dbError(error);return json({source:data},data?200:404)}catch(e){return failure(e)}}
