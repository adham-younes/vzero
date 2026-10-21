import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readJsonBody} from '@/lib/account-validation'
import {publishedScope} from '@/lib/studio/publishing'
import {executeRun} from '@/lib/studio/runtime'
export const maxDuration=300
export async function POST(r:Request,c:{params:Promise<{agentId:string}>}){try{const scope=await publishedScope((await c.params).agentId,r);const b=await readJsonBody(r);return json({run:await executeRun(scope,b,r)})}catch(e){return failure(e)}}
