import {mailEndpoint} from '@/lib/nexa-email/admin'
import {webhook} from '@/lib/nexa-email/service'
export const runtime='nodejs'
export const maxDuration=30
export async function POST(request:Request){return mailEndpoint(()=>webhook(request))}
