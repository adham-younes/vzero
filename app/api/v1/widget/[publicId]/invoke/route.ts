import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readMutation} from '@/lib/account-validation'
import {publishedScope,trustedIp} from '@/lib/studio/publishing'
import {executeRun,abuseLimit} from '@/lib/studio/runtime'
export const maxDuration=300
export async function POST(r:Request,c:{params:Promise<{publicId:string}>}){try{const b=await readMutation(r);const scope=await publishedScope((await c.params).publicId,r,true);await abuseLimit('widget-ip:'+trustedIp(r),30);await abuseLimit('widget-global-agent:'+scope.agent.id,60);return json({run:await executeRun(scope,b,r)})}catch(e){return failure(e)}}
