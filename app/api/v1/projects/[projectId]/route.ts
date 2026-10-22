import {json,failure} from '@/lib/supabase/server'
import {projectDetail,projectOffset} from '@/lib/studio/projects'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(request:Request,context:{params:Promise<{projectId:string}>}){try{const query=new URL(request.url).searchParams;return json(await projectDetail((await context.params).projectId,projectOffset(query.get('taskOffset')),projectOffset(query.get('activityOffset'))))}catch(error){return failure(error)}}
