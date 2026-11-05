import {readMutation} from '@/lib/account-validation'
import {json,failure} from '@/lib/supabase/server'
import {providerStatus,setCustomerProvider,removeCustomerProvider} from '@/lib/studio/customer-provider'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(){try{const status=await providerStatus();return json({...status,billingMode:status.configured?'customer_api_key':'platform_trial'})}catch(e){return failure(e)}}
export async function PUT(r:Request){try{return json(await setCustomerProvider(await readMutation(r)))}catch(e){return failure(e)}}
export async function DELETE(r:Request){try{await readMutation(r);return json(await removeCustomerProvider())}catch(e){return failure(e)}}
