'use client'
import {useState} from 'react'
import {Landmark,ShieldCheck,HeartPulse,ShoppingBag,Radio,Plane,Briefcase,Truck,Factory,Package,Workflow,FileCheck2,Plus,ArrowUpRight,Database,MessagesSquare,Network,BookOpen} from 'lucide-react'
import pages from '@/lib/program-pages.json'
import {useLanguage} from './agynexa-shell'
import SystemDiagram from './system-diagram'
import Link from './locale-link'
import OwnerIdentity from './owner-identity'
import {CopyBlocks} from './public-copy'
const sectorIcons=[Landmark,ShieldCheck,HeartPulse,ShoppingBag,Radio,Plane,Briefcase,Truck,Factory,Package]
const sectorServices=['agent-orchestration','process-automation','employee-operations','customer-service','agent-assist','agent-orchestration','enterprise-knowledge','agent-orchestration','enterprise-knowledge','process-automation']
const sectorSolutions=['service','documents','customer-operations','service','service','customer-operations','documents','logistics','knowledge','sales']
function Body({text}:{text:string}){return <CopyBlocks blocks={text.split('\n\n').filter(Boolean).map(text=>({type:'paragraph',text}))}/>}
export function IndustryExplorer(){
 const {t}=useLanguage();const [active,setActive]=useState(0);const item=pages.industries.sections[active];const Icon=sectorIcons[active]
 return <div className="industry-layout"><nav className="industry-nav" aria-label={t(['Choose an industry','اختر القطاع'])}>{pages.industries.sections.map((s,i)=>{const I=sectorIcons[i];return <button key={s.title[0]} aria-pressed={active===i} aria-controls="industry-detail" onClick={()=>setActive(i)}><I/>{t(s.title)}</button>})}</nav><section className="industry-detail" id="industry-detail" aria-live="polite"><div className="industry-art" aria-hidden="true"><Icon/><span className="art-line"/><Workflow/><span className="art-line"/><FileCheck2/></div><p className="eyebrow">{t(['Workflow design example','مثال لتصميم سير العمل'])}</p><h2>{t(item.title)}</h2><Body text={t(item.body)}/><dl className="detail-facts">{[
  [['Business context','سياق العمل'],item.input],
  [['How the work moves','تسلسل العملية'],item.workflow],
  [['The business outcome','النتيجة المطلوبة'],item.outcome],
  [['Human responsibility','مسؤولية الأشخاص'],item.reviewer],
  [['What to measure','ما الذي نقيسه؟'],item.metrics]
 ].map(([label,copy])=><div key={label[0]}><dt>{t(label)}</dt><dd>{t(copy)}</dd></div>)}</dl><div className="flex flex-wrap gap-4"><Link className="text-link" href={`/services/${sectorServices[active]}`}>{t(['Related platform capability','القدرة المرتبطة بالعملية'])}<ArrowUpRight size={18}/></Link><Link className="text-link" href={`/solutions/${sectorSolutions[active]}`}>{t(['Explore the workflow solution','حل سير العمل'])}<ArrowUpRight size={18}/></Link></div></section></div>
}
export function ProgramBody({page}:{page:keyof typeof pages}){
 const {t}=useLanguage();const data=pages[page]
 if(page==='industries')return <IndustryExplorer/>
 if(page==='methodology')return <div className="delivery-timeline">{data.sections.map((s,i)=><article key={s.title[0]}><span className="step-number">{i+1}</span><h2>{t(s.title)}</h2><Body text={t(s.body)}/></article>)}</div>
 if(page==='integrations'){const icons=[Network,MessagesSquare,BookOpen,Package,Radio,Database];return <><div className="split-section mb-12"><div><h2>{t(['Access has a purpose and a boundary','وصول له غرض وحدود'])}</h2><p className="muted mt-6">{t(['Identify the record or operation the process needs, then establish the appropriate source, interface and permission.','حدد السجل أو الإجراء الذي تحتاجه العملية، ثم المصدر والواجهة والصلاحية المناسبة له.'])}</p></div><SystemDiagram/></div><div className="integration-directory">{data.sections.map((s,i)=>{const I=icons[i]||Network;return <article key={s.title[0]}><I className="text-primary mb-5" size={28}/><h2>{t(s.title)}</h2><Body text={t(s.body)}/></article>})}</div></>}
 if(page==='about')return <div className="reading-layout"><aside><div className="brand text-4xl mb-6">AGYNEXA<span className="text-primary">.</span></div><OwnerIdentity/><Link href="/studio" className="text-link mt-6">{t(['Open Studio','افتح الاستوديو'])}<ArrowUpRight size={18}/></Link></aside><div>{data.sections.map(s=><article className="border-t pt-6 pb-10" key={s.title[0]}><h2>{t(s.title)}</h2><Body text={t(s.body)}/></article>)}</div></div>
 return <div className="reading-layout"><aside>{page==='architecture'||page==='agentnexos'?<SystemDiagram/>:<><ShieldCheck size={40} className="text-primary mb-6"/><h2 className="text-2xl text-foreground">{t(page==='security'?['Authority within the process','الصلاحيات داخل العملية']:['Design around real work','صمّم حول العمل الفعلي'])}</h2><p className="mt-6">{t(page==='security'?['Consider the information, actions and decisions that each role is responsible for.','اربط كل دور بمعلوماته وإجراءاته والقرارات التي يتولاها.']:['Use company context and representative cases to define and evaluate an agent’s responsibility.','استخدم سياق الشركة وحالات ممثلة لتحديد مسؤولية الوكيل وتقييمها.'])}</p></>}</aside><div>{data.sections.map((s,i)=><details key={s.title[0]} open={i===0}><summary>{t(s.title)}<Plus size={20} className="text-primary shrink-0"/></summary><Body text={t(s.body)}/></details>)}</div></div>
}
