import {signedIn,json,failure} from '@/lib/supabase/server'
import {InputError} from '@/lib/account-validation'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(){try{
 const {client,user}=await signedIn()
 const {data:profile,error}=await client.from('profiles').select('display_name,created_at').eq('id',user.id).maybeSingle()
 if(error)throw error
 // RLS hides profiles when a session has been revoked even if its JWT is
 // still unexpired. Ask for authentication instead of reporting an outage.
 if(!profile)throw new InputError('sign_in_required',401)
 return json({user:{email:user.email,displayName:profile.display_name},createdAt:profile.created_at})
}catch(error){return failure(error)}}
