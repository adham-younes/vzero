import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readMutation} from '@/lib/account-validation'
import {widgetSession} from '@/lib/studio/publishing'
export async function POST(r:Request,c:{params:Promise<{publicId:string}>}){try{await readMutation(r);return json(await widgetSession((await c.params).publicId,r))}catch(e){return failure(e)}}
