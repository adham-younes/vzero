import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readMutation,field} from '@/lib/account-validation'
import {draftScope,executeRun} from '@/lib/studio/runtime'
export const maxDuration=300
export async function POST(r:Request,c:{params:Promise<{agentId:string}>}){try{const b=await readMutation(r);const scope=await draftScope((await c.params).agentId,b.model?field(b.model,100):undefined);return json({run:await executeRun(scope,b,r)})}catch(e){return failure(e)}}
