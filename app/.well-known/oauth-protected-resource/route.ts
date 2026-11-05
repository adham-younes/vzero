import {mailResourceMetadata} from '@/lib/owner-mail/oauth'
import {requireConsole} from '@/lib/owner-mail/console'
export const dynamic='force-dynamic'
export async function GET(){try{await requireConsole();return Response.json(mailResourceMetadata(),{headers:{'Cache-Control':'no-store'}})}catch{return new Response('Not found',{status:404})}}
