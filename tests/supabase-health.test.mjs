import test from 'node:test'
import assert from 'node:assert/strict'
import {checkSupabaseConnection} from '../lib/supabase-health.ts'

const config = {url: 'https://xsyxvswbiptbyxyqhdim.supabase.co', publishableKey: 'sb_publishable_test', secretKey: 'sb_secret_test'}

test('authenticates both keys with read-only requests to the selected project', async () => {
 const calls=[]
 const ok=await checkSupabaseConnection(config, async (url, options) => {
  calls.push({url: String(url), options})
  return new Response('{}', {status:200})
 })
 assert.equal(ok,true)
 assert.equal(calls.length,2)
 assert.deepEqual(calls.map(c=>c.options.headers.apikey),[config.publishableKey,config.secretKey])
 for(const c of calls){assert.equal(c.url,config.url+'/rest/v1/');assert.equal(c.options.method,'GET');assert.equal(c.options.redirect,'error');assert.equal(c.options.body,undefined)}
})
test('refuses missing keys and wrong project without a network call', async()=>{
 const network=()=>{throw new Error('Unexpected request')}
 for(const c of [{}, {...config,secretKey:''}, {...config,url:'https://other.supabase.co'}, {...config,url:config.url+'@example.com'}, {...config,url:config.url+'?redirect=elsewhere'}, {...config,url:'http://xsyxvswbiptbyxyqhdim.supabase.co'}, {...config,publishableKey:'legacy'}]) assert.equal(await checkSupabaseConnection(c,network),false)
})
test('does not report success when either credential is rejected',async()=>{
 for(const rejected of [config.publishableKey,config.secretKey])assert.equal(await checkSupabaseConnection(config,async (_,o)=>new Response('private error details',{status:o.headers.apikey===rejected?401:200})),false)
})
test('network and timeout failures produce no sensitive error output',async()=>{
 assert.equal(await checkSupabaseConnection(config,async()=>{throw new Error('private provider details')}),false)
})
