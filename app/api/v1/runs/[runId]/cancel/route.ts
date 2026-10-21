import {json,failure,adminClient} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readMutation,InputError} from '@/lib/account-validation'
import {studioSession} from '@/lib/studio/server'
import {agentId} from '@/lib/studio/validation'
import {dbError,mutate} from '@/lib/studio/runtime'
export async function POST(r:Request,c:{params:Promise<{runId:string}>}){try{await readMutation(r);const s=await studioSession();const id=agentId((await c.params).runId);const {data,error}=await adminClient().from('agent_runs').select('agent_id').eq('id',id).eq('actor_id',s.user.id).eq('access_kind','studio').maybeSingle();dbError(error);if(!data)throw new InputError('not_found',404);return json(await mutate(data.agent_id,'cancel',{runId:id}))}catch(e){return failure(e)}}
