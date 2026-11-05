import 'server-only'
import {createCipheriv,createDecipheriv,randomBytes} from 'node:crypto'
import {adminClient} from '@/lib/supabase/server'
import {InputError,field} from '@/lib/account-validation'
import {studioSession,ownerWorkspace} from './server'
import {defaultModel} from './models'
const table='studio_provider_credentials'
function encryptionKey(){const key=Buffer.from(process.env.AGYNEXA_CREDENTIAL_ENCRYPTION_KEY||'','base64');if(key.length!==32)throw new InputError('credential_storage_unavailable',503);return key}
export function credentialStorageConfigured(){try{encryptionKey();return true}catch{return false}}
function encrypt(value:string,orgId:string){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',encryptionKey(),iv);cipher.setAAD(Buffer.from(orgId));const encrypted=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return [iv,cipher.getAuthTag(),encrypted].map(x=>x.toString('base64')).join('.')}
function decrypt(value:string,orgId:string){try{const [iv,tag,encrypted]=value.split('.').map(x=>Buffer.from(x,'base64'));const decipher=createDecipheriv('aes-256-gcm',encryptionKey(),iv);decipher.setAAD(Buffer.from(orgId));decipher.setAuthTag(tag);return Buffer.concat([decipher.update(encrypted),decipher.final()]).toString('utf8')}catch{throw new InputError('customer_credentials_unavailable',503)}}
export async function customerProviderKey(orgId:string){const {data,error}=await adminClient().from(table).select('encrypted_key').eq('org_id',orgId).maybeSingle();if(error)throw error;return data?decrypt(data.encrypted_key,orgId):null}
export async function customerProviderConfigured(orgId:string){const {data,error}=await adminClient().from(table).select('org_id').eq('org_id',orgId).maybeSingle();if(error)throw error;return !!data&&credentialStorageConfigured()}
async function context(){const session=await studioSession(),workspace=await ownerWorkspace(session);if(!workspace)throw new InputError('workspace_required',409);return {...session,workspace}}
export async function providerStatus(){const {workspace}=await context();return {provider:'openai',configured:await customerProviderConfigured(workspace.id),storageConfigured:credentialStorageConfigured(),chatgptPlanAvailable:false}}
export async function setCustomerProvider(body:Record<string,unknown>){
 if(Object.keys(body).length!==1||!Object.hasOwn(body,'apiKey'))throw new InputError('invalid_input')
 const {workspace,user}=await context(),key=field(body.apiKey,512);if(!/^sk-[A-Za-z0-9_-]{20,500}$/.test(key))throw new InputError('invalid_api_key')
 encryptionKey()
 const response=await fetch(`https://api.openai.com/v1/models/${defaultModel}`,{headers:{Authorization:`Bearer ${key}`},cache:'no-store',redirect:'error',signal:AbortSignal.timeout(12000)})
 await response.body?.cancel();if(!response.ok)throw new InputError(response.status===401||response.status===403?'provider_access_denied':response.status===404?'provider_model_unsupported':'provider_unavailable',400)
 const {error}=await adminClient().from(table).upsert({org_id:workspace.id,created_by:user.id,encrypted_key:encrypt(key,workspace.id),updated_at:new Date().toISOString()},{onConflict:'org_id'});if(error)throw error
 return {provider:'openai',configured:true,storageConfigured:true,billingMode:'customer_api_key',chatgptPlanAvailable:false}
}
export async function removeCustomerProvider(){const {workspace}=await context();const {error}=await adminClient().from(table).delete().eq('org_id',workspace.id);if(error)throw error;return {provider:'openai',configured:false,storageConfigured:credentialStorageConfigured(),billingMode:'platform_trial',chatgptPlanAvailable:false}}
