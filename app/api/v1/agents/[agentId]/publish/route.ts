import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readMutation,field,InputError} from '@/lib/account-validation'
import {mutate} from '@/lib/studio/runtime'
import {agentId} from '@/lib/studio/validation'
export async function POST(r:Request,c:{params:Promise<{agentId:string}>}){try{const b=await readMutation(r);if(!Number.isSafeInteger(b.revision)||typeof b.widgetEnabled!=='boolean')throw new InputError('invalid_input');return json({version:await mutate((await c.params).agentId,'publish',{revision:b.revision,widgetEnabled:b.widgetEnabled,requestKey:agentId(field(b.requestKey,36))})})}catch(e){return failure(e)}}
