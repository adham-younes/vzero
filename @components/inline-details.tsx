'use client'
import type {ElementType,ReactNode,SyntheticEvent} from 'react'
import {
 ChevronDown,ExternalLink,MessagesSquare,Users,Workflow,Database,Network,Plug,Mic,
 Headphones,ShieldCheck,ChartNoAxesCombined,type LucideIcon,
} from 'lucide-react'
import services from '@/lib/service-catalog.json'
import pages from '@/lib/program-pages.json'
import {solutions} from '@/lib/agynexa'
import solutionServices from '@/lib/solution-service-map.json'
import {useLanguage} from './agynexa-shell'
import {catalogDetailHref,useCatalogState} from './catalog-state'
import Link from './locale-link'
import {usePathname} from 'next/navigation'
import {CopyBlocks,usePageCopy,type CopyBlock} from './public-copy'
import ProcurementReview from './procurement-review'
import {splitCopySections} from './public-layout'
import {CatalogChoices,CatalogSelect,CatalogToolbar} from './catalog-controls'

export const industryKeys=['banking','insurance','healthcare','retail','telecommunications','travel','professional-services','logistics','energy','distribution']
export const industryCapabilities=['agent-orchestration','process-automation','employee-operations','customer-service','agent-assist','agent-orchestration','enterprise-knowledge','agent-orchestration','enterprise-knowledge','process-automation']
export const industrySolutions=['service','documents','customer-operations','service','service','customer-operations','documents','logistics','knowledge','sales']
export type HeadingLevel=2|3|4|5|6
const nextHeading=(level:HeadingLevel)=>Math.min(6,level+1) as HeadingLevel
const heading=(level:HeadingLevel)=>`h${level}` as ElementType
export type InlinePanelItem={key:string;title:string;label?:string;description?:string;icon?:ReactNode;content:ReactNode}

export const capabilityIcons:Record<string,LucideIcon>={
 'customer-service':MessagesSquare,
 'employee-operations':Users,
 'process-automation':Workflow,
 'enterprise-knowledge':Database,
 'agent-orchestration':Network,
 'enterprise-integrations':Plug,
 'voice-agents':Mic,
 'agent-assist':Headphones,
 'governance-security':ShieldCheck,
 'evaluation-observability':ChartNoAxesCombined,
}

export function CatalogWorkspace({items,queryKey,group,indexTitle,headingLevel=3,controls,context,resultCount}:{
 items:InlinePanelItem[]
 queryKey:string
 group:string
 indexTitle:string
 headingLevel?:HeadingLevel
 controls?:ReactNode
 context?:ReactNode
 resultCount?:number
}){
 const [state,update]=useCatalogState({[queryKey]:''})
 const selected=items.find(item=>item.key===state[queryKey])||items[0]

 const Heading=heading(headingLevel)
 const detailId=`${group}-detail`
 const detailHeadingId=`${detailId}-title`
 const choose=(key:string)=>update({[queryKey]:key})

 return <div className="catalog-stack">
  <CatalogToolbar count={resultCount}>
   {controls}
   {selected&&<CatalogSelect label={indexTitle} value={selected.key} onChange={choose} controls={detailId}>
    {items.map(item=><option key={item.key} value={item.key}>{item.label||item.title}</option>)}
   </CatalogSelect>}
  </CatalogToolbar>
  {context}
  {selected&&<article className="catalog-detail" id={detailId} key={selected.key} aria-labelledby={detailHeadingId}>
   <header className="catalog-detail-header">
    <Heading id={detailHeadingId}>{selected.title}</Heading>
    {selected.description&&<p>{selected.description}</p>}
   </header>
   {selected.content}
  </article>}
 </div>
}

