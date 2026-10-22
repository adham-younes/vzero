import {json,failure} from '@/lib/supabase/server'
import {projectsPage,projectOffset} from '@/lib/studio/projects'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(request:Request){try{return json(await projectsPage(projectOffset(new URL(request.url).searchParams.get('offset'))))}catch(error){return failure(error)}}
