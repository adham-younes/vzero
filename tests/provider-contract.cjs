// Targeted provider fault boundary: no network/real credentials.
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),ts=require('typescript'),Module=require('module');const cache={};function load(file){file=path.resolve(file);if(cache[file])return cache[file];const m=new Module(file);m.paths=module.paths;m.require=name=>name==='server-only'?{}:name.startsWith('@/')?load(name.slice(2)+'.ts'):name.startsWith('.')?load(path.resolve(path.dirname(file),name+'.ts')):require(name);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);return cache[file]=m.exports}
const {groqAnswer}=load('lib/studio/provider.ts');process.env.GROQ_API_KEY_2='synthetic-unit-key';const original=global.fetch;let calls=0,bodies=[];
const bad=()=>new Response(JSON.stringify({error:{code:'json_validate_failed',message:'Synthetic invalid generation'}}),{status:400});
const good=()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify({parts:[{kind:'discovery',text:'What outcome do you need?'}],nextQuestion:null,briefDraft:null,support:{propose:false,title:'',details:''}})}}],usage:{prompt_tokens:10,completion_tokens:20}}),{status:200});
(async()=>{try{
 global.fetch=async(_url,init)=>{calls++;bodies.push(JSON.parse(init.body));return calls===1?bad():good()};
 const result=await groqAnswer('openai/gpt-oss-20b',[],new AbortController().signal,[],true);
 assert.equal(calls,2);assert.equal(bodies[0].max_completion_tokens,65536);assert.deepEqual(bodies[0],bodies[1]);assert.equal(result.answer.parts[0].basis,'suggestion');assert.deepEqual(result.answer.parts[0].citationChunkIds,[]);
 calls=0;global.fetch=async()=>{calls++;return bad()};await assert.rejects(()=>groqAnswer('openai/gpt-oss-20b',[],new AbortController().signal,[],true),e=>e.code==='invalid_model_output');assert.equal(calls,2);
 calls=0;global.fetch=async()=>{calls++;return new Response('{}',{status:401})};await assert.rejects(()=>groqAnswer('openai/gpt-oss-20b',[],new AbortController().signal,[],true),e=>e.code==='provider_access_denied');assert.equal(calls,1);
 console.log('Provider invalid-generation retry, unchanged schema/max allowance, canonical fields and non-retried auth failure PASS')
 }finally{global.fetch=original}})().catch(e=>{console.error(e);process.exit(1)})
