'use client'
import {FileText,ClipboardCheck,FileCheck2} from 'lucide-react'
import {useLanguage,Action} from './agynexa-shell'
import Link from './locale-link'
export default function WorkflowExample(){
 const {t}=useLanguage()
 const steps=[
  {Icon:FileText,title:['01 · Task','01 · المهمة'],text:['Prepare a comparison for 12 workstations using two fictional supplier quotes.','جهّز مقارنة لشراء 12 جهاز عمل من عرضَي موردين افتراضيين.'],detail:['Inputs: quantity, budget and warranty terms.','المدخلات: الكمية والميزانية وشروط الضمان.']},
  {Icon:ClipboardCheck,title:['02 · Review','02 · المراجعة'],text:['Supplier B has no warranty term. Ask for clarification before a decision.','مدة الضمان غير مذكورة لدى المورد ب. اطلب استكمالها قبل القرار.'],detail:['The reviewer sees the missing information and the totals.','المسؤول يرى المعلومات الناقصة والإجماليات.']},
  {Icon:FileCheck2,title:['03 · Output','03 · المخرج'],text:['A comparison file with the assumptions and issues to resolve.','ملف مقارنة بالافتراضات والنقاط المطلوب حسمها.'],detail:['Downloading the file does not approve or place an order.','تنزيل الملف لا يعتمد شراءً ولا ينفّذ طلبًا.']},
 ]
 return <section className="example-journey"><div className="section-heading"><div><p className="eyebrow">{t(['Illustrative workflow','مسار توضيحي'])}</p><h2>{t(['A task. A review. A useful output.','مهمة واضحة. مراجعة. مخرج مفيد.'])}</h2></div><span className="tag">{t(['Fictional data','بيانات افتراضية'])}</span></div><ol className="flow-strip">{steps.map(({Icon,title,text,detail})=><li key={title[0]}><Icon size={28}/><h3 className="text-xl">{t(title)}</h3><p className="muted mt-4 text-base">{t(text)}</p><small>{t(detail)}</small></li>)}</ol><div className="flex flex-wrap gap-4 mt-8"><Action href="/solutions/procurement#review-workspace">{t(['Try the comparison','جرّب المقارنة'])}</Action><Link className="quiet" href="/studio">{t(['Open Agent Studio','افتح استوديو الوكلاء'])}</Link></div><p className="muted text-sm mt-5">{t(['AgentNexOS describes the wider workspace direction. The current Studio supports knowledge answers and reviewed internal support requests; this example does not imply a live procurement connection.','تصف AgentNexOS التوجه لمساحة عمل أوسع. يدعم الاستوديو الحالي إجابات المعرفة وطلبات الدعم الداخلية بعد المراجعة؛ هذا المثال لا يعني اتصال مشتريات فعليًا.'])}</p></section>
}
