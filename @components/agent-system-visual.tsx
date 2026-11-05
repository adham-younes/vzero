'use client'

import {useId,useState} from 'react'
import {ArrowUpRight,Check,Code2,FileText,Layers3,ShieldCheck} from 'lucide-react'
import {useLanguage} from './agynexa-shell'
import Link from './locale-link'
import styles from './agent-system-visual.module.css'

const layers = [
  {
    id:'instructions', icon:FileText,
    title:['Instructions','التعليمات'],
    short:['Give the agent a clear responsibility.','حدّد للوكيل مسؤولية واضحة.'],
    description:['Define the task, the expected result and the rules it must follow. Edit the system prompt as your work changes.','حدّد المهمة والنتيجة المطلوبة والقواعد التي يتبعها الوكيل. عدّل تعليمات النظام عندما تتغير احتياجات العمل.'],
    input:['Your role, task and output requirements','الدور والمهمة ومتطلبات المخرج'],
    result:['A saved configuration you can revise','إعدادات محفوظة يمكنك تعديلها'],
    boundary:['Instructions describe the work. Access to tools is configured separately.','تصف التعليمات العمل المطلوب. تُحدد صلاحيات الأدوات بشكل مستقل.'],
  },
  {
    id:'context', icon:Layers3,
    title:['Context','المعرفة والسياق'],
    short:['Ground the work in your information.','اربط العمل بمعلوماتك.'],
    description:['Add approved text and explain the situation. Keep company facts traceable to their sources and make missing information visible.','أضف النصوص المعتمدة واشرح سياق المهمة. اربط حقائق الشركة بمصادرها وأظهر المعلومات التي ما زالت ناقصة.'],
    input:['Approved sources and the current conversation','المصادر المعتمدة والمحادثة الحالية'],
    result:['Answers with supporting evidence','إجابات يمكن مراجعة أدلتها'],
    boundary:['A connected account does not give the agent access to every business system.','ربط الحساب لا يمنح الوكيل وصولًا إلى جميع أنظمة العمل.'],
  },
  {
    id:'tools', icon:Code2,
    title:['Tools','الأدوات'],
    short:['Choose how the agent can work.','اختر الأدوات التي يعمل بها.'],
    description:['Enable current web research or isolated Python execution when the task needs them. Inspect the tool activity, source links and generated files.','فعّل البحث على الويب أو تشغيل Python في بيئة معزولة عندما تحتاجهما المهمة. راجع نشاط الأدوات وروابط المصادر والملفات الناتجة.'],
    input:['The tools you explicitly enable','الأدوات التي تفعّلها صراحةً'],
    result:['Research, calculations and reviewable files','أبحاث وحسابات وملفات قابلة للمراجعة'],
    boundary:['Customer systems and external actions require their own setup and authorization.','أنظمة العميل والإجراءات الخارجية تحتاج إعدادًا وصلاحيات مستقلة.'],
  },
  {
    id:'review', icon:ShieldCheck,
    title:['Review','المراجعة'],
    short:['Inspect the result before putting it to use.','راجع النتيجة قبل استخدامها.'],
    description:['Test the saved agent on a task you know. Check the answer and its evidence, then refine the configuration or discuss production activation.','اختبر الوكيل المحفوظ في مهمة تعرفها. راجع الإجابة وأدلتها، ثم حسّن الإعدادات أو ناقش تفعيل التشغيل الفعلي.'],
    input:['A completed test and its recorded results','اختبار مكتمل ونتائجه المسجلة'],
    result:['A decision to refine or request activation','قرار بالتحسين أو طلب التفعيل'],
    boundary:['Production access, price and terms are agreed by email after testing.','يُتفق على التشغيل الفعلي والسعر والشروط بالبريد بعد الاختبار.'],
  },
] as const

function LayerMark({index}:{index:number}){
  if(index===0)return <g><path d="M272 64 320 44 368 64 320 84Z"/><path d="m294 64 26-11 26 11M306 72l14-6 14 6"/></g>
  if(index===1)return <g><path d="m274 67 28-12 28 12-28 12Zm56 0 28-12 28 12-28 12Zm-28 24 28-12 28 12-28 12Z"/><path d="m302 79 14 6m28-6-14 6"/></g>
  if(index===2)return <g><path d="m300 56-27 12 27 12m40-24 27 12-27 12m-14-32-13 40"/></g>
  return <g><path d="m320 44 46 20-10 23-36 15-36-15-10-23Z"/><path d="m300 72 14 8 28-16"/></g>
}

