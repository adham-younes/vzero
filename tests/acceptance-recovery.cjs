// Captured-response component render + actual parent callback; no DB/browser/model.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),Module=require('node:module');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const out='docs/launch/2026-10-22/evidence/remaining-acceptance/recovery-ui.json',checks=[];
const source=ts.createSourceFile('studio-agent.tsx',fs.readFileSync('@components/studio-agent.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const controls=[];function visit(n){if(ts.isJsxSelfClosingElement(n)&&n.tagName.getText(source)==='MissingEvidenceRecovery')controls.push(n);ts.forEachChild(n,visit)}visit(source);
assert.equal(controls.length,1,'The captured missing-evidence reply needs exactly one contextual recovery control outside the parts loop');
const attributes=controls[0].attributes.properties;
const attr=name=>attributes.find(a=>a.name?.text===name)?.initializer?.expression;
assert.equal(attr('customer').getText(source),'customer');assert.equal(attr('run').getText(source),'run');assert.equal(attr('disabled').getText(source),'busy||!!running.length');
const callback=attr('onOpenSources');assert.ok(callback&&ts.isArrowFunction(callback));
// Execute the exact callback from the production parent, not a test-only substitute.
let selectedTab='test',writes=0;global.fetch=()=>{writes++;throw Error('Recovery must not fetch/write')};
const onOpenSources=new Function('setTab','return ('+ts.transpileModule(callback.getText(source),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText.replace(/;\s*$/,'')+')')(value=>{selectedTab=value});
const cache={};function load(file){file=path.resolve(file);if(cache[file])return cache[file];const m=new Module(file);m.paths=module.paths;m.require=id=>id.startsWith('@/')?load(resolve(id.slice(2))):id.startsWith('.')?load(resolve(path.resolve(path.dirname(file),id))):require(id);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);cache[file]=m.exports;return m.exports}
function resolve(file){for(const candidate of [file,file+'.tsx',file+'.ts'])if(fs.existsSync(candidate))return candidate;throw Error('Missing test dependency')}
const {MissingEvidenceRecovery}=load('@components/studio-evidence-recovery.tsx');
const captured={id:'synthetic-run',status:'succeeded',historyState:'available',chat:{schemaVersion:2,parts:[{kind:'grounded',text:'Unopened verification widgets may be returned within 13 days with a receipt.',basis:'approved_sources',citations:[{sourceId:'synthetic-source',title:'SYNTHETIC semantic evidence',quote:'SYNTHETIC FACTS: Unopened verification widgets may be returned within 13 days with a receipt. Eligibility for opened items is not stated.'}]},{kind:'missing_evidence',text:'The provided source does not state a return window for opened items. Therefore, I cannot confirm that opened items can be returned within 77 days based on the current approved text.',basis:'suggestion',citations:[]}],nextQuestion:null,briefDraft:null}};
const originalSnapshot=JSON.stringify(captured);
const props={customer:true,run:captured,ar:false,onOpenSources};
const html=renderToStaticMarkup(React.createElement(MissingEvidenceRecovery,props));
assert.match(html,/source owner/);assert.match(html,/authorized/);assert.match(html,/nothing is added or shared automatically/i);assert.equal((html.match(/<button/g)||[]).length,1);
assert.equal(selectedTab,'test');assert.equal(writes,0);checks.push('Reconstructed13-day/missing-opened-policy response with test-null question renders one EN source-owner/approved-text recovery, without automatic navigation or writes');
const ar=renderToStaticMarkup(React.createElement(MissingEvidenceRecovery,{...props,ar:true}));assert.match(ar,/مسؤول المصدر/);assert.match(ar,/مراجعة مصدر معتمد/);checks.push('Arabic recovery explains authorized text/source-owner path using existing design');
if(process.env.RECOVERY_COPY_ONLY==='1'){
 assert.match(html,/The missing point needs current approved text\./);assert.match(ar,/المعلومة الناقصة تحتاج نصًا معتمدًا ومحدّثًا\./);
 const previous=JSON.parse(fs.readFileSync(out,'utf8'));previous.renderedHTML={en:html,ar};previous.copyVerification={status:'PASS',scope:'Only affected EN/AR copy rendered after first-sentence precision edit; earlier14 behavior/exclusion/wiring checks retained without rerun.',checks:['EN first sentence scopes missing point, not the valid grounded answer','AR first sentence scopes missing point, not the valid grounded answer']};fs.writeFileSync(out,JSON.stringify(previous,null,2)+'\n');console.log(JSON.stringify(previous.copyVerification));process.exit(0)
}
const repeated={...captured,chat:{...captured.chat,parts:[...captured.chat.parts,{kind:'missing_evidence',text:'Another unknown.',basis:'suggestion',citations:[]}]}};
assert.equal((renderToStaticMarkup(React.createElement(MissingEvidenceRecovery,{...props,run:repeated})).match(/<button/g)||[]).length,1);checks.push('Multiple missing-evidence parts still produce only one recovery per answer');
for(const [name,overrides] of [
 ['grounded only',{run:{...captured,chat:{...captured.chat,parts:[captured.chat.parts[0]]}}}],
 ['strict assistant',{customer:false}],
 ['knowledge changed',{run:{...captured,historyState:'knowledge_changed'}}],
 ['expired',{run:{...captured,historyState:'expired'}}],
 ['failed',{run:{...captured,status:'failed'}}],
 ['cancelled',{run:{...captured,status:'cancelled'}}],
 ['legacy response',{run:{...captured,chat:undefined}}],
 ['non-v2 response',{run:{...captured,chat:{...captured.chat,schemaVersion:1}}}],
]){assert.equal(renderToStaticMarkup(React.createElement(MissingEvidenceRecovery,{...props,...overrides})), '',name);checks.push('No recovery for '+name)}
// Evaluate component JSX callback as a user decision, while keeping production Button.
const tree=MissingEvidenceRecovery(props);const button=React.Children.toArray(tree.props.children).find(child=>child?.props?.onClick);
assert.ok(button);assert.equal(button.props.type,'button');button.props.onClick();assert.equal(selectedTab,'knowledge');assert.equal(writes,0);
checks.push('Actual rendered control invokes exact StudioAgent callback -> existing knowledge tab; zero fetches/writes and no form submit');
const disabledHTML=renderToStaticMarkup(React.createElement(MissingEvidenceRecovery,{...props,disabled:true}));assert.match(disabledHTML,/<button[^>]*disabled/);checks.push('Control is disabled by actual parent busy/running wiring');
assert.equal(JSON.stringify(captured),originalSnapshot);assert.equal(captured.chat.nextQuestion,null);assert.equal(captured.chat.parts[0].text,'Unopened verification widgets may be returned within 13 days with a receipt.');checks.push('Original typed facts/citation input and nullable nextQuestion are unchanged');
const result={status:'PASS',environment:'Real React server rendering of recovery component; actual parent JSX callback extracted and executed with observed setTab/fetch. No DB, browser, stack or model.',fixtureProvenance:'Reconstructed typed parts from safe fourth production rendered text, synthetic IDs/citation excerpt and null nextQuestion as a test input. This is NOT a captured raw fourth server response; its raw nextQuestion was not captured.',renderedHTML:{en:html,ar},checks,limitations:['No live production/browser interaction or end-to-end source submission tested in this focused check.','Existing source editor behavior remains covered by earlier real browser acceptance; this test proves only contextual rendering and direct tab callback.','The model response usefulness gap remains documented; this UI control provides an explicit human recovery path without changing inference, facts or nullable nextQuestion.']};fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:'PASS',checks}));
