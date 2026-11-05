import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readMutation,field} from '@/lib/account-validation'
import {draftScope,executeRun} from '@/lib/studio/runtime'
import {runStream} from '@/lib/studio/run-stream'
export const maxDuration=300
export async function POST(r:Request,c:{params:Promise<{agentId:string}>}){try{const b=await readMutation(r);const scope=await draftScope((await c.params).agentId,b.model!==undefined?field(b.model,100):undefined);if(r.headers.get('accept')?.includes('text/event-stream'))return runStream(r,(signal,progress)=>executeRun(scope,b,{signal},progress));return json({run:await executeRun(scope,b,r)})}catch(e){return failure(e)}}
