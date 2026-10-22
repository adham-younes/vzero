import {mailEndpoint} from '@/lib/nexa-email/admin'
import {activityFeed} from '@/lib/nexa-email/activity'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=30
export async function GET(request:Request){return mailEndpoint(()=>activityFeed(request))}
