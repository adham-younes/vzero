import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {createRequire} from 'node:module'
import {dirname,resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

// Local-only final delivery checks. Browser interaction and visual inspection
// are separate evidence; these checks protect routes, content and paused work.
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..')
const baseline='c61cc369bfa9f678ed794d71b0f0266423948b8f'
const require=createRequire(import.meta.url),ts=require('typescript')
const git=(...args)=>execFileSync('git',args,{cwd:root,maxBuffer:100*1024*1024})
const read=path=>readFileSync(resolve(root,path))
const before=path=>git('show',`${baseline}:${path}`)
const cache=new Map()
function load(path,old=false){
 const key=`${old}:${path}`
 if(cache.has(key))return cache.get(key)
 if(path.endsWith('.json'))return JSON.parse((old?before(path):read(path)).toString())
 const mod={exports:{}}
 const code=ts.transpileModule((old?before(path):read(path)).toString(),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText
 const localRequire=id=>{
  if(!id.startsWith('.'))return require(id)
  let target=resolve(dirname(resolve(root,path)),id).slice(root.length+1)
  if(!target.endsWith('.json'))target+='.ts'
  return load(target,old)
 }
 new Function('require','module','exports',code)(localRequire,mod,mod.exports)
 cache.set(key,mod.exports)
 return mod.exports
}
const checks=[]
function check(label,fn){fn();checks.push(label)}
const routes=load('lib/site-routes.ts'),oldRoutes=load('lib/site-routes.ts',true)
check('Public paths, canonicals, hreflang and metadata retain the approved contract',()=>{
 assert.deepEqual(routes.sitePaths,oldRoutes.sitePaths)
 for(const path of routes.sitePaths)for(const ar of [false,true]){
  const parts=path.split('/').filter(Boolean)
  assert.deepEqual(routes.pageMetadata(parts,ar),oldRoutes.pageMetadata(parts,ar),path)
 }
})
check('Ten capabilities, nine solutions and ten sectors retain accepted source content',()=>{
 for(const path of ['lib/service-catalog.json','lib/program-pages.json','lib/public-page-copy.json'])assert.ok(read(path).equals(before(path)),path)
 assert.equal(load('lib/service-catalog.json').length,10)
 assert.equal(load('lib/agynexa.ts').solutions.length,9)
 assert.deepEqual(load('lib/agynexa.ts').solutions,load('lib/agynexa.ts',true).solutions)
 assert.equal(load('lib/program-pages.json').industries.sections.length,10)
})
check('Homepage, original Hero/video, application shell entry and dependency versions are preserved',()=>{
 for(const path of ['app/page.tsx','app/layout.tsx','@components/landing-5-hero-section.tsx','@components/landing-5-hero-video.tsx','public/videos/background.mp4','package.json','pnpm-lock.yaml'])assert.ok(read(path).equals(before(path)),path)
})
check('Paused Studio, private routes, runtime, migrations and provider settings have no diff',()=>{
 const paths=git('diff','--name-only',baseline).toString().trim().split('\n').filter(Boolean)
 const forbidden=/^(?:app\/(?:ar\/)?(?:studio|account|admin|login|signup|widget)(?:\/|$)|app\/api\/|lib\/(?:studio|nexa|supabase)|supabase\/|next\.config\.|proxy\.|middleware\.|\.env|\.vercel)/
 for(const path of paths)assert.ok(!forbidden.test(path),path)
})
const base=new URL(process.argv[2]||'http://localhost:3037')
assert.ok(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Local verification only')
const paths=routes.sitePaths.filter(p=>p!=='services/solutions').flatMap(p=>[p?`/${p}`:'/',`/ar${p?'/'+p:''}`])
const pages=new Map()
for(let offset=0;offset<paths.length;offset+=4){
 await Promise.all(paths.slice(offset,offset+4).map(async path=>{
  const response=await fetch(new URL(path,base),{redirect:'manual',signal:AbortSignal.timeout(30000)})
  assert.equal(response.status,200,path)
  const html=await response.text(),ar=path==='/ar'||path.startsWith('/ar/')
  assert.match(html,new RegExp(`<html[^>]+lang="${ar?'ar':'en'}"`),`${path} language`)
  assert.match(html,new RegExp(`<html[^>]+dir="${ar?'rtl':'ltr'}"`),`${path} direction`)
  assert.equal((html.match(/<main\b[^>]*id="main"/g)||[]).length,1,`${path} main`)
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${path} h1`)
  if(path==='/'||path==='/ar'){
   const navigation=html.match(/<nav[^>]*class="desktop-nav"[^>]*>(.*?)<\/nav>/s)?.[1]??''
   const hrefs=[...navigation.matchAll(/href="([^"]+)"/g)].map(match=>match[1])
   const destinations=['solutions','services','industries','architecture','methodology','integrations']
   assert.deepEqual(hrefs,destinations.map(slug=>`${ar?'/ar':''}/${slug}`),`${path} primary navigation`)
  }
  if(['/solutions','/ar/solutions','/services','/ar/services'].includes(path)){
   assert.equal((html.match(/class="catalog-detail"/g)||[]).length,1,`${path} selected detail area`)
   assert.doesNotMatch(html,/<details[^>]*name="(?:solution|capability)-directory"/,`${path} no catalogue-sized disclosures`)
  }
  const ids=[...html.matchAll(/\sid="([^"<>]+)"/g)].map(match=>match[1])
  assert.equal(new Set(ids).size,ids.length,`${path} unique DOM identifiers`)
  const parsed=routes.parseSitePath(path.split('/').filter(Boolean))
  assert.ok(html.includes(routes.pageMetadata(parsed.path,parsed.ar).alternates.canonical),`${path} canonical`)
  pages.set(path,html)
 }))
}
checks.push(`${pages.size} English/Arabic public URLs return 200 with language, direction, main, h1, unique identifiers and canonical`)
checks.push('Both homepages expose all six primary navigation destinations in their locale')
checks.push('Solutions and Capabilities render one selected reading area in each locale')
let links=0,anchors=0
for(const [path,html] of pages){
 for(const match of html.matchAll(/\shref="([^"<>]+)"/g)){
  const href=match[1].replaceAll('&amp;','&'),url=new URL(href,new URL(path,base))
  if(url.origin!==base.origin||!pages.has(url.pathname))continue
  links++
  if(url.hash){
   const id=decodeURIComponent(url.hash.slice(1)),target=pages.get(url.pathname)
   assert.ok(target.includes(`id="${id}"`),`${path} -> ${url.pathname}${url.hash}`)
   anchors++
  }
 }
}
checks.push(`${links} rendered links to public pages resolve; ${anchors} linked section targets exist`)
for(const path of ['/services/solutions','/ar/services/solutions']){
 const response=await fetch(new URL(path,base),{redirect:'manual'})
 assert.equal(response.status,308,path)
 assert.equal(new URL(response.headers.get('location'),base).pathname,path.replace('/solutions',''),`${path} redirect`)
}
checks.push('Both legacy capability redirects remain 308 to their localized catalogues')
const output=resolve(root,process.argv[4]||'docs/agynexa-program/releases/public-navigation-2026-10-27/evidence/public-contract.json')
mkdirSync(dirname(output),{recursive:true})
const report={date:process.argv[3]||new Date().toISOString().slice(0,10),environment:'local production build; no live credentials',baseline,source:git('rev-parse','HEAD').toString().trim(),base:base.origin,status:'PASS',checks,publicUrls:pages.size,publicLinks:links,sectionAnchors:anchors,productionVerified:false}
writeFileSync(output,JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify(report,null,2))
