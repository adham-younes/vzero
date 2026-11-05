import {beginChatGPT} from '@/lib/auth/chatgpt'
import {InputError} from '@/lib/account-validation'
import {safeAuthReturn} from '@/lib/auth-return'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(r:Request){try{return new Response(null,{status:302,headers:{Location:await beginChatGPT(r),'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}})}catch(e){const input=new URL(r.url),ar=input.searchParams.get('locale')==='ar',code=e instanceof InputError&&e.code.startsWith('chatgpt_')?e.code:'chatgpt_failed',query=new URLSearchParams({error:code,returnTo:safeAuthReturn(input.searchParams.get('returnTo'),ar)});return new Response(null,{status:302,headers:{Location:`https://agynexa.si${ar?'/ar':''}/login?${query}`,'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}})}}
