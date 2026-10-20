import {readMutation,InputError} from '@/lib/account-validation'
import {json,failure} from '@/lib/supabase/server'
import {studioSession,ownerWorkspace} from '@/lib/studio/server'
export const runtime='nodejs'
export async function POST(request:Request){try{
 const body=await readMutation(request)
 if(Object.keys(body).length)throw new InputError('invalid_input')
 const session=await studioSession()
 const {error}=await session.client.rpc('initialize_workspace')
 if(error)throw error
 return json({workspace:await ownerWorkspace(session)})
}catch(error){return failure(error)}}
