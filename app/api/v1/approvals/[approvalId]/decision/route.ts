import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readMutation,InputError} from '@/lib/account-validation'
import {studioSession} from '@/lib/studio/server'
import {agentId} from '@/lib/studio/validation'
import {dbError,mutate} from '@/lib/studio/runtime'
export async function POST(r:Request,c:{params:Promise<{approvalId:string}>}){try{const b=await readMutation(r);if(Object.keys(b).some(k=>k!=='decision')||!['approved','rejected'].includes(String(b.decision)))throw new InputError('invalid_input');const s=await studioSession();const id=agentId((await c.params).approvalId);const {data,error}=await s.client.from('support_requests').select('agent_id').eq('id',id).maybeSingle();dbError(error);if(!data)throw new InputError('not_found',404);return json({approval:await mutate(data.agent_id,'approval',{approvalId:id,decision:b.decision})})}catch(e){return failure(e)}}
