import {mailEndpoint} from '@/lib/nexa-email/admin'
import {webhook} from '@/lib/nexa-email/service'
import {ownerWebhook} from '@/lib/owner-mail/service'
export const runtime='nodejs'
export const maxDuration=60
export async function POST(request:Request){return mailEndpoint(()=>process.env.OWNER_MAIL_ENABLED==='true'?ownerWebhook(request):webhook(request))}
