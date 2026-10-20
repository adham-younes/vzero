import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {readMutation} from '@/lib/account-validation'
import {studioSession} from '@/lib/studio/server'
import {configuredModels,checkProvider} from '@/lib/studio/provider'
import {evaluator,abuseLimit} from '@/lib/studio/runtime'
export async function GET(){try{const s=await studioSession();const internal=await evaluator(s.user.id);return json({models:configuredModels().filter(m=>internal||m.stage==='production'),evaluationAllowed:internal})}catch(e){return failure(e)}}
export async function POST(r:Request){try{await readMutation(r);const s=await studioSession();await abuseLimit('model-check:'+s.user.id,2);return json({models:await checkProvider()})}catch(e){return failure(e)}}
