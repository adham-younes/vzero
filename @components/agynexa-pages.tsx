'use client'
import Breadcrumbs from './breadcrumbs'
import {headings,solutions,summary} from '@/lib/agynexa'
import pages from '@/lib/program-pages.json'
import {useLanguage} from './agynexa-shell'
import {Flow,SolutionGrid,Closing} from './agynexa-sections'
import {ProgramPage,ServiceCatalogue,ServiceDetail} from './service-catalog'
import ProjectBrief from './project-brief'
import ProcurementReview from './procurement-review'
import Link from './locale-link'
import services from '@/lib/service-catalog.json'
import solutionServices from '@/lib/solution-service-map.json'
export default function ContentPage({page,slug}:{page:string;slug?:string}){
 const {t}=useLanguage()
 if(page==='services')return slug&&slug!=='solutions'?<ServiceDetail slug={slug}/>:<ServiceCatalogue/>
 if(page in pages)return <ProgramPage page={page as keyof typeof pages}/>
 const solution=page==='solutions'?solutions.find(s=>s.slug===slug):undefined
 return <main id="main"><section className="container page-intro"><Breadcrumbs/><h1 className="text-4xl md:text-6xl max-w-4xl tracking-tight">{solution?t(solution.name):t(headings[page])}</h1><p className="muted mt-6 max-w-2xl text-lg">{solution?t(solution.problem):t(summary)}</p></section><section className="container pb-24">{solution?<><div className="flex flex-wrap gap-3 mb-8"><Link className="action" href="/start">{t(['Scope this solution','حدّد نطاق هذا الحل'])}</Link>{solution.slug==='procurement'&&<a className="quiet" href="#review-workspace">{t(['Try the working example','جرّب المثال التفاعلي'])}</a>}</div><p className="muted mb-8">{t(['We design and implement this workflow within an agreed scope, with access, approvals and acceptance criteria defined before delivery.','نصمّم وننفّذ هذا المسار ضمن نطاق متفق عليه، مع تحديد الوصول والاعتمادات ومعايير القبول قبل التسليم.'])}</p><div className="service-details">{[[['Problem','المشكلة'],solution.problem],[['Inputs','المدخلات'],solution.input],[['Workflow','سير العمل'],solution.flow],[['Output','المخرج'],solution.output],[['Acceptance criterion','معيار القبول'],solution.accept]].map(([label,copy],i)=><article key={i}><h2 className="text-2xl">{t(label)}</h2><p className="muted mt-4">{t(copy)}</p></article>)}</div>{solution.slug==='procurement'?<div className="mt-16"><ProcurementReview/></div>:<Flow/>}<section className="mt-12 border-t pt-10"><h2>{t(['Services behind this solution','الخدمات التي تدعم هذا الحل'])}</h2><div className="grid gap-4 md:grid-cols-2 mt-6">{solutionServices[solution.slug].map(serviceSlug=>{const service=services.find(s=>s.slug===serviceSlug)!;return <Link className="panel" key={serviceSlug} href={`/services/${serviceSlug}`}><h3>{t(service.title)}</h3><p className="muted mt-4">{t(service.offer)}</p></Link>})}</div></section></>:page==='solutions'?<SolutionGrid/>:<ProjectBrief/>}</section>{!['start','contact'].includes(page)&&<Closing/>}</main>
}