export function InlinePanels({items,queryKey,group,headingLevel=3}:{items:InlinePanelItem[];queryKey:string;group:string;headingLevel?:HeadingLevel}){
 const [state,update]=useCatalogState({[queryKey]:''})
 function toggle(event:SyntheticEvent<HTMLDetailsElement>,key:string){
  const open=event.currentTarget.open
  const selected=new URLSearchParams(window.location.search).get(queryKey)||''
  // Exclusive native details may close A after B opens. Only clear the value
  // if this exact panel is still selected in the current URL.
  if(open&&selected!==key)update({[queryKey]:key})
  else if(!open&&selected===key){
   const replacement=Array.from(event.currentTarget.parentElement?.children||[]).find(node=>node instanceof HTMLDetailsElement&&node.open) as HTMLDetailsElement|undefined
   update({[queryKey]:replacement?.dataset.panelKey||''})
  }
 }
 return <div className="inline-panels">{items.map(item=><details className="inline-panel" id={`${group}-${item.key}`} name={group} data-panel-key={item.key} key={item.key} open={state[queryKey]===item.key} onToggle={event=>toggle(event,item.key)}><summary>{item.icon&&<span className="inline-panel-icon" aria-hidden="true">{item.icon}</span>}<span className="inline-panel-copy"><span className="inline-panel-title" role="heading" aria-level={headingLevel}>{item.title}</span>{item.description&&<span className="inline-panel-description">{item.description}</span>}</span><ChevronDown className="inline-panel-chevron" size={22} aria-hidden="true"/></summary><div className="inline-panel-body">{item.content}</div></details>)}</div>
}

export function StandaloneReference({path}:{path:string}){
 const {t}=useLanguage();const pathname=usePathname().replace(/^\/ar(?=\/|$)/,'')
 const [state]=useCatalogState({q:'',category:'',industry:'',solution:'',capability:'',reading:''})
 const href=['/solutions','/services','/industries'].includes(pathname)?catalogDetailHref(path,pathname,state):path
 return <Link className="inline-standalone" href={href}>{t(['Standalone page for sharing or reference','صفحة مستقلة للمشاركة أو الرجوع إليها'])}<ExternalLink size={13} aria-hidden="true"/></Link>
}

function DetailSections({blocks,prefix,headingLevel}:{blocks:CopyBlock[];prefix:string;headingLevel:HeadingLevel}){
 const {introduction,sections}=splitCopySections(blocks);const Heading=heading(headingLevel)
 return <><div className="public-reading public-reading-intro"><CopyBlocks blocks={introduction}/></div>{sections.map((section,i)=><section id={`${prefix}-${i+1}`} className="public-editorial-section" key={section.title}><div className="public-section-label"><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span><Heading>{section.title}</Heading></div><div className="public-reading"><CopyBlocks blocks={section.blocks}/></div></section>)}</>
}

export function ProgramReading({page,headingLevel=4}:{page:keyof typeof pages;headingLevel?:HeadingLevel}){
 const {t}=useLanguage();const data=pages[page];const Heading=heading(headingLevel)
 return <div className="inline-reference-reading"><p>{t(data.intro)}</p>{data.sections.map(section=><section key={section.title[0]}><Heading>{t(section.title)}</Heading><CopyBlocks blocks={t(section.body).split('\n\n').filter(Boolean).map(text=>({type:'paragraph',text}))}/></section>)}</div>
}

function SystemRequirements({systems,headingLevel}:{systems:string[];headingLevel:HeadingLevel}){
 const {ar,t}=useLanguage()
 const Heading=heading(headingLevel)
 return <details className="public-disclosure">
  <summary>{t(['System context and connection requirements','سياق الأنظمة ومتطلبات الربط'])}</summary>
  <ul className="public-system-tags">{systems.map(system=><li key={system}>{system.split(' / ')[ar?1:0]||system}</li>)}</ul>
  <p>{t(['Compatibility depends on the product edition, licensing, available interfaces and authorized operations. These categories describe where the work lives; check the connection and operations available for your process.','يتوقف التوافق على إصدار المنتج وترخيصه وواجهاته والعمليات المسموحة. توضح الفئات موضع العمل، ويجب التحقق من الاتصال والعمليات المتاحة للعملية المطلوبة.'])}</p>
  <Heading>{t(['Integration requirements','متطلبات التكامل'])}</Heading>
  <ProgramReading page="integrations" headingLevel={headingLevel}/>
  <StandaloneReference path="/integrations"/>
 </details>
}

