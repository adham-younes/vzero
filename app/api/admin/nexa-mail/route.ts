import {mailEndpoint} from '@/lib/nexa-email/admin'
import {overview} from '@/lib/nexa-email/service'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=30
export async function GET(request:Request){return mailEndpoint(async()=>overview(request))}
