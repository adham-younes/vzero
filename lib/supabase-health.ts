// Server-side, read-only connectivity probe. Never return keys or provider bodies.
export type SupabaseHealthConfig = {
 url?: string
 publishableKey?: string
 secretKey?: string
}
const projectHost = 'xsyxvswbiptbyxyqhdim.supabase.co'

export async function checkSupabaseConnection(config: SupabaseHealthConfig, request: typeof fetch = fetch): Promise<boolean> {
 if (!config.url || !config.publishableKey || !config.secretKey) return false
 let url: URL
 try { url = new URL(config.url) } catch { return false }
 // Pin the owner-selected project: never probe a different account by mistake.
 if (url.protocol !== 'https:' || url.hostname !== projectHost || url.port || url.username || url.password || url.search || url.hash || url.pathname !== '/') return false
 if (!config.publishableKey.startsWith('sb_publishable_') || !config.secretKey.startsWith('sb_secret_')) return false
 try {
  const results = await Promise.all([config.publishableKey, config.secretKey].map(async key => {
   const response = await request(new URL('/rest/v1/', url), {
    method: 'GET', headers: { apikey: key, Accept: 'application/openapi+json' },
    redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(5000),
   })
   // The API root authenticates the key; no rows are read and no data is written.
   await response.body?.cancel()
   return response.status === 200
  }))
  return results.every(Boolean)
 } catch { return false }
}
