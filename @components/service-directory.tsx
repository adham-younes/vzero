'use client'
import {Search} from 'lucide-react'
import services from '@/lib/service-catalog.json'
import {useLanguage} from './agynexa-shell'
import {CatalogWorkspace,CapabilityBody,StandaloneReference,capabilityIcons} from './inline-details'
import {useCatalogState} from './catalog-state'

const groups=[
 {key:'all',label:['All capabilities','كل القدرات'],slugs:[]},
 {key:'customer-experience',label:['Customer experience','تجربة العملاء'],slugs:['customer-service','voice-agents','agent-assist']},
 {key:'internal-operations',label:['Operations and knowledge','العمليات والمعرفة'],slugs:['employee-operations','enterprise-knowledge','process-automation']},
 {key:'integration-control',label:['Integration and control','الربط والتحكم'],slugs:['agent-orchestration','enterprise-integrations','governance-security','evaluation-observability']},
]

export function ServiceDirectory({compact=false}:{compact?:boolean}){
 const {t}=useLanguage()
 const [state,update]=useCatalogState({q:'',category:'all'})
 const group=groups.find(item=>item.key===state.category)||groups[0]
 const query=state.q
 const filtered=services.filter(service=>{
  const matchesGroup=group.key==='all'||group.slugs.includes(service.slug)
  const searchable=`${service.detailTitle.join(' ')} ${service.problem.join(' ')} ${service.systems.join(' ')}`
  return matchesGroup&&searchable.toLowerCase().includes(query.trim().toLowerCase())
 })
 const items=(compact?filtered.slice(0,4):filtered).map(service=>{
  const Icon=capabilityIcons[service.slug]
  return {
   key:service.slug,
   title:t(compact?service.title:service.detailTitle),
   description:t(compact?service.offer:service.detailOffer),
   icon:<Icon/>,
   content:<>
    <CapabilityBody slug={service.slug} prefix={`directory-${service.slug}`} headingLevel={3} includeRelated/>
    <StandaloneReference path={`/services/${service.slug}`}/>
   </>,
  }
 })

 return <>
  {!compact&&<div className="public-catalog-controls">
   <div className="public-search-row">
    <label className="public-search">
     <span><Search size={17} aria-hidden="true"/>{t(['Find a capability','ابحث عن قدرة'])}</span>
     <input type="search" className="field" value={query} onChange={event=>update({q:event.target.value})} placeholder={t(['Knowledge, purchasing, voice…','المعرفة، المشتريات، الصوت…'])} aria-controls="capability-results"/>
    </label>
    <p className="public-result-count" role="status" aria-live="polite" aria-atomic="true">{filtered.length} {t(['of 10 capabilities','من ١٠ قدرات'])}</p>
   </div>
   <fieldset className="public-filters">
    <legend>{t(['Filter by capability area','تصفية حسب مجال العمل'])}</legend>
    <div>{groups.map(item=><label key={item.key}>
     <input type="radio" name="capability-category" value={item.key} checked={item.key===group.key} onChange={()=>update({category:item.key})} aria-controls="capability-results"/>
     <span>{t(item.label)}</span>
    </label>)}</div>
   </fieldset>
  </div>}
  <div id="capability-results">
   <CatalogWorkspace queryKey="capability" group="capability-directory" indexTitle={t(['Capabilities','القدرات'])} headingLevel={2} items={items}/>
  </div>
  {!filtered.length&&<div className="public-empty">
   <p>{t(['No capabilities match your search and category.','لا توجد قدرات تطابق البحث والتصنيف المختار.'])}</p>
   <button className="quiet" onClick={()=>update({category:'all',q:''})}>{t(['Clear search and filters','مسح البحث والتصفية'])}</button>
  </div>}
 </>
}
