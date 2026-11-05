'use client'
import {ChevronDown,Database,ShieldCheck,Workflow,FileCheck2,BrainCircuit} from 'lucide-react'
import {useCatalogState} from './catalog-state'
import {CatalogWorkspace,WorkflowBody,StandaloneReference,IndustryFacts,industryKeys,industrySolutions} from './inline-details'
import {CatalogSearch,CatalogSelect} from './catalog-controls'
import {Button} from '@/components/ui/button'
import pages from '@/lib/program-pages.json'
import {solutions,summary} from '@/lib/agynexa'
import {Action,useLanguage} from './agynexa-shell'
import SystemDiagram from './system-diagram'
import PlatformExperience from './platform-experience'
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
  <div id="solution-results">
   <CatalogWorkspace
    queryKey="solution" group="solution-directory" indexTitle={t(['Choose a workflow','اختر مسار العمل'])}
    resultCount={limit?undefined:list.length}
    controls={!limit&&<>
     <CatalogSearch label={t(['Search solutions','ابحث في الحلول'])}
      placeholder={t(['Knowledge, finance, logistics…','المعرفة، المالية، اللوجستيات…'])}
      query={query} onSearch={value=>update({q:value})} controls="solution-directory-detail"/>
     <CatalogSelect label={t(['Industry context (optional)','سياق القطاع (اختياري)'])}
      value={industry?state.industry:''} onChange={chooseIndustry} controls="solution-directory-detail">
      <option value="">{t(['Choose an industry','اختر القطاع'])}</option>
      {pages.industries.sections.map((section,index)=><option value={industryKeys[index]} key={industryKeys[index]}>{t(section.title)}</option>)}
     </CatalogSelect>
    </>}
    context={!limit&&industry&&<details className="catalog-long-reading catalog-industry-reading" key={state.industry}>
     <summary><span>{t(['Read the industry example','اقرأ مثال القطاع'])}</span><ChevronDown size={16} aria-hidden="true"/></summary>
     <section className="inline-industry-context">
      <h3>{t(industry.title)}</h3>
      <IndustryFacts index={industryIndex}/>
     </section>
    </details>}
    items={list.map(solution=>({
     key:solution.slug,
     title:t(solution.name),
     description:t(solution.problem),
     content:<>
      <WorkflowBody slug={solution.slug} prefix={`solution-${solution.slug}`} headingLevel={4} catalog/>
      <StandaloneReference path={`/solutions/${solution.slug}`}/>
     </>,
    }))}
   />
  </div>
  {!list.length&&<div className="public-empty">
   <p>{t(['No solutions match your search.','لا حلول تطابق بحثك.'])}</p>
   <Button variant="outline" onClick={()=>update({q:''})}>{t(['Clear search','مسح البحث'])}</Button>
  </div>}
 </>
}
export function ArchitectureSection(){const {t}=useLanguage();return <div className="split-section"><div><h2>{t(['Connect your knowledge, tools and decisions.','اربط معرفتك وأدواتك وقراراتك.'])}</h2><p className="muted mt-6">{t(summary)}</p><div className="feature-lines">{[{I:Database,title:['Enterprise RAG','استرجاع معرفي مؤسسي'],body:['Answers grounded in approved sources.','إجابات تستند إلى مصادر معتمدة.']},{I:Workflow,title:['Workflow automation','أتمتة سير العمل'],body:['Defined steps, exceptions and ownership.','خطوات واستثناءات ومسؤوليات محددة.']},{I:ShieldCheck,title:['Permission-aware agents','وكلاء بصلاحيات محددة'],body:['Human approval before consequential actions.','اعتماد بشري قبل الإجراءات المؤثرة.']}].map(({I,title,body})=><div key={title[0]}><I/><div><h3>{t(title)}</h3><p>{t(body)}</p></div></div>)}</div><Action href="/architecture">{t(['Explore the architecture','اكتشف البنية'])}</Action></div><SystemDiagram/></div>}
export function Closing(){const {t}=useLanguage();return <section className="section"><div className="container section-heading mb-0"><div><h2>{t(['Build around your company’s knowledge','ابنِ الوكيل حول معرفة شركتك'])}</h2><p className="muted mt-5">{t(['Set up a private agent, give it a business role and explore its answers using the context your team provides.','أنشئ وكيلًا خاصًا، وحدد دوره في العمل، واختبر إجاباته بالسياق الذي يقدمه فريقك.'])}</p></div><Action href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Action></div></section>}
export function HomeSections(){return <PlatformExperience/>}
