import {mailAuthorizationMetadata} from '@/lib/owner-mail/oauth'
import {requireConsole} from '@/lib/owner-mail/console'
export const dynamic='force-dynamic'
export async function GET(){try{await requireConsole();return Response.json(mailAuthorizationMetadata(),{headers:{'Cache-Control':'no-store'}})}catch{return new Response('Not found',{status:404})}}
