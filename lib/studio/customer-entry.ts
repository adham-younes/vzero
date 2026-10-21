import 'server-only'
import {InputError} from '../account-validation'
import {studioSession,agentFields,ownerWorkspace} from './server'
import {customerChatEnabled} from './chat-contract'
const requestKey='a6f00344-6e01-4e5f-9e25-cc5e431e0021'
export async function ensureCustomerAssistant(session:Awaited<ReturnType<typeof studioSession>>,locale:'en'|'ar'){
 if(!customerChatEnabled())throw new InputError('customer_chat_unavailable',503)
 const {error}=await session.client.rpc('initialize_workspace');if(error)throw error
 const workspace=await ownerWorkspace(session);if(!workspace)throw new InputError('workspace_required',409)
 const find=()=>session.client.from('agents').select(agentFields).eq('org_id',workspace.id).eq('request_key',requestKey).maybeSingle()
 let {data:agent,error:readError}=await find();if(readError)throw readError
 if(!agent){
  const row={org_id:workspace.id,created_by:session.user.id,request_key:requestKey,name:locale==='ar'?'مساعد العمل':'Business assistant',template:'serviceflow',language:locale,model:'openai/gpt-oss-20b',chat_profile:'customer_v1',instructions:locale==='ar'?'ساعدني في توضيح مهمة عمل وإعداد مسودة للمراجعة. اسأل عن النتيجة المطلوبة أولًا، ولا تخترع معلومات الشركة.':'Help clarify one business task and prepare a draft for review. Ask about the desired outcome first. Never invent company facts.'}
  const inserted=await session.client.from('agents').insert(row).select(agentFields).single()
  if(inserted.error&&inserted.error.code!=='23505')throw inserted.error
  agent=inserted.data
  if(!agent){const reread=await find();if(reread.error)throw reread.error;agent=reread.data}
 }
 if(!agent||agent.chat_profile!=='customer_v1'||agent.template!=='serviceflow')throw new InputError('default_assistant_conflict',409)
 return {workspace,agent}
}
