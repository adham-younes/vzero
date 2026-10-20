import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {studioSession,ownerWorkspace} from '@/lib/studio/server'
import {dbError,publicRunFields} from '@/lib/studio/runtime'
import {agentId} from '@/lib/studio/validation'
import {InputError} from '@/lib/account-validation'
export async function GET(_r:Request,c:{params:Promise<{runId:string}>}){try{const s=await studioSession();const org=await ownerWorkspace(s);if(!org)throw new InputError('not_found',404);const {data,error}=await s.client.from('agent_runs').select(publicRunFields).eq('id',agentId((await c.params).runId)).eq('org_id',org.id).maybeSingle();dbError(error);return json({run:data},data?200:404)}catch(e){return failure(e)}}
