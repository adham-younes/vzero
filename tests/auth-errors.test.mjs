import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {resolve} from 'node:path'
import ts from 'typescript'

const require = createRequire(import.meta.url)
// Exercise the real handlers with only the external Auth/DB and Next cookie
// boundaries replaced. No credentials, network calls or test accounts are used.
function handlers(result) {
 const cache = new Map()
 const client = {auth:{getUser:async()=>result,signInWithPassword:async()=>result},
  rpc:async()=>({data:true,error:null})}
 const env = {...process.env,NEXT_PUBLIC_SUPABASE_URL:'https://xsyxvswbiptbyxyqhdim.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'test-public',SUPABASE_SECRET_KEY:'test-secret',AGYNEXA_DATA_ENV:''}
 function load(file) {
  if(cache.has(file))return cache.get(file).exports
  const module={exports:{}};cache.set(file,module)
  const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
  const dependency=name=>{
   if(name==='server-only')return {}
   if(name==='next/headers')return {cookies:async()=>({getAll:()=>[],set:()=>{}})}
   if(name==='@supabase/ssr')return {createServerClient:()=>client}
   if(name==='@supabase/supabase-js')return {createClient:()=>client}
   if(name.startsWith('@/'))return load(resolve(name.slice(2)+'.ts'))
   return require(name)
  }
  new Function('require','module','exports','process',code)(dependency,module,module.exports,{env})
  return module.exports
 }
 const server=load(resolve('lib/supabase/server.ts'))
 const login=load(resolve('app/api/auth/login/route.ts'))
 return {
  session:async()=>{try{await server.signedIn();return server.json({ok:true})}catch(e){return server.failure(e)}},
  login:()=>login.POST(new Request('https://agynexa.test/api/auth/login',{method:'POST',headers:{origin:'https://agynexa.test','content-type':'application/json'},body:JSON.stringify({email:'synthetic@example.com',password:'synthetic password'})})),
 }
}

for(const action of ['session','login']) {
 test(`${action}: an Auth outage is retryable, not a credential rejection`,async()=>{
  for(const error of [{name:'AuthRetryableFetchError',status:0},{name:'AuthApiError',status:503,code:'unexpected_failure'},{name:'AuthUnknownError'}]) {
   const response=await handlers({data:{user:null,session:null},error:{...error,message:'PRIVATE_PROVIDER_DETAIL'}})[action]()
   assert.equal(response.status,503)
   assert.deepEqual(await response.json(),{error:'temporarily_unavailable'})
   assert.match(response.headers.get('cache-control'),/no-store/)
  }
 })
 test(`${action}: upstream rate limiting remains a 429`,async()=>{
  const response=await handlers({data:{user:null,session:null},error:{name:'AuthApiError',status:429,code:'over_request_rate_limit'}})[action]()
  assert.equal(response.status,429);assert.deepEqual(await response.json(),{error:'try_later'})
 })
}
test('missing or revoked sessions still require sign-in',async()=>{
 for(const error of [null,{name:'AuthSessionMissingError',status:400},{name:'AuthApiError',status:400,code:'refresh_token_not_found'}]) {
  const response=await handlers({data:{user:null},error}).session()
  assert.equal(response.status,401);assert.deepEqual(await response.json(),{error:'sign_in_required'})
 }
})
test('invalid credentials remain generic and a successful login still works',async()=>{
 const denied=await handlers({data:{session:null},error:{name:'AuthApiError',status:400,code:'invalid_credentials'}}).login()
 assert.equal(denied.status,401);assert.deepEqual(await denied.json(),{error:'invalid_credentials'})
 const accepted=await handlers({data:{session:{},user:{id:'synthetic'}},error:null}).login()
 assert.equal(accepted.status,200);assert.deepEqual(await accepted.json(),{ok:true})
})
