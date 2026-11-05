import type {Metadata} from 'next'
import publicCopy from './public-page-copy.json'
import {headings,solutions,summary} from './agynexa'
import services from './service-catalog.json'
import pages from './program-pages.json'
import {platformFaq} from './platform-content'

export const siteUrl='https://agynexa.si'
export const sitePaths=['',...Object.keys(headings),...solutions.map(s=>`solutions/${s.slug}`),...services.map(s=>`services/${s.slug}`),'services/solutions','privacy','terms']

export function parseSitePath(parts:string[]){
 const ar=parts[0]==='ar'
 const path=ar?parts.slice(1):parts
 return {ar,path,valid:sitePaths.includes(path.join('/'))}
}

export function pageCopy(path:string[],ar:boolean){
 const reviewed=(publicCopy as Record<string,{en:{title:string;description:string};ar:{title:string;description:string}}>)[`/${path.join('/')}`]
 if(reviewed)return reviewed[ar?'ar':'en']
 const i=ar?1:0
 const service=path[0]==='services'?services.find(s=>s.slug===path[1]):undefined
 const solution=path[0]==='solutions'?solutions.find(s=>s.slug===path[1]):undefined
 const program=pages[path[0] as keyof typeof pages]
 return {title:service?.detailTitle[i]||solution?.name[i]||program?.title[i]||headings[path[0]]?.[i]||(ar?'AGYNEXA — منصة بناء وكلاء الأعمال':'AGYNEXA — Business Agent Builder'),description:service?.seo[i]||solution?.problem[i]||program?.intro[i]||summary[i]}
}

export function pageMetadata(path:string[],ar:boolean):Metadata{
 const copy=pageCopy(path,ar)
 const suffix=path.length?`/${path.join('/')}`:''
 const en=`${siteUrl}${suffix||'/'}`
 const arabic=`${siteUrl}/ar${suffix}`
 const canonical=ar?arabic:en
 return {
  ...copy,title:{absolute:copy.title},
  alternates:{canonical,languages:{en,ar:arabic,'x-default':en}},
  openGraph:{...copy,url:canonical,siteName:'AGYNEXA',locale:ar?'ar_EG':'en_US',alternateLocale:ar?'en_US':'ar_EG',type:'website',images:[{url:`${siteUrl}/opengraph-image`,width:1200,height:630,alt:ar?'AGYNEXA — استوديو بناء وكلاء الأعمال':'AGYNEXA — Agent Builder Studio'}]},
  twitter:{card:'summary_large_image',title:copy.title,description:copy.description,images:[`${siteUrl}/opengraph-image`]},
 }
}

export function pageSchema(path:string[],ar:boolean){
 const {title,description}=pageCopy(path,ar)
 const locale=ar?'ar':'en'
 const url=`${siteUrl}${ar?'/ar':''}${path.length?'/'+path.join('/'):ar?'':'/'}`
 const graph:Record<string,unknown>[]=[{
  '@type':'WebPage','@id':`${url}#webpage`,name:title,description,url,inLanguage:locale,
  isPartOf:{'@type':'WebSite','@id':`${siteUrl}/#website`,name:'AGYNEXA',url:siteUrl},
  about:{'@type':'SoftwareApplication',name:'AGYNEXA Studio',applicationCategory:'BusinessApplication',operatingSystem:'Web',url:`${siteUrl}${ar?'/ar':''}/studio`},
 }]
 if(path.length){
  const items=[{'@type':'ListItem',position:1,name:ar?'الرئيسية':'Home',item:`${siteUrl}${ar?'/ar':'/'}`}]
  path.forEach((part,index)=>items.push({'@type':'ListItem',position:index+2,name:index===path.length-1?title.replace(/\s*\|\s*AGYNEXA$/,''):(headings[part]?.[ar?1:0]||part),item:`${siteUrl}${ar?'/ar':''}/${path.slice(0,index+1).join('/')}`}))
  graph.push({'@type':'BreadcrumbList','@id':`${url}#breadcrumbs`,itemListElement:items})
 }
 const service=path[0]==='services'&&path.length===2?services.find(item=>item.slug===path[1]):undefined
 const faqs=path.length===0?platformFaq:service?.faq
 if(faqs?.length)graph.push({'@type':'FAQPage','@id':`${url}#questions`,inLanguage:locale,mainEntity:faqs.map(faq=>({'@type':'Question',name:faq.question[ar?1:0],acceptedAnswer:{'@type':'Answer',text:faq.answer[ar?1:0]}}))})
 return {'@context':'https://schema.org','@graph':graph}
}
