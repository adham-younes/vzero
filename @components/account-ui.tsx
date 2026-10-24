'use client'
import Breadcrumbs from './breadcrumbs'
import {useEffect,useState,useId} from 'react'
import {Eye,EyeOff} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useLanguage} from './agynexa-shell'
import Link from './locale-link'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import services from '@/lib/service-catalog.json'
import {solutions} from '@/lib/agynexa'

const errors:Record<string,readonly string[]>={
 delete_failed:['The record could not be deleted. Refresh its status before trying again.','تعذّر حذف السجل. حدّث حالته قبل المحاولة مجددًا.'],
 invalid_credentials:['The email address or password is incorrect. Check your details and try again.','البريد الإلكتروني أو كلمة المرور غير صحيحة. راجع البيانات وحاول مرة أخرى.'],
 registration_failed:['Unable to create this account. Check your details, or sign in if you already have an account.','تعذر إنشاء الحساب. راجع البيانات أو سجّل الدخول إذا كان لديك حساب بالفعل.'],
 invalid_password:['Use a password of 12–128 characters.','استخدم كلمة مرور من 12 إلى 128 حرفًا.'],
 try_later:['Too many attempts. Wait before trying again.','تجاوزت عدد المحاولات المسموح. انتظر قبل المحاولة مجددًا.'],
 created_sign_in_required:['Your account was created. Please sign in to continue.','تم إنشاء حسابك. سجّل الدخول للمتابعة.'],
 temporarily_unavailable:['The service is temporarily unavailable. Please try again.','الخدمة غير متاحة مؤقتًا. حاول مرة أخرى.'],
}
/** Allow only local product destinations; never carry business text through URLs. */
export function safeAuthReturn(value:string|null,ar:boolean){
 const fallback=ar?'/ar/studio':'/studio'
 if(!value||!value.startsWith('/')||value.startsWith('//')||value.includes('\\'))return fallback
 try{const url=new URL(value,'https://agynexa.invalid');if(url.origin!=='https://agynexa.invalid'||!/^\/(?:ar\/)?(?:studio|account|start)$/.test(url.pathname))return fallback
  const query=new URLSearchParams();const service=url.searchParams.get('service');const solution=url.searchParams.get('solution')
  if(service&&services.some(item=>item.slug===service))query.set('service',service)
  if(solution&&solutions.some(item=>item.slug===solution))query.set('solution',solution)
  return url.pathname+(query.size?'?'+query.toString():'')
 }catch{return fallback}
}
export function AuthForm({initialMode='login',onSuccess}:{initialMode?:'login'|'register';onSuccess?:()=>void}){
 const {t,ar}=useLanguage();const router=useRouter();const [mode,setMode]=useState(initialMode);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [showPassword,setShowPassword]=useState(false);const passwordId=useId()
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();setBusy(true);setError('');const data=new FormData(event.currentTarget)
  try{const response=await fetch(`/api/auth/${mode}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.get('name'),email:data.get('email'),password:data.get('password')})});const result=await response.json()
   if(!response.ok){setError(result.error||'temporarily_unavailable');return}
   if(onSuccess)onSuccess();else{const params=new URLSearchParams(window.location.search);router.push(safeAuthReturn(params.get('returnTo')||params.get('next'),ar));router.refresh()}
  }catch{setError('temporarily_unavailable')}finally{setBusy(false)}
 }
 return <form className="grid gap-5" onSubmit={submit}>
  {mode==='register'&&<label className="grid gap-2">{t(['Display name','اسم العرض'])}<Input name="name" autoComplete="name" required maxLength={100}/></label>}
  <label className="grid gap-2">{t(['Email address','البريد الإلكتروني'])}<Input name="email" type="email" dir="ltr" autoComplete="email" required maxLength={254}/></label>
  <div className="grid gap-2"><label htmlFor={passwordId}>{t(['Password','كلمة المرور'])}</label><div className="password-control"><Input id={passwordId} name="password" type={showPassword?'text':'password'} dir="ltr" autoComplete={mode==='register'?'new-password':'current-password'} required minLength={mode==='register'?12:1} maxLength={128}/><button type="button" className="password-toggle" aria-label={t(showPassword?['Hide password','إخفاء كلمة المرور']:['Show password','إظهار كلمة المرور'])} aria-pressed={showPassword} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></div>
  {mode==='register'&&<p className="muted text-sm">{t(['Use 12 to 128 characters. Registration does not verify ownership of your email address.','استخدم من 12 إلى 128 حرفًا. لا يتحقق التسجيل من ملكية البريد الإلكتروني.'])}</p>}
  {error&&<p role="alert" className="text-sm">{t(errors[error]||errors.temporarily_unavailable)}</p>}
  <Button type="submit" disabled={busy} size="lg">{busy?t(['Please wait…','جارٍ التنفيذ…']):t(mode==='register'?['Create account','إنشاء حساب']:['Sign in','تسجيل الدخول'])}</Button>
  <button type="button" className="text-link justify-self-start" disabled={busy} onClick={()=>{setMode(mode==='login'?'register':'login');setError('');setShowPassword(false)}}>{t(mode==='login'?['New here? Create an account','مستخدم جديد؟ أنشئ حسابًا']:['Already registered? Sign in','لديك حساب؟ سجّل الدخول'])}</button>
  <p className="muted text-sm mt-6">{t(['Password recovery is not available through the service. Keep your sign-in details secure.','استعادة كلمة المرور غير متاحة عبر الخدمة. احتفظ ببيانات دخولك في مكان آمن.'])}</p>
 </form>
}
export function AuthPage({mode}:{mode:'login'|'register'}){const {t}=useLanguage();return <main id="main" className="container account-page"><div className="max-w-lg mx-auto"><Breadcrumbs/><h1 className="text-4xl mb-6">{t(mode==='register'?['Create your private workspace','أنشئ مساحة عملك الخاصة']:['Sign in to your workspace','سجّل الدخول إلى مساحتك'])}</h1><p className="muted mb-10">{t(mode==='register'?['Create private agents, add company knowledge and return to your conversations. Your workspace has one account owner.','أنشئ وكلاء خاصين وأضف معرفة الشركة وارجع إلى محادثاتك. لكل مساحة مالك حساب واحد.']:['Open your private agents and continue the work saved in your account.','افتح وكلاءك الخاصين وتابع العمل المحفوظ في حسابك.'])}</p><AuthForm initialMode={mode}/>{mode==='register'&&<p className="muted text-sm mt-6">{t(['Before you continue, read the Privacy notice and Usage terms. Password recovery and self-service whole-account deletion are unavailable. Begin with non-sensitive examples.','قبل المتابعة، اقرأ إشعار الخصوصية وشروط الاستخدام. استعادة كلمة المرور وحذف الحساب بالكامل ذاتيًا غير متاحين. ابدأ بأمثلة غير حساسة.'])} <Link className="text-link" href="/privacy">{t(['Privacy notice','إشعار الخصوصية'])}</Link> · <Link className="text-link" href="/terms">{t(['Usage terms','شروط الاستخدام'])}</Link></p>}</div></main>}

type Brief={id:string;organization:string;contact_email:string;service:string;problem:string;sources:string;acceptance:string;created_at:string}
export function AccountPage(){
 const {t,ar}=useLanguage();const router=useRouter();const [user,setUser]=useState<{displayName:string;email:string}|null>(null);const [briefs,setBriefs]=useState<Brief[]>([]);const [state,setState]=useState('loading');const [busy,setBusy]=useState('');const [error,setError]=useState('');const [confirm,setConfirm]=useState('');const [briefState,setBriefState]=useState('loading')
 async function loadBriefs(){
  setBriefState('loading')
  try{
   const response=await fetch('/api/v1/project-briefs',{cache:'no-store'})
   if(response.status===401){setUser(null);setBriefs([]);setState('signedout');return}
   if(!response.ok)throw Error()
   setBriefs((await response.json()).briefs);setBriefState('ready')
  }catch{setBriefState('error')}
 }
 async function load(){
  setState('loading');setUser(null);setBriefs([])
  try{
   const response=await fetch('/api/account',{cache:'no-store'})
   if(response.status===401){setState('signedout');return}
   if(!response.ok)throw Error()
   setUser((await response.json()).user);setState('ready');await loadBriefs()
  }catch{setState('error')}
 }
 useEffect(()=>{void load()},[])
 async function logout(){setBusy('logout');setError('');try{const r=await fetch('/api/auth/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(!r.ok)throw Error();setUser(null);setBriefs([]);router.replace(ar?'/ar/login':'/login');router.refresh()}catch{setError('temporarily_unavailable')}finally{setBusy('')}}
 function downloadBrief(brief:Brief){const text=[['Organization','المؤسسة',brief.organization],['Work email','بريد العمل',brief.contact_email],['Capability area','مجال العمل',brief.service],['Task','المهمة',brief.problem],['Available information and systems','المعلومات والأنظمة المتاحة',brief.sources],['Expected output and checks','النتيجة المتوقعة وفحوصها',brief.acceptance]].map(([en,arabic,value])=>`${t([en,arabic])}: ${value}`).join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='agynexa-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 async function remove(id:string){setBusy(id);setError('');try{const r=await fetch('/api/v1/project-briefs',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});if(!r.ok)throw Error();setBriefs(items=>items.filter(b=>b.id!==id));setConfirm('')}catch{setError('delete_failed')}finally{setBusy('')}}
 return <main id="main" className="container account-page"><Breadcrumbs/><div className="flex flex-wrap justify-between gap-6 items-center"><h1 className="text-4xl">{t(['Your account and saved work','حسابك وأعمالك المحفوظة'])}</h1>{user&&<Button variant="outline" disabled={!!busy} onClick={logout}>{t(['Sign out','تسجيل الخروج'])}</Button>}</div>
 {state==='loading'&&<p role="status" className="muted mt-8">{t(['Loading your account…','جارٍ تحميل حسابك…'])}</p>}
 {state==='error'&&<div className="mt-8"><p role="alert">{t(errors.temporarily_unavailable)}</p><p className="muted mt-3">{t(['You can sign in again if your session has ended.','يمكنك تسجيل الدخول مجددًا إذا انتهت جلستك.'])} <Link className="text-link" href="/login">{t(['Sign in','تسجيل الدخول'])}</Link></p><Button className="mt-4" onClick={load}>{t(['Try again','إعادة المحاولة'])}</Button></div>}
 {state==='signedout'&&<div className="auth-panel panel"><p className="muted mb-6">{t(['Sign in to view your saved planning records.','سجّل الدخول لعرض سجلاتك المحفوظة.'])}</p><AuthForm onSuccess={load}/></div>}
 {state==='ready'&&user&&<><p className="muted mt-5">{user.displayName} · <span dir="ltr">{user.email}</span></p><p className="mt-6"><Link className="text-link" href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Link></p><div className="flex flex-wrap justify-between items-center gap-6 border-t mt-10 pt-10"><h2 className="text-2xl">{t(['Saved planning records','سجلات التخطيط المحفوظة'])}</h2><Link className="action" href="/start">{t(['Create a planning record','أنشئ سجل تخطيط'])}</Link></div><p className="muted mt-4 text-sm">{t(['Planning records are saved privately in your account. Saving does not send them to AGYNEXA or notify anyone. Review and download a record before choosing a manual handoff. You can delete a record below.','تُحفظ السجلات بشكل خاص في حسابك. الحفظ لا يرسلها إلى AGYNEXA ولا يُشعر أحدًا. راجع السجل ونزّله قبل اختيار مشاركته يدويًا. يمكنك حذفه أدناه.'])}</p>{briefState==='loading'?<p role="status" className="muted py-8">{t(['Loading your records…','جارٍ تحميل سجلاتك…'])}</p>:briefState==='error'?<div className="py-8"><p role="alert">{t(['Your account is available, but your records could not be loaded. Please retry.','حسابك متاح، لكن تعذر تحميل السجلات. أعد المحاولة.'])}</p><Button className="mt-4" variant="outline" onClick={loadBriefs}>{t(['Retry records','إعادة تحميل السجلات'])}</Button></div>:briefs.length===0?<p className="muted py-12">{t(['You have not saved a planning record yet. Create a planning record to organize the task, its information and the result you need.','لم تحفظ سجل تخطيط بعد. يمكنك تجهيز سجل لتنظيم المهمة ومعلوماتها والنتيجة المطلوبة.'])}</p>:<div className="grid gap-5 mt-8">{briefs.map(b=><article className="panel" key={b.id}><div className="flex flex-wrap justify-between gap-4"><h3 className="text-xl">{b.organization}</h3><time className="muted text-sm" dateTime={b.created_at}>{new Date(b.created_at).toLocaleDateString(ar?'ar-EG':'en-GB')}</time></div><p className="text-primary mt-3">{b.service}</p><p className="mt-3 whitespace-pre-wrap break-words">{b.problem}</p><details className="mt-5"><summary className="cursor-pointer text-link">{t(['Details','التفاصيل'])}</summary><dl className="brief-review mt-5"><div><dt>{t(['Sources and systems','المصادر والأنظمة'])}</dt><dd>{b.sources}</dd></div><div><dt>{t(['Success criteria','معايير النجاح'])}</dt><dd>{b.acceptance}</dd></div></dl><p className="muted text-xs mt-4 break-all" dir="ltr">{b.id}</p></details><button className="text-link mt-5 me-5" onClick={()=>downloadBrief(b)}>{t(['Download planning record','تنزيل السجل المحفوظ'])}</button>{confirm===b.id?<div className="flex flex-wrap items-center gap-4 mt-5"><p>{t(['Delete this saved record? Copies you downloaded or shared will remain separate.','هل تريد حذف هذا السجل المحفوظ؟ تبقى النسخ التي نزّلتها أو شاركتها سجلات منفصلة.'])}</p><Button variant="outline" disabled={!!busy} onClick={()=>remove(b.id)}>{t(['Confirm deletion','تأكيد الحذف'])}</Button><button onClick={()=>setConfirm('')} disabled={!!busy}>{t(['Cancel','إلغاء'])}</button></div>:<button className="text-link mt-5" onClick={()=>setConfirm(b.id)}>{t(['Delete record','حذف السجل'])}</button>}</article>)}</div>}</>}
 {error&&<p role="alert" className="mt-5">{t(errors[error])}</p>}</main>
}
