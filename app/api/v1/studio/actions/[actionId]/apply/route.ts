import {json,failure} from '@/lib/supabase/server'
import {readMutation} from '@/lib/account-validation'
import {applyWork} from '@/lib/studio/projects'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function POST(request:Request,context:{params:Promise<{actionId:string}>}){try{return json(await applyWork((await context.params).actionId,await readMutation(request)))}catch(error){return failure(error)}}
