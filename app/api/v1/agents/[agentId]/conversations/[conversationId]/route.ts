import {json,failure} from '@/lib/supabase/server'
import {readMutation,InputError} from '@/lib/account-validation'
import {ownedAgent,dbError} from '@/lib/studio/runtime'
import {agentId} from '@/lib/studio/validation'
import {readVisibleConversation} from '@/lib/studio/conversation-store'
export const runtime='nodejs'
export const dynamic='force-dynamic'
type Context={params:Promise<{agentId:string;conversationId:string}>}
export async function GET(r:Request,c:Context){try{const p=await c.params,ctx=await ownedAgent(p.agentId);return json(await readVisibleConversation({orgId:ctx.agent.org_id,agentId:ctx.agent.id,actorId:ctx.user.id,identity:ctx.user.id,accessKind:'studio',conversationId:agentId(p.conversationId)},new URL(r.url).searchParams.get('before')))}catch(e){return failure(e)}}
export async function DELETE(r:Request,c:Context){try{const b=await readMutation(r);if(Object.keys(b).length)throw new InputError('invalid_input');const p=await c.params,ctx=await ownedAgent(p.agentId);const {data,error}=await ctx.client.rpc('studio_delete_conversation',{p_agent_id:ctx.agent.id,p_conversation_id:agentId(p.conversationId)});dbError(error);return json(data)}catch(e){return failure(e)}}
