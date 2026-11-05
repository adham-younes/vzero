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
   <div className={styles.engine}><span><BrainCircuit size={18}/>{t(['Private task','مهمة خاصة'])}</span><strong>{t(['Your configured agent','وكيلك بالإعدادات التي اخترتها'])}</strong><p>{t(['OpenAI reasoning with the tools you enable','استدلال OpenAI بالأدوات التي تفعّلها'])}</p><div className={styles.tools}><span><Globe2 size={14}/>{t(['Web research','بحث الويب'])}</span><span><Code2 size={14}/>{t(['Python analysis','تحليل Python'])}</span></div></div>
   <ArrowDown className={styles.connector} size={20} aria-hidden="true"/>
   <div className={styles.outcome}><FileCheck2 size={22}/><div><strong>{t(['A result your team can review','نتيجة يستطيع فريقك مراجعتها'])}</strong><p>{t(['Answer, evidence, tool activity and available files','إجابة وأدلة ونشاط الأدوات والملفات المتاحة'])}</p></div></div>
  </div>
  <figcaption>{t(['Studio saves the work in your private workspace. Production activation and external system connections are agreed separately after the test.','يحفظ الاستوديو العمل داخل مساحتك الخاصة. يُتفق على التفعيل الإنتاجي والاتصالات الخارجية بصورة مستقلة بعد التجربة.'])}</figcaption>
 </figure>
}
