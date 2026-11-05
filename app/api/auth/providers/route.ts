import {json} from '@/lib/supabase/server'
import {chatGPTProvider} from '@/lib/auth/chatgpt'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(){return json({chatgpt:chatGPTProvider()})}
