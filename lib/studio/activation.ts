import 'server-only'
import {adminClient} from '@/lib/supabase/server'
import {InputError} from '@/lib/account-validation'
import {ownedAgent,dbError} from './runtime'
import {storedRunFields,isRunContentVisible,runScope} from './history-visibility'
import {customerProviderConfigured} from './customer-provider'
export const activationEmail='adham@agynexa.si'
export async function activationStatus(agentId:string){
 const c=await ownedAgent(agentId),db=adminClient()
 const {data,error}=await db.from('agent_activations').select('id,status,requested_at,activated_at').eq('agent_id',agentId).eq('org_id',c.agent.org_id).maybeSingle();dbError(error)
 const providerConfigured=await customerProviderConfigured(c.agent.org_id)
 const body=`Agent: ${c.agent.name}\nAgent reference: ${agentId}\nWorkspace reference: ${c.agent.org_id}\n\nI have tested this agent and would like to discuss production activation, scope, pricing and terms.`
 return {status:data?.status||'sandbox',contactEmail:activationEmail,mailto:`mailto:${activationEmail}?subject=${encodeURIComponent('AGYNEXA agent activation — '+c.agent.name)}&body=${encodeURIComponent(body)}`,requestId:data?.id,canPublish:data?.status==='active'&&providerConfigured,providerConfigured,requestedAt:data?.requested_at,activatedAt:data?.activated_at}
}
export async function requestActivation(id:string,requestKey:string){
 const c=await ownedAgent(id),db=adminClient()
 const {data:existing,error:readError}=await db.from('agent_activations').select('id,status').eq('agent_id',id).eq('org_id',c.agent.org_id).maybeSingle();dbError(readError)
 if(!existing){
  const {data:tested,error:testError}=await db.from('agent_runs').select(storedRunFields).eq('agent_id',id).eq('org_id',c.agent.org_id).eq('actor_id',c.user.id).eq('access_kind','studio').eq('status','succeeded').eq('snapshot->>revision',String(c.agent.revision)).eq('usage->>provider','openai').order('created_at',{ascending:false}).limit(1).maybeSingle();dbError(testError);if(!tested||!(await isRunContentVisible({...runScope(tested),identity:c.user.id},tested)).visible)throw new InputError('agent_test_required',409)
  const {error}=await db.from('agent_activations').insert({agent_id:id,org_id:c.agent.org_id,requested_by:c.user.id,request_key:requestKey,status:'requested'});if(error?.code!=='23505')dbError(error)
 }
 return activationStatus(id)
}
export async function requireActivation(agentId:string,orgId:string){
 const {data,error}=await adminClient().from('agent_activations').select('status').eq('agent_id',agentId).eq('org_id',orgId).maybeSingle();dbError(error)
 if(data?.status!=='active')throw new InputError('activation_required',403)
 if(!await customerProviderConfigured(orgId))throw new InputError('customer_credentials_required',403)
}
