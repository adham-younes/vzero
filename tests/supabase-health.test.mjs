import test from 'node:test'
import assert from 'node:assert/strict'
import {checkSupabaseConnection} from '../lib/supabase-health.ts'

const config = {url: 'https://xsyxvswbiptbyxyqhdim.supabase.co', publishableKey: 'sb_publishable_test', secretKey: 'sb_secret_test'}

test('authenticates both keys with read-only requests to the selected project', async () => {
 const calls=[]
 const ok=await checkSupabaseConnection(config, async (url, options) => {
  calls.push({url: String(url), options})
  // Model the observed provider restriction: public keys cannot read REST's root.
  const denied = String(url).endsWith('/rest/v1/') && options.headers.apikey === config.publishableKey
  return new Response('{}', {status:denied ? 401 : 200})
 })
 assert.equal(ok.status,'ok')
 assert.equal(calls.length,2)
 assert.deepEqual(calls.map(c=>c.options.headers.apikey),[config.publishableKey,config.secretKey])
 assert.deepEqual(calls.map(c=>c.url),[config.url+'/auth/v1/settings',config.url+'/rest/v1/'])
 for(const c of calls){assert.equal(c.options.method,'GET');assert.equal(c.options.redirect,'error');assert.equal(c.options.body,undefined)}
})
test('refuses wrong project without a network call', async()=>{
 const network=()=>{throw new Error('Unexpected request')}
 for(const c of [{}, {...config,url:'https://other.supabase.co'}, {...config,url:config.url+'@example.com'}, {...config,url:config.url+'?redirect=elsewhere'}, {...config,url:'http://xsyxvswbiptbyxyqhdim.supabase.co'}]) assert.equal((await checkSupabaseConnection(c,network)).status,'unavailable')
})
test('does not report success when either credential is rejected',async()=>{
 for(const rejected of [config.publishableKey,config.secretKey])assert.equal((await checkSupabaseConnection(config,async (_,o)=>new Response('private error details',{status:o.headers.apikey===rejected?401:200}))).status,'unavailable')
})
test('network and timeout failures produce no sensitive error output',async()=>{
 const result=await checkSupabaseConnection(config,async()=>{throw new Error('private provider details')});assert.equal(result.checks.secretKey,'unreachable');assert.equal(JSON.stringify(result).includes('private'),false)
})

test('reports safe diagnostic codes without leaking configuration values',async()=>{
 const result=await checkSupabaseConnection({...config,publishableKey:'wrong',secretKey:''})
 assert.deepEqual(result,{status:'unavailable',checks:{project:'ok',publishableKey:'invalid_format',secretKey:'missing'}})
 assert.equal(JSON.stringify(result).includes(config.url),false)
})

test('can distinguish one missing key from the other valid credential',async()=>{
 const result=await checkSupabaseConnection({...config,secretKey:''},async()=>new Response('{}',{status:200}))
 assert.deepEqual(result.checks,{project:'ok',publishableKey:'ok',secretKey:'missing'})
})
