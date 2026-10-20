'use client'
import {useRef,useState} from 'react'
import {Download,Mail,Check,ArrowLeft} from 'lucide-react'
import {useLanguage} from './agynexa-shell'
import services from '@/lib/service-catalog.json'
import {AuthForm} from './account-ui'
import Link from './locale-link'

type BriefKey='organization'|'email'|'service'|'problem'|'sources'|'acceptance'
type Brief=Record<BriefKey,string>
const labels:Record<BriefKey,readonly string[]>={organization:['Organization','المؤسسة'],email:['Work email','بريد العمل'],service:['Service of interest','الخدمة المطلوبة'],problem:['What would you like to improve?','ما الذي تريد تحسينه؟'],sources:['Available systems and sources','الأنظمة والمصادر المتاحة'],acceptance:['What would success look like?','كيف ستقيّم نجاح التنفيذ؟']}
const prompts:Partial<Record<BriefKey,readonly string[]>>={organization:['Your company or team name','اسم شركتك أو فريقك'],email:['you@company.com','you@company.com'],problem:['For example: our team re-enters supplier quotes into spreadsheets.','مثال: يعيد فريقنا إدخال عروض الموردين في جداول البيانات.'],sources:['For example: an approved product list and sample quotes.','مثال: قائمة منتجات معتمدة وعينات عروض أسعار.'],acceptance:['For example: every price has a source and missing details are flagged.','مثال: لكل سعر مصدر، والمعلومات الناقصة تظهر بوضوح.']}
export default function ProjectBrief(){
 const {t}=useLanguage()
 const [fields,setFields]=useState<Brief>({organization:'',email:'',service:'',problem:'',sources:'',acceptance:''})
 const [payload,setPayload]=useState<Brief|null>(null)
 const [help,setHelp]=useState(false);const [errors,setErrors]=useState<Partial<Record<BriefKey,string>>>({})
 const [consent,setConsent]=useState(false);const [saving,setSaving]=useState(false);const [saved,setSaved]=useState('');const [saveError,setSaveError]=useState('');const [needsAuth,setNeedsAuth]=useState(false)
 const reviewRef=useRef<HTMLDivElement>(null);const formRef=useRef<HTMLFormElement>(null);const requestKey=useRef('')
 const result=payload?(Object.keys(labels) as BriefKey[]).map(key=>`${t(labels[key])}: ${payload[key]}`).join('\n\n'):''
 function update(key:BriefKey,value:string){setFields(previous=>({...previous,[key]:value}));setErrors(previous=>({...previous,[key]:undefined}))}
 function review(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault()
  const invalid:Partial<Record<BriefKey,string>>={}
  for(const key of ['organization','email','problem','sources','acceptance'] as BriefKey[]){
   if(help&&(key==='sources'||key==='acceptance'))continue
   if(!fields[key].trim())invalid[key]=t(['Please complete this field.','أكمل هذا الحقل.'])
  }
  if(fields.email.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))invalid.email=t(['Enter a valid email address.','أدخل عنوان بريد صحيحًا.'])
  setErrors(invalid)
  const first=Object.keys(invalid)[0]
  if(first){formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();return}
  const pending=t(['To be defined together during discovery.','يُحدّد بالتعاون أثناء مناقشة المتطلبات.'])
  setPayload({...fields,service:fields.service||t(['Help me choose a service','أحتاج مساعدة في اختيار الخدمة']),sources:fields.sources.trim()||pending,acceptance:fields.acceptance.trim()||pending})
  requestKey.current=crypto.randomUUID();setSaved('');setSaveError('');setNeedsAuth(false);setConsent(false)
  requestAnimationFrame(()=>reviewRef.current?.focus())
 }
 async function save(){
  if(!payload||!consent||saving)return
  setSaving(true);setSaveError('')
  try{
   const response=await fetch('/api/v1/project-briefs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,requestKey:requestKey.current,consent})})
   if(response.status===401){setNeedsAuth(true);return}
   const data=await response.json()
   if(!response.ok){setSaveError(response.status===429?t(['Daily limit reached. Try again later.','وصلت للحد اليومي. حاول لاحقًا.']):t(['Could not save. Please try again.','تعذر الحفظ. حاول مرة أخرى.']));return}
   setSaved(data.brief.id);setNeedsAuth(false)
  }catch{setSaveError(t(['Connection failed. Please try again.','تعذر الاتصال. حاول مرة أخرى.']))}finally{setSaving(false)}
 }
 function download(){const url=URL.createObjectURL(new Blob([result],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='agynexa-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 function field(key:Exclude<BriefKey,'service'>,multiline=false){
  const required=!(help&&(key==='sources'||key==='acceptance'))
  const props={id:`brief-${key}`,name:key,value:fields[key],onChange:(event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>update(key,event.target.value),required,maxLength:key==='organization'?100:key==='email'?150:1500,className:'field',placeholder:t(prompts[key]!), 'aria-invalid':!!errors[key],'aria-describedby':errors[key]?`brief-${key}-error`:undefined}
  return <div><label htmlFor={props.id}>{t(labels[key])}{required&&<span className="required-mark" aria-hidden="true">*</span>}{!required&&<span className="muted text-sm"> {t(['(optional)','(اختياري)'])}</span>}</label>{multiline?<textarea {...props} rows={3}/>:<input {...props} type={key==='email'?'email':'text'} dir={key==='email'?'ltr':undefined} autoComplete={key==='email'?'email':'organization'}/>} {errors[key]&&<span id={`brief-${key}-error`} className="field-error">{errors[key]}</span>}</div>
 }
 return <div className="brief-layout"><div>
  <form ref={formRef} className="brief-form" hidden={!!payload} noValidate onSubmit={review}>
   <p className="muted text-sm">{t(['Fields marked * are required. A general description is enough to start.','الحقول بعلامة * مطلوبة. وصف عام يكفي للبداية.'])}</p>
   <div className="field-row">{field('organization')}{field('email')}</div>
   <label>{t(labels.service)}<select name="service" className="field" value={fields.service} onChange={e=>update('service',e.target.value)}><option value="">{t(['Help me choose a service','أحتاج مساعدة في اختيار الخدمة'])}</option>{services.map(s=><option key={s.slug} value={t(s.title)}>{t(s.title)}</option>)}</select></label>
   {field('problem',true)}
   <label className="help-choice"><input type="checkbox" checked={help} onChange={e=>{setHelp(e.target.checked);setErrors(previous=>({...previous,sources:undefined,acceptance:undefined}))}}/><span>{t(['I need help defining the sources and success criteria.','أحتاج مساعدة في تحديد المصادر ومعايير النجاح.'])}<span className="field-help">{t(['You can leave the next two fields blank. We will define them together.','يمكنك ترك الحقلين التاليين فارغين وتحديدهما معنا لاحقًا.'])}</span></span></label>
   {field('sources',true)}{field('acceptance',true)}
   <p className="muted text-sm">{t(['Do not include passwords, personal records or confidential documents. Your draft stays on this page until you choose to save, download or share it.','لا تُدرج كلمات مرور أو سجلات شخصية أو مستندات سرية. يبقى الموجز في هذه الصفحة إلى أن تختار حفظه أو تنزيله أو مشاركته.'])}</p>
   {Object.values(errors).some(Boolean)&&<p role="alert" className="error-message">{t(['Review the highlighted fields before continuing.','راجع الحقول الموضحة قبل المتابعة.'])}</p>}
   <button className="action justify-self-start" type="submit">{t(['Review your brief','راجع الموجز'])}</button>
  </form>
  {payload&&<div ref={reviewRef} tabIndex={-1} className="review-box">
   <div className="flex gap-3 items-center mb-6"><Check className="text-primary shrink-0"/><h2 className="text-2xl">{t(['Review before sharing','راجع قبل المشاركة'])}</h2></div>
   <dl className="brief-review">{(Object.keys(labels) as BriefKey[]).map(key=><div key={key}><dt>{t(labels[key])}</dt><dd dir={key==='email'?'ltr':'auto'}>{payload[key]}</dd></div>)}</dl>
   <label className="flex items-start gap-3 border-t pt-6 mt-6 text-sm"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>{t(['I have reviewed this brief and am authorized to share it with AGYNEXA.','راجعت الموجز ولديّ صلاحية مشاركته مع AGYNEXA.'])}</label>
   <div className="share-options">
    <div className="share-option"><h3 className="text-lg">{t(['Keep it in your account','احفظه في حسابك'])}</h3><p>{t(['Sign in to save and return to this brief. Saving sends no email.','سجّل الدخول لحفظ الموجز والرجوع إليه. الحفظ لا يرسل بريدًا.'])}</p><button type="button" className="action" disabled={!consent||saving||!!saved} onClick={save}>{saved?t(['Saved','تم الحفظ']):saving?t(['Saving…','جارٍ الحفظ…']):t(['Save to my account','حفظ في حسابي'])}</button></div>
    <div className="share-option"><h3 className="text-lg">{t(['Download and email','نزّله وشاركه بالبريد'])}</h3><p>{t(['Download the file, then attach it in your email app and send it yourself.','نزّل الملف ثم أرفقه في تطبيق بريدك وأرسله بنفسك.'])}</p><button type="button" className="quiet" disabled={!consent} onClick={download}><Download size={17}/>{t(['Download brief','تنزيل الموجز'])}</button>{consent&&<a className="text-link mt-2" href={`mailto:adham@agynexa.si?subject=${encodeURIComponent(`AGYNEXA project — ${payload.organization}`)}&body=${encodeURIComponent(t(['Hello Adham,\nI would like to discuss the attached project brief.\n\nPlease attach the downloaded agynexa-project-brief.txt before sending.','مرحبًا أدهم،\nأرغب في مناقشة موجز المشروع المرفق.\n\nيرجى إرفاق ملف agynexa-project-brief.txt الذي نزّلته قبل الإرسال.']))}`}><Mail size={17}/>{t(['Open email draft','فتح مسودة البريد'])}</a>}</div>
   </div>
   <div aria-live="polite">{saved&&<p className="mt-5">{t(['Your brief is saved.','تم حفظ موجزك.'])} <Link className="text-link" href="/account">{t(['View in your account','عرض في حسابك'])}</Link></p>}{saveError&&<p role="alert" className="error-message mt-5">{saveError}</p>}</div>
   {needsAuth&&<div className="panel mt-6 max-w-lg"><h3 className="text-xl mb-5">{t(['Sign in to save your brief','سجّل الدخول لحفظ موجزك'])}</h3><AuthForm onSuccess={()=>{setNeedsAuth(false);setSaveError(t(['Signed in. Press Save to store your brief.','تم تسجيل الدخول. اضغط حفظ لتخزين موجزك.']))}}/></div>}
   <p className="muted text-sm mt-5">{t(['If no email app opens, attach the downloaded file and send it to adham@agynexa.si.','إذا لم يفتح تطبيق البريد، أرفق الملف المنزّل وأرسله إلى adham@agynexa.si.'])}</p>
   <button type="button" className="text-link mt-4" disabled={saving} onClick={()=>{setPayload(null);setConsent(false);requestAnimationFrame(()=>formRef.current?.querySelector<HTMLElement>('input')?.focus())}}><ArrowLeft size={16}/>{t(['Edit brief','تعديل الموجز'])}</button>
  </div>}
 </div><aside className="brief-aside"><h2 className="text-2xl">{t(['What happens next','ماذا بعد؟'])}</h2><ol>{[['Describe the task and expected output.','صِف المهمة والمخرج المتوقع.'],['Review your brief and save it to your account or share it by email.','راجع الموجز واحفظه في حسابك أو شاركه بالبريد.'],['Agree scope, access and acceptance criteria.','اتفق على النطاق والوصول ومعايير القبول.']].map((copy,i)=><li key={i}><span className="text-primary me-3">{i+1}</span>{t(copy)}</li>)}</ol><p className="muted mt-8 text-sm">{t(['Delivery scope, schedule and cost are agreed for your project after reviewing the requirements.','يُتفق على نطاق التسليم والمدة والتكلفة لمشروعك بعد مراجعة المتطلبات.'])}</p><a href="mailto:adham@agynexa.si" className="text-link mt-4" dir="ltr">adham@agynexa.si</a></aside></div>
}
