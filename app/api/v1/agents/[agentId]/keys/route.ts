import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {adminClient} from '@/lib/supabase/server'
import {readMutation,field} from '@/lib/account-validation'
import {ownedAgent,dbError,hash,mutate} from '@/lib/studio/runtime'
import {agentId} from '@/lib/studio/validation'
import {newToken} from '@/lib/studio/publishing'
export async function POST(r:Request,c:{params:Promise<{agentId:string}>}){try{const b=await readMutation(r);const ctx=await ownedAgent((await c.params).agentId);const token=newToken('agx_');const {data,error}=await adminClient().from('agent_api_keys').insert({org_id:ctx.agent.org_id,agent_id:ctx.agent.id,token_hash:hash(token),label:field(b.label,80)}).select('id,label,expires_at').single();dbError(error);return json({key:data,token},201)}catch(e){return failure(e)}}
export async function DELETE(r:Request,c:{params:Promise<{agentId:string}>}){try{const b=await readMutation(r);return json(await mutate((await c.params).agentId,'key_revoke',{keyId:agentId(field(b.keyId,36))}))}catch(e){return failure(e)}}
