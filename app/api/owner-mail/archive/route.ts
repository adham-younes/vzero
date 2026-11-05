import {mailEndpoint} from '@/lib/nexa-email/admin'
import {getArchive,settings} from '@/lib/owner-mail/api'
export const runtime='nodejs'
export const maxDuration=60
export async function GET(request:Request){try{const result=await getArchive(request);return result instanceof Response?result:mailEndpoint(async()=>result)}catch(error){return mailEndpoint(async()=>{throw error})}}
export async function PATCH(request:Request){return mailEndpoint(()=>settings(request))}
