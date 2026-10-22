import {json,failure} from '@/lib/supabase/server'
import {readMutation} from '@/lib/account-validation'
import {actionsPage,proposeWork,projectOffset} from '@/lib/studio/projects'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(request:Request){try{return json(await actionsPage(projectOffset(new URL(request.url).searchParams.get('offset'))))}catch(error){return failure(error)}}
export async function POST(request:Request){try{return json(await proposeWork(await readMutation(request)),201)}catch(error){return failure(error)}}
