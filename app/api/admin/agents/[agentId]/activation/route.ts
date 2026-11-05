import {readMutation,field,InputError} from '@/lib/account-validation'
import {json,failure,adminClient} from '@/lib/supabase/server'
import {studioSession} from '@/lib/studio/server'
import {agentId} from '@/lib/studio/validation'
import {customerProviderConfigured} from '@/lib/studio/customer-provider'
export const runtime='nodejs'
export const dynamic='force-dynamic'
// Deliberate human activation after the email agreement. Workspace owners cannot approve themselves.
export async function POST(r:Request,c:{params:Promise<{agentId:string}>}){try{
 const b=await readMutation(r),session=await studioSession()
 const ids=(process.env.AGYNEXA_ACTIVATION_ADMIN_USER_IDS||process.env.NEXA_MAIL_ADMIN_USER_IDS||'').split(',').map(x=>x.trim())
 if(!ids.includes(session.user.id))throw new InputError('not_found',404)
 if(Object.keys(b).some(k=>!['status','agreementReference'].includes(k))||!['active','requested'].includes(String(b.status)))throw new InputError('invalid_input')
 const reference=field(b.agreementReference,200),id=agentId((await c.params).agentId),db=adminClient()
 const {data:a,error}=await db.from('agent_activations').select('id,org_id').eq('agent_id',id).maybeSingle();if(error)throw error;if(!a)throw new InputError('not_found',404)
 if(b.status==='active'&&!await customerProviderConfigured(a.org_id))throw new InputError('customer_credentials_required',409)
 const {error:update}=await db.from('agent_activations').update({status:b.status,agreement_reference:reference,activated_by:session.user.id,activated_at:b.status==='active'?new Date().toISOString():null}).eq('id',a.id);if(update)throw update
 return json({status:b.status})
}catch(e){return failure(e)}}
