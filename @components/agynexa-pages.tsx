'use client'
import {headings,solutions,summary} from '@/lib/agynexa'
import pages from '@/lib/program-pages.json'
import {useLanguage} from './agynexa-shell'
import {Flow,SolutionGrid,Closing} from './agynexa-sections'
import {ProgramPage,ServiceCatalogue,ServiceDetail} from './service-catalog'
import ProjectBrief from './project-brief'
import Link from 'next/link'
import services from '@/lib/service-catalog.json'
import solutionServices from '@/lib/solution-service-map.json'
export default function ContentPage({page,slug}:{page:string;slug?:string}){
 const {t}=useLanguage()
 if(page==='services')return slug&&slug!=='solutions'?<ServiceDetail slug={slug}/>:<ServiceCatalogue/>
 if(page in pages)return <ProgramPage page={page as keyof typeof pages}/>
 const solution=page==='solutions'?solutions.find(s=>s.slug===slug):undefined
 return <main id="main"><section className="container pt-16 pb-12 md:pt-24"><p className="eyebrow">{solution?t(['Solution scope','نطاق الحل']):t(page==='solutions'?['Solutions','الحلول']:['Project brief','موجز المشروع'])}</p><h1 className="text-4xl md:text-6xl max-w-4xl tracking-tight">{solution?t(solution.name):t(headings[page])}</h1><p className="muted mt-6 max-w-2xl text-lg">{solution?t(solution.problem):t(summary)}</p></section><section className="container pb-24">{solution?<><p className="muted mb-8">{t(['We design and implement this workflow within an agreed scope, with access, approvals and acceptance criteria defined before delivery.','نصمّم وننفّذ هذا المسار ضمن نطاق متفق عليه، مع تحديد الوصول والاعتمادات ومعايير القبول قبل التسليم.'])}</p><div className="grid gap-4 md:grid-cols-2">{[[['Problem','المشكلة'],solution.problem],[['Inputs','المدخلات'],solution.input],[['Workflow','سير العمل'],solution.flow],[['Output','المخرج'],solution.output],[['Acceptance criterion','معيار القبول'],solution.accept]].map(([label,copy],i)=><article className="panel" key={i}><p className="eyebrow">0{i+1}</p><h3>{t(label)}</h3><p className="muted mt-4">{t(copy)}</p></article>)}</div><Flow/><section className="mt-12 border-t pt-10"><h2>{t(['Services behind this solution','الخدمات التي تدعم هذا الحل'])}</h2><div className="grid gap-4 md:grid-cols-2 mt-6">{solutionServices[solution.slug].map(serviceSlug=>{const service=services.find(s=>s.slug===serviceSlug)!;return <Link className="panel" key={serviceSlug} href={`/services/${serviceSlug}`}><h3>{t(service.title)}</h3><p className="muted mt-4">{t(service.offer)}</p></Link>})}</div></section></>:page==='solutions'?<SolutionGrid/>:<ProjectBrief/>}</section>{!['start','contact'].includes(page)&&<Closing/>}</main>
}
