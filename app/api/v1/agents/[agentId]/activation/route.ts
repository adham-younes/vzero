import {json,failure} from '@/lib/supabase/server'
import {readMutation,field,InputError} from '@/lib/account-validation'
import {agentId} from '@/lib/studio/validation'
import {activationStatus,requestActivation} from '@/lib/studio/activation'
export const runtime='nodejs'
export const dynamic='force-dynamic'
type Context={params:Promise<{agentId:string}>}
export async function GET(_r:Request,c:Context){try{return json(await activationStatus(agentId((await c.params).agentId)))}catch(e){return failure(e)}}
export async function POST(r:Request,c:Context){try{const b=await readMutation(r);if(Object.keys(b).length!==1)throw new InputError('invalid_input');return json(await requestActivation(agentId((await c.params).agentId),agentId(field(b.requestKey,36))))}catch(e){return failure(e)}}
