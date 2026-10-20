import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readMutation} from '@/lib/account-validation'
import {mutate} from '@/lib/studio/runtime'
export async function POST(r:Request,c:{params:Promise<{agentId:string}>}){try{await readMutation(r);return json(await mutate((await c.params).agentId,'unpublish',{}))}catch(e){return failure(e)}}
