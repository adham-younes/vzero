// Meaningful pure contract tests; run once with the integrated release candidate.
const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),Module=require('node:module'),path=require('node:path')
const cache={};function load(file){file=path.resolve(file);if(cache[file])return cache[file];const m=new Module(file);m.paths=module.paths;m.require=(name)=>name.startsWith('.')?load(path.resolve(path.dirname(file),name+'.ts')):require(name);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);return cache[file]=m.exports}
const {buildRetrievalQuery,normalizeSearch,boundTurns}=load('lib/studio/conversation.ts')
const {validateChatResponse}=load('lib/studio/chat-contract.ts')
assert.equal(normalizeSearch('وTypeScript 2عربي'),'و typescript 2 عربي')
assert.match(buildRetrievalQuery('كرر القائمة السابقة',[{userText:'What TypeScript tools?'}]).historyQuery,/typescript/)
assert.equal(buildRetrievalQuery('this is a deliberately long unrelated question with more than twelve separate tokens about a completely different topic',[]).continuation,false)
assert.equal(boundTurns(Array.from({length:10},(_,i)=>({userText:String(i),assistantParts:[{text:'answer'}]}))).length,6)
assert.equal(boundTurns([{userText:'x'.repeat(18001),assistantParts:[]}]).length,0)
const raw={parts:[{kind:'discovery',text:'What result do you need?',basis:'suggestion',citationChunkIds:[]}],nextQuestion:null,briefDraft:null,support:{propose:false,title:'',details:''}}
assert.equal(validateChatResponse(raw,{customer:true,support:true},[]).parts[0].kind,'discovery')
assert.throws(()=>validateChatResponse(raw,{customer:false,support:false},[]),/invalid_model_output/)
assert.throws(()=>validateChatResponse({...raw,parts:[{kind:'grounded',text:'14 days',basis:'approved_sources',citationChunkIds:['forged']}]},{customer:true,support:false},[]),/invalid_model_output/)
assert.throws(()=>validateChatResponse({...raw,parts:[{kind:'draft',text:'14 days',basis:'approved_sources',citationChunkIds:[]}]},{customer:true,support:false},[]),/invalid_model_output/)
assert.throws(()=>validateChatResponse({...raw,support:{propose:true,title:'test',details:'test'}},{customer:true,support:false},[]),/invalid_model_output/)
assert.throws(()=>validateChatResponse({...raw,briefDraft:{problem:'source excerpt'}},{customer:true,support:true},[]),/invalid_model_output/)
console.log('11 launch context/schema policy assertions passed')