export function CapabilityBody({slug,prefix='capability',headingLevel=2,includeRelated=false,includeIntro=false,includeSystemRequirements=true}:{
 slug:string
 prefix?:string
 headingLevel?:HeadingLevel
 includeRelated?:boolean
 includeIntro?:boolean
 includeSystemRequirements?:boolean
}){
 const {t}=useLanguage();const service=services.find(item=>item.slug===slug)!;const Heading=heading(headingLevel);const Subheading=heading(nextHeading(headingLevel))
 return <div className="inline-detail-content">{includeIntro&&<p className="inline-detail-lead">{t(service.detailOffer)}</p>}<section id={`${prefix}-overview`} className="public-facts-grid">{[[['Teams and responsibilities','الفرق والمسؤوليات'],service.audience],[['The process to improve','العملية المطلوب تحسينها'],service.problem]].map(([label,copy])=><article key={label[0]}><Heading>{t(label)}</Heading><p>{t(copy)}</p></article>)}</section>
  <section id={`${prefix}-workflow`} className="public-editorial-section"><div className="public-section-label"><span aria-hidden="true">01</span><Heading>{t(['How the process works','كيف تسير العملية؟'])}</Heading><p className="muted mt-5">{t(service.inputs)}</p></div><ol className="service-flow">{service.steps.map(step=><li key={step[0]}><p>{t(step)}</p></li>)}</ol></section>
  <section className="public-editorial-section"><div className="public-section-label"><span aria-hidden="true">02</span><Heading>{t(['The process in practice','تطبيق العملية'])}</Heading></div><ul className="public-output-list">{service.outputs.map(output=><li key={output[0]}>{t(output)}</li>)}</ul></section>
  <section id={`${prefix}-requirements`} className="public-editorial-section"><div className="public-section-label"><span aria-hidden="true">03</span><Heading>{t(['Decisions and operating requirements','القرارات ومتطلبات التشغيل'])}</Heading></div><div className="public-reading"><Subheading>{t(['Decisions and operating controls','القرارات وضوابط التشغيل'])}</Subheading><p>{t(service.controls)}</p><details className="public-disclosure"><summary>{t(['Evaluation checks and industry context','فحوص التقييم وسياق القطاعات'])}</summary><Subheading>{t(['Evaluation checks','فحوص التقييم'])}</Subheading><p>{t(service.metrics)}</p><Subheading>{t(['Relevant industries','القطاعات ذات الصلة'])}</Subheading><p>{t(service.industries)}</p></details>{includeSystemRequirements&&<SystemRequirements systems={service.systems} headingLevel={nextHeading(headingLevel)}/>}</div></section>
  <section id={`${prefix}-questions`} className="public-editorial-section"><div className="public-section-label"><span aria-hidden="true">04</span><Heading>{t(['Questions about this capability','أسئلة عن هذا المجال'])}</Heading></div><div className="public-question-list">{service.faq.map(faq=><details key={faq.question[0]}><summary>{t(faq.question)}</summary><p>{t(faq.answer)}</p></details>)}</div></section>{includeRelated&&<CapabilityRelated slug={slug} prefix={prefix} headingLevel={headingLevel}/>}</div>
}

