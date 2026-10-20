import {readMutation,InputError} from '@/lib/account-validation'
import {sessionClient,json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export async function POST(request:Request){try{
 await readMutation(request);const client=await sessionClient();const {error}=await client.auth.signOut({scope:'local'})
 if(error)throw new InputError('temporarily_unavailable',503)
 return json({ok:true})
}catch(error){return failure(error)}}
