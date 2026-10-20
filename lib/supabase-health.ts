// Server-side, read-only probe. Return diagnostic codes, never keys or provider bodies.
export type SupabaseHealthConfig = {url?: string; publishableKey?: string; secretKey?: string}
const projectHost = 'xsyxvswbiptbyxyqhdim.supabase.co'
type KeyStatus = 'ok' | 'missing' | 'invalid_format' | 'rejected' | 'unreachable' | 'not_checked'
export type SupabaseHealthResult = {
 status: 'ok' | 'unavailable'
 checks: {project: 'ok' | 'missing' | 'invalid'; publishableKey: KeyStatus; secretKey: KeyStatus}
}

export async function checkSupabaseConnection(config: SupabaseHealthConfig, request: typeof fetch = fetch): Promise<SupabaseHealthResult> {
 const result: SupabaseHealthResult = {status: 'unavailable', checks: {
  project: config.url?.trim() ? 'invalid' : 'missing',
  publishableKey: config.publishableKey?.trim() ? 'not_checked' : 'missing',
  secretKey: config.secretKey?.trim() ? 'not_checked' : 'missing',
 }}
 let url: URL
 try { url = new URL(config.url?.trim() || '') } catch { return result }
 // Pin the owner-selected project: never probe a different account by mistake.
 if (url.protocol !== 'https:' || url.hostname !== projectHost || url.port || url.username || url.password || url.search || url.hash || url.pathname !== '/') return result
 result.checks.project = 'ok'
 await Promise.all((['publishableKey', 'secretKey'] as const).map(async name => {
  const key = config[name]?.trim()
  if (!key) return
  if (!key.startsWith(name === 'publishableKey' ? 'sb_publishable_' : 'sb_secret_')) {
   result.checks[name] = 'invalid_format'
   return
  }
  try {
   // REST's OpenAPI root requires a secret key. Check the public key against
   // Auth's read-only settings endpoint, which accepts publishable credentials.
   const isPublic = name === 'publishableKey'
   const response = await request(new URL(isPublic ? '/auth/v1/settings' : '/rest/v1/', url), {
    method: 'GET', headers: {apikey: key, Accept: isPublic ? 'application/json' : 'application/openapi+json'},
    redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(5000),
   })
   await response.body?.cancel()
   result.checks[name] = response.status === 200 ? 'ok' : 'rejected'
  } catch { result.checks[name] = 'unreachable' }
 }))
 if (result.checks.publishableKey === 'ok' && result.checks.secretKey === 'ok') result.status = 'ok'
 return result
}
