'use client'

import {ArrowRight,Workflow} from 'lucide-react'
import {useLanguage} from './agynexa-shell'
import styles from './public-process-visuals.module.css'

type Copy=readonly [string,string]
type Process={input:Copy;work:Copy;output:Copy}
const workflows:Record<string,Process>={
 knowledge:{input:['Approved company sources','مصادر الشركة المعتمدة'],work:['Find and explain the relevant information','استرجاع المعلومة المناسبة وشرحها'],output:['Answer with source references','إجابة بمراجع المصادر']},
 documents:{input:['Document and review criteria','مستند ومعايير المراجعة'],work:['Extract facts and flag missing information','استخلاص الحقائق وتحديد النواقص'],output:['Structured review brief','موجز منظم للمراجعة']},
 sales:{input:['Customer need and offer context','احتياج العميل وسياق العرض'],work:['Assess fit and open questions','تقييم الملاءمة والأسئلة المفتوحة'],output:['Qualification or proposal draft','موجز تأهيل أو مسودة عرض']},
 service:{input:['Customer issue and service policy','مشكلة العميل وسياسة الخدمة'],work:['Apply guidance to the case','تطبيق الإرشاد على الحالة'],output:['Reply or escalation draft','مسودة رد أو تصعيد']},
 finance:{input:['Financial records and rules','السجلات المالية والقواعد'],work:['Reconcile and explain differences','مطابقة البيانات وشرح الفروق'],output:['Report for financial review','تقرير للمراجعة المالية']},
 logistics:{input:['Shipment events and exception','أحداث الشحنة والاستثناء'],work:['Identify impacts and options','تحديد الآثار والخيارات'],output:['Operations review brief','موجز لمراجعة العمليات']},
 procurement:{input:['Supplier offers and requirements','عروض الموردين والمتطلبات'],work:['Compare terms and calculations','مقارنة الشروط والحسابات'],output:['Comparison for the buyer','مقارنة لمسؤول الشراء']},
 receivables:{input:['Balances and account context','الأرصدة وسياق الحساب'],work:['Identify follow-up priorities','تحديد أولويات المتابعة'],output:['Reviewable follow-up drafts','مسودات متابعة للمراجعة']},
 'customer-operations':{input:['Account request and obligations','طلب العميل والالتزامات'],work:['Organize dependencies and ownership','تنظيم الاعتماديات والمسؤوليات'],output:['Handover brief for the team','ملف تسليم للفريق']},
}
const capabilities:Record<string,Process>={
 'customer-service':workflows.service,
 'employee-operations':{input:['Employee request and policy','طلب الموظف والسياسة'],work:['Explain requirements and next steps','شرح المتطلبات والخطوات التالية'],output:['Request checklist for review','قائمة متطلبات للمراجعة']},
 'process-automation':{input:['Recurring task and business rules','مهمة متكررة وقواعد العمل'],work:['Prepare the next process step','تجهيز الخطوة التالية في العملية'],output:['Proposed work for approval','عمل مقترح للاعتماد']},
 'enterprise-knowledge':workflows.knowledge,
 'agent-orchestration':{input:['Roles and their responsibilities','الأدوار ومسؤولياتها'],work:['Define the handoff and dependencies','تحديد التسليم والاعتماديات'],output:['Coordination design to evaluate','تصميم تنسيق قابل للتقييم']},
 'enterprise-integrations':{input:['Required record or system action','السجل أو الإجراء المطلوب'],work:['Check interface and permissions','فحص الواجهة والصلاحيات'],output:['Defined connection requirements','متطلبات اتصال محددة']},
 'voice-agents':{input:['Conversation purpose and policy','غرض الحوار والسياسة'],work:['Test the role through text','اختبار الدور بالمحادثة النصية'],output:['Conversation and handover design','تصميم الحوار والإحالة']},
 'agent-assist':{input:['Case context and approved guidance','سياق الحالة والإرشاد المعتمد'],work:['Research and prepare the response','البحث وتجهيز الاستجابة'],output:['Draft for the employee to review','مسودة يراجعها الموظف']},
 'governance-security':{input:['Agent scope and information needs','نطاق الوكيل واحتياجه للمعلومات'],work:['Define authority and review points','تحديد الصلاحيات ونقاط المراجعة'],output:['Operating controls to agree','ضوابط تشغيل للاتفاق عليها']},
 'evaluation-observability':{input:['Acceptance cases and run history','حالات القبول وسجل التشغيل'],work:['Inspect evidence and corrections','فحص الأدلة والتصحيحات'],output:['Evaluation findings and next changes','نتائج التقييم والتغييرات التالية']},
}

export function TaskProcessVisual({slug,kind='workflow'}:{slug:string;kind?:'workflow'|'capability'}){
 const {t}=useLanguage();const process=(kind==='capability'?capabilities:workflows)[slug]
 if(!process)return null
 const steps=[{label:['Input','المدخل'],value:process.input},{label:['Agent responsibility','مسؤولية الوكيل'],value:process.work},{label:['Reviewable output','المخرج القابل للمراجعة'],value:process.output}]
 return <figure className={styles.visual}><div className={styles.captionTop}><Workflow size={16}/><span>{t(['The role at a glance','الدور في نظرة سريعة'])}</span></div><ol className={styles.nodes}>{steps.map((step,index)=><li className={styles.node} key={step.label[0]}><span className={styles.stage}>{t(step.label)}</span><strong>{t(step.value)}</strong>{index<steps.length-1&&<ArrowRight className={styles.arrow} size={16} aria-hidden="true"/>}</li>)}</ol><figcaption className={styles.note}>{t(['A task design to test. Connected actions need the relevant system access and an agreed production scope.','تصميم مهمة لاختباره. تحتاج الإجراءات المتصلة إلى صلاحيات النظام ونطاق إنتاجي متفق عليه.'])}</figcaption></figure>
}