export function AgentSystemVisual(){
  const {t,ar}=useLanguage()
  const [selected,setSelected]=useState(0)
  const id=useId()
  const current=layers[selected]
  return <section className={styles.system} aria-labelledby={`${id}-heading`}>
    <div className={styles.heading}>
      <div><p className={styles.kicker}>{t(['INSIDE YOUR AGENT','داخل وكيلك'])}</p><h2 id={`${id}-heading`}>{t(['A clear structure for useful work.','بنية واضحة لعمل مفيد.'])}</h2></div>
      <p>{t(['Shape what your agent knows, how it works and where your review belongs. Select a layer to see its role.','حدّد ما يعرفه الوكيل وكيف يعمل وأين تحتاج النتيجة إلى مراجعتك. اختر طبقة للتعرف على دورها.'])}</p>
    </div>

    <div className={styles.workbench}>
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.visualHeader}><span className={styles.statusDot}/><span>{t(['AGENT STRUCTURE','بنية الوكيل'])}</span><span className={styles.visualCounter} dir="ltr">0{selected+1} / 04</span></div>
        <svg className={styles.stack} viewBox="0 0 640 480" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className={styles.floor} d="m320 282 255 103-255 103L65 385Z"/>
          <path className={styles.guide} d="M100 135v230m440-230v230M320 45v353"/>
          {[3,2,1,0].map(index=>{
            const active=selected===index
            const y=47+index*68
            return <g key={layers[index].id} className={`${styles.layer} ${active?styles.activeLayer:''}`} style={{transform:`translateY(${y+(active?-9:0)}px)`}}>
              <path className={styles.sideLeft} d="m100 90 220 90v13L100 103Z"/>
              <path className={styles.sideRight} d="m320 180 220-90v13l-220 90Z"/>
              <path className={styles.plane} d="M320 0 540 90 320 180 100 90Z"/>
              <path className={styles.grid} d="m155 68 220 90m-165-113 220 90m-165-113 220 90M155 113l220-90m-165 113 220-90m-165 113 220-90"/>
              <path className={styles.innerFrame} d="m320 24 161 66-161 66-161-66Z"/>
              <g className={styles.layerSymbol}><LayerMark index={index}/></g>
              <path className={styles.labelRule} d="m421 142 44 18h90"/>
              <circle className={styles.labelDot} cx="421" cy="142" r="2.5"/>
              <text className={styles.layerNumber} x="565" y="164" textAnchor="end">0{index+1}</text>
              <path className={styles.frontAccent} d="m309 176 11 4 47-19"/>
            </g>
          })}
        </svg>
        <div className={styles.visualFooter}><span>{t(['Configured by you','أنت تحدّد الإعدادات'])}</span><span className={styles.currentLayer}><current.icon size={14}/>{t(current.title)}</span></div>
      </div>

      <div className={styles.controls}>
        <fieldset className={styles.layerSelector}>
          <legend className="sr-only">{t(['Explore the agent structure','استكشف بنية الوكيل'])}</legend>
          {layers.map((layer,index)=><label key={layer.id} className={`${styles.layerControl} ${selected===index?styles.selectedControl:''}`}>
            <input type="radio" name={`${id}-layer`} value={layer.id} checked={selected===index} onChange={()=>setSelected(index)} aria-controls={`${id}-detail`}/>
            <span className={styles.controlNumber} aria-hidden="true">0{index+1}</span>
            <span className={styles.controlCopy}><strong>{t(layer.title)}</strong><span>{t(layer.short)}</span></span>
            <span className={styles.controlIcon} aria-hidden="true">{selected===index?<Check size={16}/>:<layer.icon size={16}/>}</span>
          </label>)}
        </fieldset>
        <div className={styles.detail} id={`${id}-detail`} aria-live="polite" aria-atomic="true">
          <p className={styles.description}>{t(current.description)}</p>
          <div className={styles.flow}>
            <dl><dt>{t(['Starts with','يبدأ بـ'])}</dt><dd>{t(current.input)}</dd></dl>
            <span className={styles.flowArrow} aria-hidden="true">{ar?'←':'→'}</span>
            <dl><dt>{t(['Produces','ينتج عنه'])}</dt><dd>{t(current.result)}</dd></dl>
          </div>
          <p className={styles.boundary}><ShieldCheck size={14}/><span>{t(current.boundary)}</span></p>
        </div>
      </div>
    </div>

    <div className={styles.nextStep}><span>{t(['Start with one task. Refine the agent from the results.','ابدأ بمهمة واحدة، وحسّن الوكيل بناءً على النتائج.'])}</span><Link href="/studio">{t(['Build your agent','ابنِ وكيلك'])}<ArrowUpRight size={16}/></Link></div>
  </section>
}
