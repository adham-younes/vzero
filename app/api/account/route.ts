import {signedIn,json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(){try{
 const {client,user}=await signedIn()
 const {data:profile,error}=await client.from('profiles').select('display_name,created_at').eq('id',user.id).single()
 if(error)throw error
 return json({user:{email:user.email,displayName:profile.display_name},createdAt:profile.created_at})
}catch(error){return failure(error)}}
