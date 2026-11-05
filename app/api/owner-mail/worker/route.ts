import {mailEndpoint} from '@/lib/nexa-email/admin'
import {requireToken} from '@/lib/owner-mail/io'
import {processJob,checkResponder} from '@/lib/owner-mail/service'
export const runtime='nodejs'
export const maxDuration=60
export async function POST(request:Request){return mailEndpoint(async()=>{requireToken(request,'OWNER_MAIL_WORKER_TOKEN');return processJob()})}
export async function GET(request:Request){return mailEndpoint(async()=>{requireToken(request,'OWNER_MAIL_WORKER_TOKEN');return checkResponder()})}
