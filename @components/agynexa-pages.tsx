'use client'
import Breadcrumbs from './breadcrumbs'
import {solutions} from '@/lib/agynexa'
import pages from '@/lib/program-pages.json'
import {useLanguage} from './agynexa-shell'
import {SolutionGrid} from './agynexa-sections'
import {ProgramPage,ServiceCatalogue,ServiceDetail,DiscoveryClosing} from './service-catalog'
import ProjectBrief from './project-brief'
import ProcurementReview from './procurement-review'
import Link from './locale-link'
import services from '@/lib/service-catalog.json'
import solutionServices from '@/lib/solution-service-map.json'
import OwnerIdentity from './owner-identity'
import {CopyBlocks,usePageCopy} from './public-copy'
export default function ContentPage({page,slug}:{page:string;slug?:string}){
 if(page==='services')return slug&&slug!=='solutions'?<ServiceDetail slug={slug}/>:<ServiceCatalogue/>
 if(page in pages)return <ProgramPage page={page as keyof typeof pages}/>
 return <WorkflowPage page={page} slug={slug}/>
}
function WorkflowPage({page,slug}:{page:string;slug?:string}){
 const {t}=useLanguage();const route=`/${page}${slug?'/'+slug:''}`;const copy=usePageCopy(route)
 const solution=page==='solutions'?solutions.find(s=>s.slug===slug):undefined
 const paragraphs=copy.blocks.filter(b=>b.type==='paragraph');const lead=paragraphs[0]
 const body=copy.blocks.filter(b=>b!==lead)
 return <main id="main"><section className="container page-intro"><Breadcrumbs/><h1 className="text-4xl md:text-6xl max-w-4xl tracking-tight">{copy.h1}</h1><div className="max-w-3xl text-lg"><CopyBlocks blocks={lead?[lead]:[]}/></div></section><section className="container pb-24">{solution?<><div className="max-w-4xl"><CopyBlocks blocks={body}/></div>{solution.slug==='procurement'&&<div className="mt-16"><ProcurementReview/></div>}<section className="mt-12 border-t pt-10"><h2>{t(['Related capabilities','قدرات ذات صلة'])}</h2><div className="grid gap-4 md:grid-cols-2 mt-6">{solutionServices[solution.slug].map(serviceSlug=>{const service=services.find(s=>s.slug===serviceSlug)!;return <Link className="panel" key={serviceSlug} href={`/services/${serviceSlug}`}><h3>{t(service.detailTitle)}</h3><p className="muted mt-4">{t(service.detailOffer)}</p></Link>})}</div></section></>:page==='solutions'?<><div className="max-w-4xl mb-12"><CopyBlocks blocks={body}/></div><SolutionGrid/></>:page==='contact'?<><div className="max-w-3xl"><CopyBlocks blocks={body}/></div><div className="mt-12 max-w-3xl"><OwnerIdentity/></div></>:<><div className="max-w-4xl mb-12"><CopyBlocks blocks={body}/></div><h2 className="text-2xl mb-8">{t(['Optional planning record','سجل تخطيط اختياري'])}</h2><ProjectBrief/><div className="related-links mt-12"><Link href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Link><Link href="/contact">{t(['Contact details','بيانات التواصل'])}</Link></div></>}</section>{!['start','contact'].includes(page)&&<DiscoveryClosing/>}</main>
}
