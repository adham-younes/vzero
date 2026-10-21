import {json,failure} from '@/lib/supabase/server'
import {ownedAgent} from '@/lib/studio/runtime'
import {listConversations} from '@/lib/studio/conversation-store'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(r:Request,c:{params:Promise<{agentId:string}>}){try{const ctx=await ownedAgent((await c.params).agentId);return json(await listConversations({orgId:ctx.agent.org_id,agentId:ctx.agent.id,actorId:ctx.user.id,identity:ctx.user.id,accessKind:'studio'},new URL(r.url).searchParams.get('cursor')))}catch(e){return failure(e)}}
