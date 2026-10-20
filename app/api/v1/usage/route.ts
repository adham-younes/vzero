import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {studioSession,ownerWorkspace} from '@/lib/studio/server'
import {dbError} from '@/lib/studio/runtime'
export async function GET(){try{const s=await studioSession();const org=await ownerWorkspace(s);if(!org)return json({runs:[]});const {data,error}=await s.client.from('agent_runs').select('id,agent_id,model,status,usage,created_at').eq('org_id',org.id).order('created_at',{ascending:false}).limit(100);dbError(error);return json({runs:data,window:'latest_100_runs',billing:'not_connected'})}catch(e){return failure(e)}}
