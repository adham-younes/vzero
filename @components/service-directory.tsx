'use client'
import services from '@/lib/service-catalog.json'
import {Button} from '@/components/ui/button'
import {useLanguage} from './agynexa-shell'
import {CatalogWorkspace,CapabilityBody,StandaloneReference} from './inline-details'
import {useCatalogState} from './catalog-state'
import {CatalogSearch,CatalogSelect} from './catalog-controls'

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
  const searchable=[...service.title,...service.detailTitle,...service.problem,...service.systems].join(' ')
  return matchesGroup&&searchable.toLowerCase().includes(query.trim().toLowerCase())
 })
 const items=(compact?filtered.slice(0,4):filtered).map(service=>({
   key:service.slug,
   label:t(service.title),
   title:t(compact?service.title:service.detailTitle),
   description:t(compact?service.offer:service.detailOffer),
   content:<>
    <CapabilityBody slug={service.slug} prefix={`directory-${service.slug}`} headingLevel={3} includeRelated/>
    <StandaloneReference path={`/services/${service.slug}`}/>
   </>,
 }))

 return <>
  <div id="capability-results">
   <CatalogWorkspace
    queryKey="capability" group="capability-directory" indexTitle={t(['Choose a capability','اختر القدرة'])}
    headingLevel={2} items={items} resultCount={compact?undefined:filtered.length}
    controls={!compact&&<>
     <CatalogSearch label={t(['Find a capability','ابحث عن قدرة'])}
      placeholder={t(['Knowledge, purchasing, voice…','المعرفة، المشتريات، الصوت…'])}
      query={query} onSearch={value=>update({q:value})} controls="capability-directory-detail"/>
     <CatalogSelect label={t(['Business area','مجال العمل'])} value={group.key}
      onChange={value=>update({category:value})} controls="capability-directory-detail">
      {groups.map(item=><option key={item.key} value={item.key}>{t(item.label)}</option>)}
     </CatalogSelect>
    </>}
   />
  </div>
  {!filtered.length&&<div className="public-empty">
   <p>{t(['No capabilities match your search and category.','لا توجد قدرات تطابق البحث والتصنيف المختار.'])}</p>
   <Button variant="outline" onClick={()=>update({category:'all',q:''})}>{t(['Clear search and filters','مسح البحث والتصفية'])}</Button>
  </div>}
 </>
}
