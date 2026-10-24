'use client'
import {useRef,useState} from 'react'
import {Download,Mail,Check,ArrowLeft} from 'lucide-react'
import {useLanguage} from './agynexa-shell'
import services from '@/lib/service-catalog.json'
import {AuthForm} from './account-ui'
import Link from './locale-link'

type BriefKey='organization'|'email'|'service'|'problem'|'sources'|'acceptance'
type Brief=Record<BriefKey,string>
export type ProjectBriefInitial=Partial<Pick<Brief,'problem'|'sources'|'acceptance'|'service'>>
const labels:Record<BriefKey,readonly string[]>={organization:['Organization','المؤسسة'],email:['Contact email','بريد التواصل'],service:['Capability area','مجال العمل'],problem:['Task and problem','المهمة والمشكلة'],sources:['Available information and systems','المعلومات والأنظمة المتاحة'],acceptance:['Expected output and checks','النتيجة المتوقعة وفحوصها']}
const prompts:Partial<Record<BriefKey,readonly string[]>>={organization:['Your company or team name','اسم شركتك أو فريقك'],email:['you@company.com','you@company.com'],problem:['For example: a service request moves between teams without its full history.','مثال: ينتقل طلب الخدمة بين الأقسام دون تاريخه الكامل.'],sources:['For example: service procedures, case notes and the application that holds the record.','مثال: إجراءات الخدمة وملاحظات الحالات والنظام الذي يحفظها.'],acceptance:['For example: the next team receives the relevant facts and a clear owner for unresolved work.','مثال: يستلم الفريق التالي الحقائق اللازمة ويتحدد المسؤول عن العمل المتبقي.']}
export default function ProjectBrief({initialValues={},requireService=false}:{initialValues?:ProjectBriefInitial;requireService?:boolean}={}){
 const {t}=useLanguage()
 const [fields,setFields]=useState<Brief>({organization:'',email:'',service:services.some(s=>s.title.includes(initialValues.service||'missing'))?initialValues.service||'':'',problem:(initialValues.problem||'').slice(0,1500),sources:(initialValues.sources||'').slice(0,1500),acceptance:(initialValues.acceptance||'').slice(0,1500)})
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
  if(requireService&&!services.some(s=>s.title.includes(fields.service)))invalid.service=t(['Choose a service before saving this brief.','اختر خدمة قبل حفظ سجل التخطيط.'])
  setErrors(invalid)
  const first=Object.keys(invalid)[0]
  if(first){formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();return}
  const pending=t(['Not yet defined — needs review.','لم يُحدد بعد — يحتاج مراجعة.'])
  setPayload({...fields,service:fields.service||t(['Leave the capability area for definition','اترك مجال العمل للتحديد']),sources:fields.sources.trim()||pending,acceptance:fields.acceptance.trim()||pending})
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
   if(!response.ok){setSaveError(response.status===429?t(['Daily limit reached. Try again later.','وصلت للحد اليومي. حاول لاحقًا.']):t(['The brief could not be saved. Check your account before trying again.','تعذّر حفظ سجل التخطيط. راجع حسابك قبل المحاولة مجددًا.']));return}
   setSaved(data.brief.id);setNeedsAuth(false)
  }catch{setSaveError(t(['The brief could not be saved. Check your account before trying again.','تعذّر حفظ سجل التخطيط. راجع حسابك قبل المحاولة مجددًا.']))}finally{setSaving(false)}
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
   <label>{t(labels.service)}<select name="service" required={requireService} aria-invalid={!!errors.service} className="field" value={fields.service} onChange={e=>update('service',e.target.value)}><option value="">{t(['Leave the capability area for definition','اترك مجال العمل للتحديد'])}</option>{services.map(s=><option key={s.slug} value={t(s.title)}>{t(s.title)}</option>)}</select>{errors.service&&<span className="field-error">{errors.service}</span>}</label>
   {field('problem',true)}
   <label className="help-choice"><input type="checkbox" checked={help} onChange={e=>{setHelp(e.target.checked);setErrors(previous=>({...previous,sources:undefined,acceptance:undefined}))}}/><span>{t(['I need help defining sources and acceptance criteria.','أحتاج مساعدة في تحديد المصادر ومعايير القبول.'])}<span className="field-help">{t(['Those fields can remain unresolved in the brief.','يمكن إبقاء هذين الحقلين غير محسومين في سجل التخطيط.'])}</span></span></label>
   {field('sources',true)}{field('acceptance',true)}
   <p className="muted text-sm">{t(['Do not include passwords, personal records or confidential documents. Your draft stays on this page until you choose to save, download or share it.','لا تُدرج كلمات مرور أو سجلات شخصية أو مستندات سرية. يبقى سجل التخطيط في هذه الصفحة إلى أن تختار حفظه أو تنزيله أو مشاركته.'])}</p>
   {Object.values(errors).some(Boolean)&&<p role="alert" className="error-message">{t(['Review the highlighted fields before continuing.','راجع الحقول الموضحة قبل المتابعة.'])}</p>}
   <button className="action justify-self-start" type="submit">{t(['Review plan','مراجعة الخطة'])}</button>
  </form>
  {payload&&<div ref={reviewRef} tabIndex={-1} className="review-box">
   <div className="flex gap-3 items-center mb-6"><Check className="text-primary shrink-0"/><h2 className="text-2xl">{t(['Review your planning record','راجع سجل التخطيط'])}</h2></div>
   <dl className="brief-review">{(Object.keys(labels) as BriefKey[]).map(key=><div key={key}><dt>{t(labels[key])}</dt><dd dir={key==='email'?'ltr':'auto'}>{payload[key]}</dd></div>)}</dl>
   <label className="flex items-start gap-3 border-t pt-6 mt-6 text-sm"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>{t(['I have reviewed the brief and agree to save it privately in my account. Email and other external sharing are separate choices I make.','راجعت سجل التخطيط وأوافق على حفظه بشكل خاص في حسابي. الإرسال بالبريد أو أي مشاركة خارجية قرار مستقل أتخذه بنفسي.'])}</label>
   <div className="share-options">
    <div className="share-option"><h3 className="text-lg">{t(['Keep it in your account','احفظه في حسابك'])}</h3><p>{t(['Keep a private copy for later. This does not send it to AGYNEXA or notify anyone.','احتفظ بنسخة خاصة للرجوع إليها. هذا لا يرسلها إلى AGYNEXA ولا يُشعر أحدًا.'])}</p><button type="button" className="action" disabled={!consent||saving||!!saved} onClick={save}>{saved?t(['Saved','تم الحفظ']):saving?t(['Saving…','جارٍ الحفظ…']):t(['Save to my account','حفظ في حسابي'])}</button></div>
    <div className="share-option"><h3 className="text-lg">{t(['Download and email','نزّله وشاركه بالبريد'])}</h3><p>{t(['Download the file, attach it in your email app and send it yourself. Opening a draft does not attach or send the file.','نزّل الملف وأرفقه في تطبيق بريدك وأرسله بنفسك. فتح المسودة لا يرفق الملف ولا يرسله.'])}</p><button type="button" className="quiet" disabled={!consent} onClick={download}><Download size={17}/>{t(['Download plan','تنزيل الخطة'])}</button>{consent&&<a className="text-link mt-2" href={`mailto:adham@agynexa.si?subject=${encodeURIComponent(`AGYNEXA workflow brief — ${payload.organization}`)}&body=${encodeURIComponent(t(['Hello Adham,\nI would like to discuss the attached workflow brief.\n\nPlease attach the downloaded agynexa-project-brief.txt before sending.','مرحبًا أدهم،\nأرغب في مناقشة خطة سير العمل المرفقة.\n\nيرجى إرفاق ملف agynexa-project-brief.txt الذي نزّلته قبل الإرسال.']))}`}><Mail size={17}/>{t(['Open email draft','فتح مسودة البريد'])}</a>}</div>
   </div>
   <div aria-live="polite">{saved&&<p className="mt-5">{t(['Saved to your account. Nobody has been notified.','حُفظ في حسابك. لم يُشعر أحد.'])} <Link className="text-link" href="/account">{t(['View in your account','عرض في حسابك'])}</Link></p>}{saveError&&<p role="alert" className="error-message mt-5">{saveError}</p>}</div>
   {needsAuth&&<div className="panel mt-6 max-w-lg"><h3 className="text-xl mb-5">{t(['Sign in to save the plan','سجّل الدخول لحفظ خطتك'])}</h3><AuthForm onSuccess={()=>{setNeedsAuth(false);setSaveError(t(['Signed in. Press Save to store your brief.','تم تسجيل الدخول. اضغط حفظ لتخزين خطتك.']))}}/></div>}
   <p className="muted text-sm mt-5">{t(['If no email app opens, attach the downloaded file and send it to adham@agynexa.si.','إذا لم يفتح تطبيق البريد، أرفق الملف المنزّل وأرسله إلى adham@agynexa.si.'])}</p>
   <button type="button" className="text-link mt-4" disabled={saving} onClick={()=>{setPayload(null);setConsent(false);requestAnimationFrame(()=>formRef.current?.querySelector<HTMLElement>('input')?.focus())}}><ArrowLeft size={16}/>{t(['Edit plan','تعديل الخطة'])}</button>
  </div>}
 </div><aside className="brief-aside"><h2 className="text-2xl">{t(['Choose your next step','اختر خطوتك التالية'])}</h2><ol>{[['Describe the task and expected output.','صِف المهمة والمخرج المتوقع.'],['Review your brief and save it to your account or share it by email.','راجع سجل التخطيط واحفظه في حسابك أو شاركه بالبريد.'],['Keep the brief as a reference for the agent’s role, information and review.','احتفظ بسجل التخطيط مرجعًا لدور الوكيل ومعلوماته ومراجعته.']].map((copy,i)=><li key={i}><span className="text-primary me-3">{i+1}</span>{t(copy)}</li>)}</ol><p className="muted mt-8 text-sm">{t(['Preparing or saving the brief does not generate, run or deploy a system.','إعداد سجل التخطيط أو حفظه لا ينشئ نظامًا أو يشغّله أو ينشره.'])}</p><a href="mailto:adham@agynexa.si" className="text-link mt-4" dir="ltr">adham@agynexa.si</a></aside></div>
}
