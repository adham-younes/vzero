import {mailEndpoint} from '@/lib/nexa-email/admin'
import {threadDetail,updateThread} from '@/lib/nexa-email/service'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(request:Request,context:{params:Promise<{id:string}>}){return mailEndpoint(async()=>threadDetail(request,(await context.params).id))}
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){return mailEndpoint(async()=>updateThread(request,(await context.params).id))}