export function CapabilityPanels({slugs,prefix,headingLevel=3,prioritizeRequirements=false}:{slugs:string[];prefix:string;headingLevel?:HeadingLevel;prioritizeRequirements?:boolean}){
 const {t}=useLanguage()
 const [state,update]=useCatalogState({capability:''})
 const choices=slugs.map(slug=>services.find(service=>service.slug===slug)!)
 const selected=choices.find(service=>service.slug===state.capability)
 const Heading=heading(headingLevel)
 const detailId=`${prefix}-capabilities-detail`

 return <>
  <CatalogChoices
   items={choices.map(service=>{
    const Icon=capabilityIcons[service.slug]
    return {key:service.slug,label:t(service.title),icon:<Icon/>}
   })}
   label={t(['Supporting capabilities','القدرات الداعمة'])}
   selected={selected?.slug||''}
   onChoose={value=>update({capability:value})}
   controls={detailId}
   idPrefix={`${prefix}-capabilities`}
  />
  <div id={detailId}>
   {selected&&<section className="catalog-related-detail" key={selected.slug} aria-labelledby={`${detailId}-title`}>
    <header className="catalog-related-detail-header">
     <Heading id={`${detailId}-title`}>{t(selected.detailTitle)}</Heading>
     <p>{t(selected.detailOffer)}</p>
    </header>
    {prioritizeRequirements?<>
     <SystemRequirements systems={selected.systems} headingLevel={nextHeading(headingLevel)}/>
     <details className="catalog-long-reading">
      <summary><span>{t(['Read the full capability','اقرأ شرح القدرة كاملًا'])}</span><ChevronDown size={16} aria-hidden="true"/></summary>
      <CapabilityBody slug={selected.slug} prefix={`${prefix}-${selected.slug}`} headingLevel={nextHeading(headingLevel)} includeSystemRequirements={false}/>
     </details>
    </>:<CapabilityBody slug={selected.slug} prefix={`${prefix}-${selected.slug}`} headingLevel={nextHeading(headingLevel)}/>}
    <StandaloneReference path={`/services/${selected.slug}`}/>
   </section>}
  </div>
 </>
}

export function WorkflowBody({slug,prefix='workflow',headingLevel=2,includeIntro=false,includeCapabilities=true,includeExample=true,catalog=false}:{
 slug:string
 prefix?:string
 headingLevel?:HeadingLevel
 includeIntro?:boolean
 includeCapabilities?:boolean
 includeExample?:boolean
 catalog?:boolean
}){
 const {t}=useLanguage()
 const solution=solutions.find(item=>item.slug===slug)!
 const copy=usePageCopy(`/solutions/${slug}`)
 const lead=copy.blocks.find(block=>block.type==='paragraph')
 const body=copy.blocks.filter(block=>block!==lead)
 const Heading=heading(headingLevel)
 const facts=[
  [['Information needed','المعلومات المطلوبة'],solution.input],
  [['How the work moves','تسلسل العمل'],solution.flow],
  [['The useful result','النتيجة المطلوبة'],solution.output],
 ].map(([label,copy])=><div key={label[0]}><dt>{t(label)}</dt><dd>{t(copy)}</dd></div>)

 const capabilities=includeCapabilities&&<section className="inline-related-content">
  <Heading>{t(['Capabilities supporting this workflow','القدرات التي تدعم هذا المسار'])}</Heading>
  <p>{t(['Open the relevant explanation here. Your workflow stays in view.','افتح الشرح الذي تحتاجه هنا، مع بقاء مسار العمل أمامك.'])}</p>
  <CapabilityPanels slugs={solutionServices[solution.slug]} prefix={prefix} headingLevel={nextHeading(headingLevel)} prioritizeRequirements/>
 </section>

 if(catalog){
  return <div className="inline-detail-content">
   <section id={`${prefix}-overview`}>
    <p className="catalog-workflow-audience">{t(solution.audience)}</p>
    <dl className="catalog-workflow-facts">{facts}</dl>
   </section>
   {capabilities}
   <details className="catalog-long-reading">
    <summary><span>{t(['Read the full workflow','اقرأ شرح المسار كاملًا'])}</span><ChevronDown size={16} aria-hidden="true"/></summary>
    <DetailSections blocks={copy.blocks} prefix={prefix} headingLevel={headingLevel}/>
    {slug==='procurement'&&includeExample&&<section className="public-procurement-example">
     <ProcurementReview id={`${prefix}-review-workspace`} headingLevel={headingLevel}/>
    </section>}
   </details>
  </div>
 }

 return <div className="inline-detail-content">
  {includeIntro&&<div className="inline-detail-lead"><CopyBlocks blocks={lead?[lead]:[]}/></div>}
  <section id={`${prefix}-overview`} className="public-workflow-overview">
   <div>
    <p className="public-kicker">{t(['The workflow at a glance','مسار العمل في نظرة سريعة'])}</p>
    <Heading>{t(solution.name)}</Heading>
    <p className="muted mt-4">{t(solution.audience)}</p>
   </div>
   <dl>{facts}</dl>
  </section>
  <DetailSections blocks={body} prefix={prefix} headingLevel={headingLevel}/>
  {slug==='procurement'&&includeExample&&<section className="public-procurement-example">
   {prefix==='workflow'?<ProcurementReview/>:<details className="inline-reference-disclosure">
    <summary>{t(['Try the fictional purchasing example here','جرّب مثال المشتريات الافتراضي هنا'])}</summary>
    <ProcurementReview id={`${prefix}-review-workspace`} headingLevel={headingLevel}/>
   </details>}
  </section>}
  {capabilities}
 </div>
}

