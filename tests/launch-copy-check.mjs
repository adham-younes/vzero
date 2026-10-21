import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {createRequire} from 'node:module'
import {dirname,resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

// Run once on the final integrated candidate. Static contracts support, but do
// not replace, real browser checks or a human bilingual comprehension review.
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..')
const require=createRequire(import.meta.url)
const ts=require('typescript')
const baseline='f4f573a158a66f200e6055cf530afa3faa2eac9f'
const read=p=>readFileSync(resolve(root,p),'utf8')
const before=p=>execFileSync('git',['show',`${baseline}:${p}`],{cwd:root,encoding:'utf8',maxBuffer:10*1024*1024})
const json=p=>JSON.parse(read(p))
const modules=new Map()
function evaluate(source,path,previous=false){
 const result={exports:{}}
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText
 const localRequire=id=>{
  if(id.startsWith('.')){
   const relative=resolve(dirname(path),id).slice(root.length+1)
   if(id.endsWith('.json'))return JSON.parse(previous?before(relative):read(relative))
   return load(relative+'.ts',previous)
  }
  return require(id)
 }
 new Function('require','module','exports',code)(localRequire,result,result.exports)
 return result.exports
}
function load(path,previous=false){
 const key=`${previous}:${path}`
 if(!modules.has(key))modules.set(key,evaluate(previous?before(path):read(path),resolve(root,path),previous))
 return modules.get(key)
}
let checks=0
function check(label,fn){fn();checks++;console.log(`PASS ${label}`)}
const services=json('lib/service-catalog.json'),pages=json('lib/program-pages.json')
const copy=load('lib/agynexa.ts'),routes=load('lib/site-routes.ts'),legal=load('lib/legal-content.ts').legalContent
const oldServices=JSON.parse(before('lib/service-catalog.json'))
const oldCopy=load('lib/agynexa.ts',true),oldRoutes=load('lib/site-routes.ts',true)
check('ten services and nine solutions keep identifiers, names and order',()=>{
 assert.equal(services.length,10);assert.equal(copy.solutions.length,9)
 assert.deepEqual(services.map(s=>s.slug),oldServices.map(s=>s.slug))
 assert.deepEqual(copy.solutions.map(s=>[s.slug,s.name]),oldCopy.solutions.map(s=>[s.slug,s.name]))
})
check('all ten sector selectors remain, construction stays research only',()=>{
 const old=JSON.parse(before('lib/program-pages.json')).industries.sections
 assert.deepEqual(pages.industries.sections.map(s=>s.title),old.map(s=>s.title))
 assert.equal(pages.industries.sections.length,10)
 assert.equal(new Set(pages.industries.sections.map(s=>s.body[0])).size,10)
 for(const s of pages.industries.sections)for(const field of ['input','output','reviewer'])assert.ok(s[field]?.[0]&&s[field]?.[1],`${s.title[0]} ${field}`)
 assert.ok(!routes.sitePaths.some(p=>/construction/.test(p)))
})
const pairKeys=new Set(['title','intro','body','detailTitle','detailOffer','audience','problem','offer','inputs','controls','metrics','industries','seo','question','answer','input','output','reviewer','flow','accept','name'])
function bilingual(value,path='copy',key=''){
 if(!value||typeof value!=='object')return
 if(Array.isArray(value)&&value.length===2&&value.every(v=>typeof v==='string')&&pairKeys.has(key)){
  assert.ok(value[0].trim()&&value[1].trim(),path)
  assert.match(value[1],/[\u0600-\u06ff]/,`${path} Arabic`)
  if(value[0].includes('12,000'))assert.ok(value[1].includes('12,000'),`${path} byte/character limit parity`)
  return
 }
 for(const [k,v] of Object.entries(value))bilingual(v,`${path}.${k}`,Array.isArray(value)?key:k)
}
check('editable copy has complete English and Arabic pairs',()=>{
 bilingual(pages);bilingual(services);bilingual(copy.solutions);bilingual(legal)
})
check('every service and solution provides concrete task and human boundary',()=>{
 for(const s of services){for(const field of ['detailTitle','detailOffer','audience','problem','inputs','controls','seo'])assert.ok(s[field]?.every(Boolean),`${s.slug}.${field}`);assert.ok(s.outputs.length>=2)}
 for(const s of copy.solutions)for(const field of ['audience','problem','input','flow','output','accept'])assert.ok(s[field]?.every(Boolean),`${s.slug}.${field}`)
 const serviceUI=read('@components/service-catalog.tsx'),solutionUI=read('@components/agynexa-pages.tsx')
 assert.match(serviceUI,/service\.detailTitle/);assert.match(serviceUI,/service\.detailOffer/)
 assert.match(solutionUI,/solution\.audience/);assert.match(solutionUI,/solution\.accept/)
 for(const ui of [serviceUI,solutionUI,read('@components/program-layouts.tsx')])assert.match(ui,/href="\/studio"/)
 assert.match(serviceUI,/Saving a brief|saved brief/i)
 assert.match(serviceUI,/not sent to AGYNEXA/)
 assert.match(serviceUI,/not a claim of an active or certified connection/)
})
check('protected home files, copy, service cards and metadata remain identical',()=>{
 const protectedFiles=['app/page.tsx','app/layout.tsx','app/globals.css','app/[...path]/page.tsx','@components/landing-5-hero-section.tsx','@components/landing-5-hero-video.tsx','@components/agynexa-sections.tsx','@components/agynexa-shell.tsx','@components/system-diagram.tsx','@components/locale-link.tsx','@ui/button.tsx','@ui/dialog.tsx','lib/utils.ts']
 for(const path of protectedFiles)assert.equal(read(path),before(path),path)
 const video='public/videos/background.mp4'
 const original=execFileSync('git',['show',`${baseline}:${video}`],{cwd:root,maxBuffer:100*1024*1024})
 assert.ok(readFileSync(resolve(root,video)).equals(original),'original video')
 assert.deepEqual(copy.nav,oldCopy.nav);assert.deepEqual(copy.summary,oldCopy.summary)
 assert.deepEqual(services.slice(0,4).map(s=>[s.slug,s.title,s.offer]),oldServices.slice(0,4).map(s=>[s.slug,s.title,s.offer]))
 const directory=read('@components/service-directory.tsx')
 assert.match(directory,/compact\?s\.title:s\.detailTitle/)
 assert.match(directory,/compact\?s\.offer:s\.detailOffer/)
 assert.match(directory,/compact\?filtered\.slice\(0,4\):filtered/)
 for(const ar of [false,true])assert.deepEqual(routes.pageMetadata([],ar),oldRoutes.pageMetadata([],ar))
})
check('existing marketing routes remain with two legal route families added',()=>{
 for(const path of oldRoutes.sitePaths)assert.ok(routes.sitePaths.includes(path),path)
 assert.equal(new Set(routes.sitePaths).size,routes.sitePaths.length)
 assert.equal(routes.sitePaths.filter(p=>p!=='services/solutions').length*2,68)
 for(const path of routes.sitePaths){
  for(const ar of [false,true]){
   assert.equal(routes.parseSitePath([...(ar?['ar']:[]),...path.split('/').filter(Boolean)]).valid,true)
   const metadata=routes.pageMetadata(path.split('/').filter(Boolean),ar)
   assert.ok(metadata.title&&metadata.description)
   assert.equal(metadata.alternates.canonical,ar?metadata.alternates.languages.ar:metadata.alternates.languages.en)
   assert.equal(metadata.openGraph.locale,ar?'ar_EG':'en_US')
   assert.equal(metadata.alternates.languages['x-default'],metadata.alternates.languages.en)
  }
 }
})
check('four actual legal page files have localized content and metadata',()=>{
 for(const path of ['privacy','terms'])for(const ar of [false,true]){
  const file=`app/${ar?'ar/':''}${path}/page.tsx`
  assert.ok(existsSync(resolve(root,file)),file)
  const text=read(file)
  assert.match(text,new RegExp(`pageMetadata\\(\\['${path}'\\],${ar}\\)`))
  assert.match(text,new RegExp(`LegalContent kind="${path}" ar${ar?'[ /]':'=\\{false\\}'}`))
  assert.ok(legal[path].sections.length>=6)
 }
 const text=JSON.stringify(legal)
 assert.match(text,/Supabase/);assert.match(text,/Groq/);assert.match(text,/Vercel/)
 assert.match(text,/no promised automatic 90-day purge/i)
 assert.match(text,/password recovery is (not implemented|unavailable)/i)
 assert.match(text,/legal operating identity|legal operator/)
 assert.match(text,/does not send it to AGYNEXA staff/)
 assert.doesNotMatch(text,/\[INSERT|TBD|TODO|guaranteed compliance|registered in Slovenia/i)
})
check('editable route copy avoids unsupported positive commercial proof',()=>{
 const text=JSON.stringify({pages,services:services.map(({title,offer,...route})=>route),solutions:copy.solutions,legal})
 for(const phrase of ['guaranteed ROI','guaranteed ranking','certified integration','trusted by 100','unlimited messages','hallucination-free','SOC 2 certified','GDPR compliant by default'])assert.ok(!text.toLowerCase().includes(phrase.toLowerCase()),phrase)
 assert.match(text,/synthetic/i);assert.match(text,/افتراضي/)
})

// Optional public GET-only route/metadata smoke for the lead's final batch.
if(process.env.AGYNEXA_COPY_BASE_URL){
 const base=new URL(process.env.AGYNEXA_COPY_BASE_URL)
 assert.ok(['http:','https:'].includes(base.protocol))
 const paths=routes.sitePaths.filter(p=>p!=='services/solutions').flatMap(path=>[path?`/${path}`:'/',`/ar${path?'/'+path:''}`])
 let count=0
 for(let offset=0;offset<paths.length;offset+=4){
  await Promise.all(paths.slice(offset,offset+4).map(async path=>{
   const response=await fetch(new URL(path,base),{redirect:'manual',signal:AbortSignal.timeout(20000)})
   assert.equal(response.status,200,path)
   const html=await response.text(),ar=path==='/ar'||path.startsWith('/ar/')
   assert.match(html,new RegExp(`<html[^>]+lang="${ar?'ar':'en'}"`),`${path} language`)
   assert.match(html,new RegExp(`<html[^>]+dir="${ar?'rtl':'ltr'}"`),`${path} direction`)
   const parsed=routes.parseSitePath(path.split('/').filter(Boolean)),metadata=routes.pageMetadata(parsed.path,parsed.ar)
   assert.ok(html.includes(metadata.alternates.canonical),`${path} canonical`)
   assert.ok(html.includes(metadata.title),`${path} title`)
   assert.ok(!/<h1[^>]*>\s*404\s*<\/h1>/.test(html),`${path} not branded 404`)
   count++
  }))
 }
 console.log(`PASS public route smoke ${count}/${paths.length}`)
}else console.log('NOT VERIFIED live HTTP/metadata smoke (set AGYNEXA_COPY_BASE_URL in final batch)')
console.log(`Copy contracts: ${checks} groups passed. Browser rendering and human comprehension remain separate gates.`)
