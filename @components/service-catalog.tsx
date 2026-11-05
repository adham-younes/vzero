'use client'
import Link from './locale-link'
import services from '@/lib/service-catalog.json'
import pages from '@/lib/program-pages.json'
import {Action,useLanguage} from './agynexa-shell'
import {ProgramBody} from './program-layouts'
import {ServiceDirectory} from './service-directory'
import {CopyBlocks,usePageCopy} from './public-copy'
import AgentNexosIntro from './agentnexos-intro'
import {ActivationClosing} from './platform-experience'
import {CapabilityBody,CapabilityPanels,ReferencePanels} from './inline-details'
import {CatalogReturnLink,PublicPageHeader,PublicSectionNav,SupportingReading,withoutNavigationParagraphs} from './public-layout'

export function ServiceCards({compact=false}:{compact?:boolean}) {return <ServiceDirectory compact={compact}/>}
export function ServiceCatalogue(){
 const copy=usePageCopy('/services')
 return <main id="main" className="public-page"><PublicPageHeader eyebrow={['Platform capabilities','قدرات المنصة']} title={copy.h1} description={<CopyBlocks blocks={copy.blocks.slice(0,1)}/>}/><div className="container public-page-body"><ServiceCards/><SupportingReading title={['How these capabilities work together','كيف تتكامل هذه القدرات؟']} blocks={withoutNavigationParagraphs(copy.blocks.slice(1))}/><ReferencePanels links={[{label:copy.blocks.find(block=>block.text?.includes('/services/agent-orchestration'))?.text?.match(/\[([^\]]+)\]\((?:\/ar)?\/services\/agent-orchestration\)/)?.[1]||'Agent orchestration',href:'/services/agent-orchestration'}]} prefix="capability-catalog-reading"/></div><DiscoveryClosing/></main>
}
export function ServiceDetail({slug}:{slug:string}){
 const {t}=useLanguage();const service=services.find(item=>item.slug===slug)!
 return <main id="main" className="public-page"><PublicPageHeader eyebrow={['Capability','قدرة في المنصة']} title={t(service.detailTitle)} description={<p>{t(service.detailOffer)}</p>}><CatalogReturnLink fallback="/services"/><PublicSectionNav items={[{id:'capability-overview',label:t(['Overview','نظرة عامة'])},{id:'capability-workflow',label:t(['Workflow','مسار العمل'])},{id:'capability-requirements',label:t(['Requirements','متطلبات التشغيل'])},{id:'capability-questions',label:t(['Questions','أسئلة شائعة'])}]}/></PublicPageHeader><div className="container public-page-body"><CapabilityBody slug={slug} includeRelated/></div><DiscoveryClosing/></main>
}
export function ProgramPage({page}:{page:keyof typeof pages}){
 const {t}=useLanguage();const data=pages[page];const reviewed=usePageCopy(`/${page}`)
 const labels:Record<string,readonly string[]>={industries:['Industry context','سياق القطاعات'],methodology:['How to build','طريقة البناء'],architecture:['Platform architecture','بنية المنصة'],integrations:['Connection requirements','متطلبات الربط'],security:['Authority and oversight','الصلاحيات والرقابة'],resources:['Practical guidance','إرشادات عملية'],about:['About AGYNEXA','عن AGYNEXA']}
 return <main id="main" className="public-page">{page==='agentnexos'?<AgentNexosIntro/>:<PublicPageHeader eyebrow={labels[page]} title={t(data.title)} description={<p>{t(data.intro)}</p>}>{page!=='industries'&&<PublicSectionNav items={data.sections.map((section,i)=>({id:`program-${i+1}`,label:t(section.title)}))}/>}</PublicPageHeader>}<div className="container public-page-body"><ProgramBody page={page}/>{page==='industries'&&<SupportingReading title={['How to use these industry examples','كيف تستفيد من أمثلة القطاعات؟']} blocks={withoutNavigationParagraphs(reviewed.blocks.slice(1))}/>}{page!=='industries'&&<section className="inline-related-content"><h2>{t(['Related capabilities — read here','قدرات مرتبطة — اقرأها هنا'])}</h2><CapabilityPanels slugs={data.related} prefix={`program-${page}`} headingLevel={3}/></section>}{page==='security'&&<div className="public-legal-links"><Link href="/privacy">{t(['Privacy notice','إشعار الخصوصية'])}</Link><Link href="/terms">{t(['Usage terms','شروط الاستخدام'])}</Link></div>}</div><DiscoveryClosing/></main>
}

export function DiscoveryClosing(){return <ActivationClosing/>}
