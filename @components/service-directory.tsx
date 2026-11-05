'use client'
import {MessagesSquare,Users,Workflow,Database,Network,Plug,Mic,Headphones,ShieldCheck,ChartNoAxesCombined,Search} from 'lucide-react'
import services from '@/lib/service-catalog.json'
import {useLanguage} from './agynexa-shell'
import {InlinePanels,CapabilityBody,StandaloneReference} from './inline-details'
import {useCatalogState} from './catalog-state'
const icons=[MessagesSquare,Users,Workflow,Database,Network,Plug,Mic,Headphones,ShieldCheck,ChartNoAxesCombined]
const groups=[
 {key:'all',label:['All capabilities','كل القدرات'],slugs:[]},
 {key:'customer-experience',label:['Customer experience','تجربة العملاء'],slugs:['customer-service','voice-agents','agent-assist']},
 {key:'internal-operations',label:['Operations and knowledge','العمليات والمعرفة'],slugs:['employee-operations','enterprise-knowledge','process-automation']},
 {key:'integration-control',label:['Integration and control','الربط والتحكم'],slugs:['agent-orchestration','enterprise-integrations','governance-security','evaluation-observability']},
]
export function ServiceDirectory({compact=false}:{compact?:boolean}){
 const {t}=useLanguage()
 const [state,update]=useCatalogState({q:'',category:'all'})
 const group=groups.find(g=>g.key===state.category)||groups[0]
 const query=state.q
 const filtered=services.filter(s=>(group.key==='all'||group.slugs.includes(s.slug))&&`${s.detailTitle.join(' ')} ${s.problem.join(' ')} ${s.systems.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))
 return <>{!compact&&<div className="public-catalog-controls"><div className="public-search-row"><label className="public-search"><span><Search size={17} aria-hidden="true"/>{t(['Find a capability','ابحث عن قدرة'])}</span><input type="search" className="field" value={query} onChange={e=>update({q:e.target.value})} placeholder={t(['Knowledge, purchasing, voice…','المعرفة، المشتريات، الصوت…'])} aria-controls="capability-results"/></label><p className="public-result-count" role="status" aria-live="polite" aria-atomic="true">{filtered.length} {t(['of 10 capabilities','من ١٠ قدرات'])}</p></div><fieldset className="public-filters"><legend>{t(['Filter by capability area','تصفية حسب مجال العمل'])}</legend><div>{groups.map(g=><label key={g.key}><input type="radio" name="capability-category" value={g.key} checked={g.key===group.key} onChange={()=>update({category:g.key})} aria-controls="capability-results"/><span>{t(g.label)}</span></label>)}</div></fieldset></div>}<div id="capability-results"><InlinePanels queryKey="capability" group="capability-directory" headingLevel={3} items={(compact?filtered.slice(0,4):filtered).map(service=>{const Icon=icons[services.indexOf(service)];return {key:service.slug,title:t(compact?service.title:service.detailTitle),description:t(compact?service.offer:service.detailOffer),icon:<Icon/>,content:<><CapabilityBody slug={service.slug} prefix={`directory-${service.slug}`} headingLevel={4} includeRelated/><StandaloneReference path={`/services/${service.slug}`}/></>}})}/></div>{filtered.length===0&&<div className="public-empty"><p>{t(['No capabilities match your search and category.','لا توجد قدرات تطابق البحث والتصنيف المختار.'])}</p><button className="quiet" onClick={()=>update({category:'all',q:''})}>{t(['Clear search and filters','مسح البحث والتصفية'])}</button></div>}</>
}
