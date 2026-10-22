import {mailEndpoint} from '@/lib/nexa-email/admin'
import {editDraft} from '@/lib/nexa-email/service'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export const maxDuration=30
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){return mailEndpoint(async()=>editDraft(request,(await context.params).id))}
