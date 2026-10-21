import {readMutation,InputError} from '@/lib/account-validation'
import {json,failure} from '@/lib/supabase/server'
import {studioSession} from '@/lib/studio/server'
import {ensureCustomerAssistant} from '@/lib/studio/customer-entry'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function POST(request:Request){try{const b=await readMutation(request);if(Object.keys(b).some(k=>k!=='locale')||!['en','ar'].includes(String(b.locale)))throw new InputError('invalid_input');return json(await ensureCustomerAssistant(await studioSession(),b.locale as 'en'|'ar'))}catch(e){return failure(e)}}
