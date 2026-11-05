'use client'
import {ArrowUpRight,ChevronDown,Database,ShieldCheck,Workflow,FileCheck2,BrainCircuit,BookOpen,MessagesSquare,Package,Receipt,Truck,Users,FileSearch,BriefcaseBusiness} from 'lucide-react'
import Link from './locale-link'
import {useCatalogState} from './catalog-state'
import {CatalogWorkspace,WorkflowBody,StandaloneReference,IndustryFacts,industryKeys,industrySolutions} from './inline-details'
import pages from '@/lib/program-pages.json'
import {solutions,summary} from '@/lib/agynexa'
import {Action,useLanguage} from './agynexa-shell'
import {CopyBlocks,usePageCopy,CopyBlock} from './public-copy'
import SystemDiagram from './system-diagram'
const solutionIcons=[BookOpen,FileSearch,BriefcaseBusiness,MessagesSquare,Receipt,Truck,Package,Receipt,Users]
export function Flow(){const {t}=useLanguage();const steps=[{Icon:Database,title:['Knowledge','المعرفة'],body:['Approved sources and access rules.','مصادر معتمدة وقواعد وصول.']},{Icon:BrainCircuit,title:['Reasoning','الاستدلال'],body:['A task with bounded tools.','مهمة بأدوات محددة الصلاحيات.']},{Icon:ShieldCheck,title:['Human review','مراجعة بشرية'],body:['The right person reviews the action.','المسؤول المخوّل يراجع الإجراء.']},{Icon:FileCheck2,title:['Approved output','مخرج معتمد'],body:['A result with supporting evidence.','نتيجة بأدلة يمكن الرجوع إليها.']}];return <div><ol className="flow-strip">{steps.map(({Icon,title,body})=><li key={title[0]}><Icon size={28}/><p>{t(title)}</p><small>{t(body)}</small></li>)}</ol><p className="muted text-sm mt-5">{t(['An illustrative process: check the information, available operations and review required by the task.','مسار توضيحي: افحص المعلومات والعمليات المتاحة والمراجعة التي تحتاجها المهمة.'])}</p></div>}
export function SolutionGrid({limit}:{limit?:number}){
 const {t}=useLanguage()
 const [state,update]=useCatalogState({q:'',industry:'',solution:''})
 const query=limit?'':state.q
 const list=solutions.filter(solution=>`${solution.name.join(' ')} ${solution.problem.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0,limit)
 const industryIndex=industryKeys.indexOf(state.industry)
 const industry=pages.industries.sections[industryIndex]

 function chooseIndustry(value:string){
  const index=industryKeys.indexOf(value)
  update({industry:value,q:'',...(index>=0?{solution:industrySolutions[index]}:{})})
 }

 return <>
  <div className="public-catalog-heading">
   <h2>{t(['Choose the work your team needs to complete','اختر العملية التي يحتاج فريقك إلى إنجازها'])}</h2>
   <p className="muted mt-3">{t(['Open a workflow to read its process, requirements and supporting capabilities here.','افتح مسار العمل لقراءة خطواته ومتطلباته والقدرات التي تدعمه هنا.'])}</p>
  </div>
  {!limit&&<div className="public-catalog-controls">
   <div className="public-search-row">
    <label className="public-search">
     <span>{t(['Search solutions','ابحث في الحلول'])}</span>
     <input className="field" type="search" value={query} onChange={event=>update({q:event.target.value})} aria-controls="solution-results" placeholder={t(['Knowledge, finance, logistics…','المعرفة، المالية، اللوجستيات…'])}/>
    </label>
    <p className="public-result-count" role="status" aria-live="polite" aria-atomic="true">{list.length} {t(['of 9 solutions','من ٩ حلول'])}</p>
   </div>
   <label className="catalog-industry-picker">
    <span>{t(['Industry context (optional)','سياق القطاع (اختياري)'])}</span>
    <select className="field" value={industry?state.industry:''} onChange={event=>chooseIndustry(event.target.value)}>
     <option value="">{t(['Choose an industry','اختر القطاع'])}</option>
     {pages.industries.sections.map((section,index)=><option value={industryKeys[index]} key={industryKeys[index]}>{t(section.title)}</option>)}
    </select>
   </label>
   {industry&&<details className="catalog-long-reading catalog-industry-reading" key={state.industry}>
    <summary><span>{t(['Read the industry example','اقرأ مثال القطاع'])}</span><ChevronDown size={16} aria-hidden="true"/></summary>
    <section className="inline-industry-context">
     <h3>{t(industry.title)}</h3>
     <IndustryFacts index={industryIndex}/>
    </section>
   </details>}
  </div>}
  <div id="solution-results">
   <CatalogWorkspace queryKey="solution" group="solution-directory" indexTitle={t(['Workflows','مسارات العمل'])} items={list.map(solution=>{
    const Icon=solutionIcons[solutions.indexOf(solution)]
    return {
     key:solution.slug,
     title:t(solution.name),
     description:t(solution.problem),
     icon:<Icon/>,
     content:<>
      <WorkflowBody slug={solution.slug} prefix={`solution-${solution.slug}`} headingLevel={4} catalog/>
      <StandaloneReference path={`/solutions/${solution.slug}`}/>
     </>,
    }
   })}/>
  </div>
  {!list.length&&<div className="public-empty">
   <p>{t(['No solutions match your search.','لا حلول تطابق بحثك.'])}</p>
   <button className="quiet" onClick={()=>update({q:''})}>{t(['Clear search','مسح البحث'])}</button>
  </div>}
 </>
}
export function ArchitectureSection(){const {t}=useLanguage();return <div className="split-section"><div><h2>{t(['Connect your knowledge, tools and decisions.','اربط معرفتك وأدواتك وقراراتك.'])}</h2><p className="muted mt-6">{t(summary)}</p><div className="feature-lines">{[{I:Database,title:['Enterprise RAG','استرجاع معرفي مؤسسي'],body:['Answers grounded in approved sources.','إجابات تستند إلى مصادر معتمدة.']},{I:Workflow,title:['Workflow automation','أتمتة سير العمل'],body:['Defined steps, exceptions and ownership.','خطوات واستثناءات ومسؤوليات محددة.']},{I:ShieldCheck,title:['Permission-aware agents','وكلاء بصلاحيات محددة'],body:['Human approval before consequential actions.','اعتماد بشري قبل الإجراءات المؤثرة.']}].map(({I,title,body})=><div key={title[0]}><I/><div><h3>{t(title)}</h3><p>{t(body)}</p></div></div>)}</div><Action href="/architecture">{t(['Explore the architecture','اكتشف البنية'])}</Action></div><SystemDiagram/></div>}
export function Closing(){const {t}=useLanguage();return <section className="section"><div className="container section-heading mb-0"><div><h2>{t(['Build around your company’s knowledge','ابنِ الوكيل حول معرفة شركتك'])}</h2><p className="muted mt-5">{t(['Set up a private agent, give it a business role and explore its answers using the context your team provides.','أنشئ وكيلًا خاصًا، وحدد دوره في العمل، واختبر إجاباته بالسياق الذي يقدمه فريقك.'])}</p></div><Action href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Action></div></section>}
export function HomeSections(){
 const {t}=useLanguage();const copy=usePageCopy('/');const sections:{title:string;blocks:CopyBlock[]}[]=[]
 for(const block of copy.blocks){if(block.type==='heading'&&block.depth===2)sections.push({title:block.text||'',blocks:[]});else if(sections.length)sections[sections.length-1].blocks.push(block)}
 return <><div className="capability-band"><div className="container">{[{I:BrainCircuit,label:['Business agent roles','أدوار الوكلاء في العمل']},{I:Database,label:['Company knowledge','معرفة الشركة']},{I:Workflow,label:['Business workflows','سير عمل المؤسسات']},{I:ShieldCheck,label:['Human review','مراجعة بشرية']}].map(({I,label})=><span key={label[0]}><I/>{t(label)}</span>)}</div></div>{sections.map((section,i)=><section className="section" key={section.title}><div className="container">{i===0?<div className="split-section"><h2>{section.title}</h2><div><CopyBlocks blocks={section.blocks}/></div></div>:i===1?<><h2 className="max-w-4xl mb-12">{section.title}</h2><HomeJourney blocks={section.blocks}/></>:i===2?<div className="split-section"><div><h2>{section.title}</h2><CopyBlocks blocks={section.blocks}/></div><SystemDiagram/></div>:i===sections.length-1?<div className="section-heading mb-0"><div className="max-w-3xl"><h2>{section.title}</h2><CopyBlocks blocks={section.blocks}/></div><Action href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Action></div>:<><h2 className="max-w-4xl">{section.title}</h2><div className="max-w-4xl"><CopyBlocks blocks={section.blocks}/></div></>}</div></section>)}</>
}
function HomeJourney({blocks}:{blocks:CopyBlock[]}){
 const {ar}=useLanguage();const steps:{title:string;blocks:CopyBlock[]}[]=[];const introduction:CopyBlock[]=[]
 for(const block of blocks){if(block.type==='heading'&&block.depth===3)steps.push({title:(block.text||'').replace(/^[\d٠-٩]+\.\s*/,''),blocks:[]});else if(steps.length)steps[steps.length-1].blocks.push(block);else introduction.push(block)}
 return <><CopyBlocks blocks={introduction}/><ol className="delivery-timeline">{steps.map((step,i)=><li key={step.title}><article><span className="step-number" aria-hidden="true">{new Intl.NumberFormat(ar?'ar-EG':'en').format(i+1)}</span><h3 className="text-xl leading-relaxed">{step.title}</h3><CopyBlocks blocks={step.blocks}/></article></li>)}</ol></>
}
