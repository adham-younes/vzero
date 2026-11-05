import {beginChatGPT} from '@/lib/auth/chatgpt'
import {InputError} from '@/lib/account-validation'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(r:Request){try{return new Response(null,{status:302,headers:{Location:await beginChatGPT(r),'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}})}catch(e){const locale=new URL(r.url).searchParams.get('locale')==='ar'?'/ar':'',code=e instanceof InputError&&e.code.startsWith('chatgpt_')?e.code:'chatgpt_failed';return new Response(null,{status:302,headers:{Location:`https://agynexa.si${locale}/login?error=${code}`,'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}})}}
