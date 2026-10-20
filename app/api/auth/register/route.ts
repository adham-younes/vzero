import {credentials,field,readMutation,InputError} from '@/lib/account-validation'
import {adminClient,sessionClient,rateLimit,json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export async function POST(request:Request){try{
 const body=await readMutation(request);const input=credentials(body,true);const name=field(body.name,100)
 await rateLimit(request,'register',input.email)
 // Explicit owner policy: create an immediately usable account without email.
 // No roles or organization memberships are accepted from the request.
 const {error}=await adminClient().auth.admin.createUser({...input,email_confirm:true,user_metadata:{display_name:name}})
 if(error)throw new InputError('registration_failed',400)
 const client=await sessionClient();const {data,error:loginError}=await client.auth.signInWithPassword(input)
 if(loginError||!data.session)return json({error:'created_sign_in_required'},503)
 return json({ok:true},201)
}catch(error){return failure(error)}}
