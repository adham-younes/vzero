import {checkSupabaseConnection} from '@/lib/supabase-health'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
 const connected = await checkSupabaseConnection({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  secretKey: process.env.SUPABASE_SECRET_KEY,
 })
 return Response.json({status: connected ? 'ok' : 'unavailable'}, {
  status: connected ? 200 : 503,
  headers: {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'},
 })
}
