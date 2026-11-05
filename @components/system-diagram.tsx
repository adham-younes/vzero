'use client'
import {useLanguage} from './agynexa-shell'
import {ArrowDown,BookOpen,BrainCircuit,Code2,FileCheck2,Globe2,ShieldCheck,SlidersHorizontal} from 'lucide-react'
import styles from './public-process-visuals.module.css'

export default function SystemDiagram(){
 const {t}=useLanguage()
 return <figure className={styles.system}>
  <div className={styles.systemHeading}><span>AGYNEXA / {t(['Agent workspace','مساحة الوكيل'])}</span><ShieldCheck size={18}/></div>
  <div className={styles.systemBody}>
   <div className={styles.inputs}><div className={styles.input}><SlidersHorizontal size={17}/><span>{t(['Your instructions','تعليماتك'])}</span></div><div className={styles.input}><BookOpen size={17}/><span>{t(['Company knowledge','معرفة الشركة'])}</span></div></div>
   <ArrowDown className={styles.connector} size={20} aria-hidden="true"/>
   <div className={styles.engine}><span><BrainCircuit size={18}/>{t(['Agent conversation','محادثة الوكيل'])}</span><strong>{t(['Your agent','وكيلك'])}</strong><p>{t(['Uses your instructions, sources and enabled tools','يستخدم تعليماتك ومراجعك والأدوات التي تختارها'])}</p><div className={styles.tools}><span><Globe2 size={14}/>{t(['Web research','بحث الويب'])}</span><span><Code2 size={14}/>{t(['Python analysis','تحليل Python'])}</span></div></div>
   <ArrowDown className={styles.connector} size={20} aria-hidden="true"/>
   <div className={styles.outcome}><FileCheck2 size={22}/><div><strong>{t(['Saved answer and references','إجابة محفوظة ومراجع للمراجعة'])}</strong><p>{t(['Tool activity and generated files when available','نشاط الأدوات والملفات الناتجة عند توفرها'])}</p></div></div>
  </div>
  <figcaption>{t(['Your workspace keeps the conversation and returned results. You can review them and continue the task later.','تحفظ مساحة العمل المحادثة والنتائج لتراجعها وتستكمل المهمة لاحقًا.'])}</figcaption>
 </figure>
}
