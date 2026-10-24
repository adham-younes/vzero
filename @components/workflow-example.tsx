'use client'
import {FileText,ClipboardCheck,FileCheck2} from 'lucide-react'
import {useLanguage,Action} from './agynexa-shell'
import Link from './locale-link'
export default function WorkflowExample(){
 const {t}=useLanguage()
 const steps=[
  {Icon:FileText,title:['01 · The task','01 · المهمة'],text:['Compare two fictional supplier offers for 12 workstations.','قارن عرضين افتراضيين لتوريد 12 جهاز عمل.'],detail:['Inputs: quantity, budget and warranty terms.','المدخلات: الكمية والميزانية وشروط الضمان.']},
  {Icon:ClipboardCheck,title:['02 · The review','02 · المراجعة'],text:["Supplier B’s warranty is missing. Keep the available figures visible and identify the term to confirm.",'مدة ضمان المورد ب ناقصة. احتفظ بالأرقام المتاحة وحدّد الشرط المطلوب تأكيده.'],detail:['The reviewer checks the totals and unresolved information.','يفحص المراجع الإجماليات والمعلومات غير المحسومة.']},
  {Icon:FileCheck2,title:['03 · The record','03 · السجل'],text:['A comparison containing its assumptions and outstanding questions.','مقارنة تتضمن افتراضاتها وأسئلتها المفتوحة.'],detail:['Downloading the file does not approve or place an order.','تنزيل الملف لا يعتمد شراءً ولا ينفّذ طلبًا.']},
 ]
 return <section className="example-journey"><div className="section-heading"><div><p className="eyebrow">{t(['Purchasing review illustration','مثال لمراجعة مشتريات'])}</p><h2>{t(['What the reviewer needs before deciding','ما الذي يحتاجه المراجع قبل القرار؟'])}</h2></div><span className="tag">{t(['Fictional data','بيانات افتراضية'])}</span></div><ol className="flow-strip">{steps.map(({Icon,title,text,detail})=><li key={title[0]}><Icon size={28}/><h3 className="text-xl">{t(title)}</h3><p className="muted mt-4 text-base">{t(text)}</p><small>{t(detail)}</small></li>)}</ol><div className="flex flex-wrap gap-4 mt-8"><Action href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Action><Link className="quiet" href="/architecture">{t(['Agent architecture','بنية الوكيل'])}</Link></div><p className="muted text-sm mt-5">{t(['This comparison uses supplied assumptions. It is not a live purchasing connection or an approved supplier decision.','تستخدم المقارنة افتراضات مقدمة، ولا تمثل اتصال مشتريات حيًا أو قرارًا معتمدًا باختيار مورد.'])}</p></section>
}
