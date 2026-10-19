import assert from 'node:assert/strict'
const base=process.argv[2]||'http://localhost:3011'
let checks=0
async function get(path){const r=await fetch(base+path);assert.equal(r.status,200,path);checks++;return r}
for(const path of ['/','/ar','/industries','/ar/industries','/services','/ar/services/enterprise-knowledge','/solutions/procurement','/start','/ar/start','/integrations','/architecture','/security','/resources','/about','/methodology']){
 const text=await (await get(path)).text();assert.match(text,/<h1[ >]/);const ar=path==='/ar'||path.startsWith('/ar/');assert.match(text,new RegExp(`<html[^>]*lang="${ar?'ar':'en'}"[^>]*dir="${ar?'rtl':'ltr'}"`));assert.match(text,/<link[^>]*rel="canonical"/);assert.match(text,/hrefLang="ar"/i)
}
const catalog=await(await get('/api/v1/catalog/services?lang=ar')).json();assert.equal(catalog.services.length,10);assert.ok(catalog.services.every(s=>s.url.startsWith('/ar/')))
const endpoint=base+'/api/v1/procurement/review'
const send=(body,headers={})=>fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...headers},body})
let r=await send(JSON.stringify({quantity:12,budget:15000,warrantyMonths:null}));assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal((await r.json()).status,'CLARIFICATION_REQUIRED');checks++
r=await send(JSON.stringify({quantity:12,budget:15000,warrantyMonths:24}));assert.equal(r.status,200);assert.equal((await r.json()).status,'READY_FOR_HUMAN_REVIEW');checks++
for(const [body,headers,code] of [['{',{},400],[JSON.stringify({quantity:-1,budget:100,warrantyMonths:null}),{},400],[' '.repeat(2050),{},413],['{}',{'Content-Type':'text/plain'},415],['{}',{'Origin':'https://unrelated.invalid'},403]]){r=await send(body,headers);assert.equal(r.status,code);checks++}
assert.equal((await fetch(base+'/api/v1/procurement/review')).status,405);checks++
assert.equal((await fetch(base+'/api/v1/catalog/services?lang=xx')).status,400);checks++
assert.equal((await fetch(base+'/ar/not-a-real-page')).status,404);checks++
const sitemap=await(await get('/sitemap.xml')).text();assert.equal((sitemap.match(/<url>/g)||[]).length,64);assert.match(sitemap,/hreflang="ar"/)
assert.match(await(await get('/robots.txt')).text(),/Disallow: \/api\//)
console.log(JSON.stringify({base,checks,result:'PASS',pages:15,localizedUrls:64}))
