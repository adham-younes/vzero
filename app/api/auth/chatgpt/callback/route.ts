import {completeChatGPT} from '@/lib/auth/chatgpt'
import {InputError} from '@/lib/account-validation'
import {safeAuthReturn} from '@/lib/auth-return'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(r:Request){try{return new Response(null,{status:302,headers:{Location:`https://agynexa.si${await completeChatGPT(r)}`,'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}})}catch(e){const context=e as {locale?:string;returnTo?:string},ar=context?.locale==='ar',code=e instanceof InputError&&e.code.startsWith('chatgpt_')?e.code:'chatgpt_failed',query=new URLSearchParams({error:code,returnTo:safeAuthReturn(context?.returnTo||null,ar)});return new Response(null,{status:302,headers:{Location:`https://agynexa.si${ar?'/ar':''}/login?${query}`,'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}})}}
