import {mailEndpoint} from '@/lib/nexa-email/admin'
import {createDraft} from '@/lib/nexa-email/service'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=30
export async function POST(request:Request){return mailEndpoint(async()=>createDraft(request))}
