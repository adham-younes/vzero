'use client'
import {Landmark,ShieldCheck,HeartPulse,ShoppingBag,Radio,Plane,Briefcase,Truck,Factory,Package,Workflow,FileCheck2,Plus,Database,MessagesSquare,Network,BookOpen} from 'lucide-react'
import pages from '@/lib/program-pages.json'
import {Action,useLanguage} from './agynexa-shell'
import SystemDiagram from './system-diagram'
import OwnerIdentity from './owner-identity'
import {CopyBlocks} from './public-copy'
import {useCatalogState} from './catalog-state'
import {industryKeys,industryCapabilities,industrySolutions,IndustryFacts,ReferencePanels} from './inline-details'
import {CatalogSelect,CatalogToolbar} from './catalog-controls'
import {TaskProcessVisual} from './public-process-visuals'
import styles from './public-process-visuals.module.css'
const sectorIcons=[Landmark,ShieldCheck,HeartPulse,ShoppingBag,Radio,Plane,Briefcase,Truck,Factory,Package]
const sectorKeys=industryKeys
const sectorServices=industryCapabilities
const sectorSolutions=industrySolutions
function Body({text}:{text:string}){return <CopyBlocks blocks={text.split('\n\n').filter(Boolean).map(text=>({type:'paragraph',text}))}/>}
export function IndustryExplorer(){
 const {t}=useLanguage()
 const [state,update]=useCatalogState({industry:'banking'})
 const sectors=pages.industries.sections
 const active=Math.max(0,sectorKeys.indexOf(state.industry))
 const item=sectors[active]
 const Icon=sectorIcons[active]
 const pickerLabel=t(['Choose your industry','اختر قطاعك'])

 return <div className="catalog-stack">
  <CatalogToolbar>
   <CatalogSelect label={pickerLabel} value={sectorKeys[active]} onChange={value=>update({industry:value})} controls="industry-detail">
    {sectors.map((section,i)=><option key={sectorKeys[i]} value={sectorKeys[i]}>{t(section.title)}</option>)}
   </CatalogSelect>
  </CatalogToolbar>
  <section className="industry-detail" id="industry-detail" aria-labelledby="industry-title">
   <p className="public-kicker">{t(['Workflow design example','مثال لتصميم سير العمل'])}</p>
   <h2 id="industry-title" aria-live="polite">{t(item.title)}</h2>
   <div className="industry-art" aria-hidden="true"><Icon/><span className="art-line"/><Workflow/><span className="art-line"/><FileCheck2/></div>
   <TaskProcessVisual slug={sectorSolutions[active]}/>
   <IndustryFacts index={active}/>
   <div className={styles.sectorEntry}><p>{t(['Choose this example to start an agent, then add your company’s instructions and sources.','ابدأ بهذا المثال، ثم أضف تعليمات شركتك ومراجعها إلى الوكيل.'])}</p><Action href={`/studio?industry=${sectorKeys[active]}`}>{t(['Create an agent','أنشئ وكيلًا'])}</Action></div>
   <section className="inline-related-content">
    <h3>{t(['Explore the process here','استكشف العملية هنا'])}</h3>
    <ReferencePanels prefix={`industry-${sectorKeys[active]}`} headingLevel={3} links={[
     {label:t(['Workflow for this industry','مسار العمل في هذا القطاع']),href:`/solutions/${sectorSolutions[active]}`},
     {label:t(['Supporting capability and requirements','القدرة الداعمة ومتطلبات التشغيل']),href:`/services/${sectorServices[active]}`},
    ]}/>
   </section>
  </section>
 </div>
}
export function ProgramBody({page}:{page:keyof typeof pages}){
 const {t,ar}=useLanguage();const data=pages[page]
 if(page==='industries')return <IndustryExplorer/>
 if(page==='methodology')return <ol className="delivery-timeline public-methodology">{data.sections.map((section,i)=><li id={`program-${i+1}`} key={section.title[0]}><article><span className="step-number" aria-hidden="true">{new Intl.NumberFormat(ar?'ar-EG':'en').format(i+1)}</span><h2>{t(section.title)}</h2><Body text={t(section.body)}/></article></li>)}</ol>
 if(page==='integrations'){const icons=[Network,MessagesSquare,BookOpen,Package,Radio,Database];return <><div className="split-section public-integration-intro"><div><p className="public-kicker">{t(['Start with the operation','ابدأ بالإجراء المطلوب'])}</p><h2>{t(['Which system does the task need?','أي نظام تحتاجه المهمة؟'])}</h2><p className="muted mt-6">{t(['Start with the information to read or the action to take. Then assess whether the system supports it and who can authorize access.','ابدأ بالمعلومات المطلوب قراءتها أو الإجراء المطلوب تنفيذه، ثم تحقق مما يدعمه النظام ومن يملك صلاحية السماح بالوصول.'])}</p></div><SystemDiagram/></div><div className="integration-directory">{data.sections.map((section,i)=>{const I=icons[i]||Network;return <article id={`program-${i+1}`} key={section.title[0]}><I className="text-primary mb-5" size={26} aria-hidden="true"/><h2>{t(section.title)}</h2><Body text={t(section.body)}/></article>})}</div></>}
 if(page==='about')return <div className="reading-layout public-reference-layout"><aside><div className="brand text-4xl mb-6">AGYNEXA<span className="text-primary">.</span></div><OwnerIdentity/></aside><div>{data.sections.map((section,i)=><article id={`program-${i+1}`} className="public-reference-article" key={section.title[0]}><h2>{t(section.title)}</h2><Body text={t(section.body)}/></article>)}</div></div>
 return <div className="reading-layout public-reference-layout"><aside>{page==='architecture'||page==='agentnexos'?<SystemDiagram/>:<><ShieldCheck size={40} className="text-primary mb-6" aria-hidden="true"/><h2>{t(page==='security'?['Before using company data','قبل استخدام بيانات الشركة']:['Use a task you already know','ابدأ بمهمة تعرفها'])}</h2><p className="mt-6">{t(page==='security'?['Choose the information you can provide and who will review the results.','اختر المعلومات التي يمكنك تقديمها وحدّد من يراجع النتائج.']:['Compare the answer with a completed example, then adjust the instructions where needed.','قارن الإجابة بمثال سبق إنجازه، ثم عدّل التعليمات حيث تحتاج إلى تحسين.'])}</p></>}</aside><div>{data.sections.map((section,i)=><details id={`program-${i+1}`} key={section.title[0]} open={i===0}><summary><h2>{t(section.title)}</h2><Plus size={20} className="text-primary shrink-0" aria-hidden="true"/></summary><Body text={t(section.body)}/></details>)}</div></div>
}