function CapabilityRelated({slug,prefix,headingLevel}:{slug:string;prefix:string;headingLevel:HeadingLevel}){
 const {t}=useLanguage();const reviewed=usePageCopy(`/services/${slug}`);const Heading=heading(headingLevel)
 const mapped=solutions.filter(solution=>solutionServices[solution.slug].includes(slug)).map(solution=>({label:t(solution.name),href:`/solutions/${solution.slug}`}))
 const editorial=reviewed.blocks.flatMap(block=>[...(block.text||'').matchAll(/\[([^\]]+)\]\((\/[^)]+)\)/g)].map(match=>({label:match[1],href:match[2].replace(/^\/ar(?=\/|$)/,'')})))
 const reading=[...new Map([...mapped,...editorial].filter(link=>link.href!=='/integrations').map(link=>[link.href,link])).values()]
 return <section className="inline-related-content"><Heading>{t(['Related workflow and guidance','مسارات وإرشادات مرتبطة'])}</Heading><ReferencePanels links={reading} prefix={`${prefix}-related`} headingLevel={nextHeading(headingLevel)}/></section>
}

export function ReferencePanels({links,prefix,headingLevel=3}:{links:{label:string;href:string}[];prefix:string;headingLevel?:HeadingLevel}){
 const normalized=[...new Map(links.map(link=>({...link,href:link.href.replace(/^\/ar(?=\/|$)/,'')})).map(link=>[link.href,link])).values()]
 return <InlinePanels queryKey="reading" group={prefix} headingLevel={headingLevel} items={normalized.map(link=>{
  const [,page,slug]=link.href.split('/');const key=link.href.replaceAll('/','-').replace(/^-/, '')
  let content:ReactNode
  if(page==='services'&&slug&&services.some(service=>service.slug===slug))content=<CapabilityBody slug={slug} prefix={`${prefix}-${key}`} headingLevel={nextHeading(headingLevel)} includeIntro/>
  else if(page==='solutions'&&slug&&solutions.some(solution=>solution.slug===slug))content=<WorkflowBody slug={slug} prefix={`${prefix}-${key}`} headingLevel={nextHeading(headingLevel)} includeIntro includeCapabilities={false} includeExample={false}/>
  else if(page in pages&&page!=='industries')content=<ProgramReading page={page as keyof typeof pages} headingLevel={nextHeading(headingLevel)}/>
  else content=null
  return {key,title:link.label,content:<>{content}<StandaloneReference path={link.href}/></>}
 })}/>
}

export function IndustryFacts({index}:{index:number}){
 const {t}=useLanguage();const item=pages.industries.sections[index]
 return <><CopyBlocks blocks={t(item.body).split('\n\n').filter(Boolean).map(text=>({type:'paragraph',text}))}/><dl className="detail-facts">{[[['Business context','سياق العمل'],item.input],[['How the work moves','تسلسل العملية'],item.workflow],[['The business outcome','النتيجة المطلوبة'],item.outcome],[['Human responsibility','مسؤولية الأشخاص'],item.reviewer],[['What to measure','ما الذي نقيسه؟'],item.metrics]].map(([label,copy])=><div key={label[0]}><dt>{t(label)}</dt><dd>{t(copy)}</dd></div>)}</dl></>
}
