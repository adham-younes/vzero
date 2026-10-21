import {json,failure,adminClient} from '@/lib/supabase/server'
import {studioSession,ownerWorkspace} from '@/lib/studio/server'
import {dbError} from '@/lib/studio/runtime'
import {agentId} from '@/lib/studio/validation'
import {InputError} from '@/lib/account-validation'
import {storedRunFields,presentRun,runScope} from '@/lib/studio/history-visibility'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(_r:Request,c:{params:Promise<{runId:string}>}){try{const s=await studioSession(),org=await ownerWorkspace(s);if(!org)throw new InputError('not_found',404);const {data,error}=await adminClient().from('agent_runs').select(storedRunFields).eq('id',agentId((await c.params).runId)).eq('org_id',org.id).eq('actor_id',s.user.id).eq('access_kind','studio').maybeSingle();dbError(error);if(!data)throw new InputError('not_found',404);return json({run:await presentRun({...runScope(data),identity:s.user.id},data,true)})}catch(e){return failure(e)}}
