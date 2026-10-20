import 'server-only'
import {signedIn} from '@/lib/supabase/server'
import {InputError} from '@/lib/account-validation'
export const agentFields='id,org_id,name,template,instructions,language,model,revision,created_at,updated_at'
export function studioEnabled(){return process.env.AGYNEXA_STUDIO_ENABLED!=='false'}
export async function studioSession(){
 if(!studioEnabled())throw new InputError('studio_unavailable',503)
 const session=await signedIn()
 // Live-session RLS is enforced independently of Auth's JWT validity.
 const {data,error}=await session.client.from('profiles').select('id').eq('id',session.user.id).maybeSingle()
 if(error)throw error
 if(!data)throw new InputError('sign_in_required',401)
 return session
}
export async function ownerWorkspace(session:Awaited<ReturnType<typeof studioSession>>){
 const {data:membership,error}=await session.client.from('memberships').select('org_id,role').eq('user_id',session.user.id).eq('role','owner').maybeSingle()
 if(error)throw error
 if(!membership)return null
 const {data,error:orgError}=await session.client.from('organizations').select('id,name').eq('id',membership.org_id).single()
 if(orgError)throw orgError
 return data as {id:string;name:string}
}
