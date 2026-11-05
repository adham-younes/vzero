'use client'
import {solutions} from '@/lib/agynexa'
import pages from '@/lib/program-pages.json'
import {useLanguage} from './agynexa-shell'
import {SolutionGrid} from './agynexa-sections'
import {ProgramPage,ServiceCatalogue,ServiceDetail,DiscoveryClosing} from './service-catalog'
import ProjectBrief from './project-brief'
import Link from './locale-link'
import OwnerIdentity from './owner-identity'
import {CopyBlocks,usePageCopy} from './public-copy'
import {WorkflowBody} from './inline-details'
import {CatalogReturnLink,EditorialSections,PublicPageHeader,PublicSectionNav,splitCopySections,SupportingReading,withoutNavigationParagraphs} from './public-layout'
export default function ContentPage({page,slug}:{page:string;slug?:string}){
 if(page==='services')return slug&&slug!=='solutions'?<ServiceDetail slug={slug}/>:<ServiceCatalogue/>
 if(page in pages)return <ProgramPage page={page as keyof typeof pages}/>
 return <WorkflowPage page={page} slug={slug}/>
}
function WorkflowPage({page,slug}:{page:string;slug?:string}){
 const {t}=useLanguage();const route=`/${page}${slug?'/'+slug:''}`;const copy=usePageCopy(route)
 const solution=page==='solutions'?solutions.find(item=>item.slug===slug):undefined
 const lead=copy.blocks.find(block=>block.type==='paragraph');const body=copy.blocks.filter(block=>block!==lead)
 const sections=splitCopySections(body).sections
 return <main id="main" className="public-page"><PublicPageHeader eyebrow={solution?['Business workflow solution','حل لمسار عمل مؤسسي']:page==='solutions'?['Business solutions','حلول الأعمال']:page==='contact'?['Contact AGYNEXA','تواصل مع AGYNEXA']:['Getting started','خطوات البدء']} title={copy.h1} description={<CopyBlocks blocks={lead?[lead]:[]}/>}>{solution&&<><CatalogReturnLink fallback="/solutions"/><PublicSectionNav items={[{id:'workflow-overview',label:t(['At a glance','نظرة سريعة'])},...sections.map((section,i)=>({id:`workflow-${i+1}`,label:section.title})),...(solution.slug==='procurement'?[{id:'review-workspace',label:t(['Try the example','جرّب المثال'])}]:[])]}/></>}</PublicPageHeader><div className="container public-page-body">{solution?<><WorkflowBody slug={solution.slug}/>
 </>:page==='solutions'?<><SolutionGrid/><SupportingReading title={['What makes a complete business workflow?','ما الذي يجعل مسار العمل مكتملًا؟']} blocks={withoutNavigationParagraphs(body)}/></>:page==='contact'?<div className="public-contact-layout"><div className="public-reading"><EditorialSections blocks={body} prefix="contact"/></div><aside><OwnerIdentity/></aside></div>:<><div className="public-reading"><EditorialSections blocks={body} prefix="start"/></div><section className="public-planning-record"><h2>{t(['Optional planning record','سجل تخطيط اختياري'])}</h2><ProjectBrief/></section><div className="related-links"><Link href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Link><Link href="/contact">{t(['Contact details','بيانات التواصل'])}</Link></div></>}</div>{!['start','contact'].includes(page)&&<DiscoveryClosing/>}</main>
}
