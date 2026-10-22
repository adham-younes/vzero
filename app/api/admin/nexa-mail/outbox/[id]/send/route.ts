import {mailEndpoint} from '@/lib/nexa-email/admin'
import {dispatch} from '@/lib/nexa-email/service'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=30
export async function POST(request:Request,context:{params:Promise<{id:string}>}){return mailEndpoint(async()=>dispatch(request,(await context.params).id))}
