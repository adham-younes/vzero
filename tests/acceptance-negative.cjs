// Only previously missing auth-return/provider-fault contracts; no green suite import.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),Module=require('node:module');
const checks=[];function check(name,test){test();checks.push(name)}
const file=ts.createSourceFile('account-ui.tsx',fs.readFileSync('@components/account-ui.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const fn=file.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name?.text==='safeAuthReturn');assert.ok(fn);
const services=JSON.parse(fs.readFileSync('lib/service-catalog.json','utf8')),solutions=[{slug:'knowledge'}],exportsForReturn={};
new Function('services','solutions','exports',ts.transpileModule(fn.getText(file),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(services,solutions,exportsForReturn);
const safe=exportsForReturn.safeAuthReturn;
check('A4 external/scheme-relative/backslash/encoded destinations cannot redirect outside product',()=>{
 for(const value of ['https://attacker.test/x','//attacker.test/x','/\\attacker.test','/%2f%2fattacker.test','/%5c%5cattacker.test','/other','javascript:alert(1)'])assert.equal(safe(value,false),'/studio',value);
 assert.equal(safe(null,true),'/ar/studio');
});
check('A4 explicit Account/Start/Arabic intent retained and business/unknown query stripped',()=>{
 for(const v of ['/account','/start','/ar/account','/ar/start'])assert.equal(safe(v,false),v);
 assert.equal(safe('/start?service='+services[0].slug+'&solution=knowledge&business=private-draft&next=https://attacker.test',false),'/start?service='+services[0].slug+'&solution=knowledge');
 assert.equal(safe('/start?service=forged&solution=forged',false),'/start');
});
const cache={};function load(name){name=path.resolve(name);if(cache[name])return cache[name];const m=new Module(name);m.paths=module.paths;m.require=id=>id==='server-only'?{}:id.startsWith('@/')?load(id.slice(2)+'.ts'):id.startsWith('.')?load(path.resolve(path.dirname(name),id+'.ts')):require(id);m._compile(ts.transpileModule(fs.readFileSync(name,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,name);cache[name]=m.exports;return m.exports}
process.env.GROQ_API_KEY_2='synthetic-local-only';const {groqAnswer}=load('lib/studio/provider.ts');
const good=()=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({parts:[{kind:'discovery',text:'Which supplied fact should we organize?'}],nextQuestion:null,briefDraft:null,support:{propose:false,title:'',details:''}})},finish_reason:'stop'}]}),{status:200});
const busy=retry=>new Response('{}',{status:429,headers:{'retry-after':String(retry)}});
(async()=>{
 let calls=0;global.fetch=async()=>++calls===1?busy(0):good();await groqAnswer('openai/gpt-oss-20b',[],new AbortController().signal,[],true);assert.equal(calls,2);checks.push('A15 provider429 retry-after0 recovers once without unrestricted fallback');
 calls=0;global.fetch=async()=>{calls++;return busy(0)};await assert.rejects(()=>groqAnswer('openai/gpt-oss-20b',[],new AbortController().signal,[],true),e=>e.code==='provider_rate_limited');assert.equal(calls,2);checks.push('A15 repeated429 stops after bounded second attempt');
 calls=0;global.fetch=async()=>{calls++;return busy(6)};await assert.rejects(()=>groqAnswer('openai/gpt-oss-20b',[],new AbortController().signal,[],true),e=>e.code==='provider_rate_limited');assert.equal(calls,1);checks.push('A15 excessive retry-after rejected immediately');
 const controller=new AbortController();calls=0;global.fetch=async()=>{calls++;return busy(1)};const promise=groqAnswer('openai/gpt-oss-20b',[],controller.signal,[],true);setTimeout(()=>controller.abort(),10);await assert.rejects(()=>promise,e=>e.name==='AbortError');assert.equal(calls,1);checks.push('A15 cancellation interrupts provider backoff before another fetch');
 global.fetch=async(_url,init)=>await new Promise((resolve,reject)=>{if(init.signal.aborted)return reject(new DOMException('Synthetic abort','AbortError'));init.signal.addEventListener('abort',()=>reject(new DOMException('Synthetic abort','AbortError')),{once:true})});const timeoutController=new AbortController();setTimeout(()=>timeoutController.abort(),15);await assert.rejects(()=>groqAnswer('openai/gpt-oss-20b',[],timeoutController.signal,[],true),e=>e.name==='AbortError');checks.push('A15 controlled request timeout aborts in-flight adapter without a generated answer');
 const result={environment:'actual pure application functions and provider adapter; synthetic local transport faults; no paid call',status:'PASS',checks};fs.mkdirSync('docs/launch/2026-10-22/evidence/remaining-acceptance',{recursive:true});fs.writeFileSync('docs/launch/2026-10-22/evidence/remaining-acceptance/pure.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:'PASS',checks}));
})().catch(e=>{console.error(e);process.exitCode=1});
