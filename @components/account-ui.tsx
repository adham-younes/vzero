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
 invalid_credentials:['Email or password is incorrect.','البريد أو كلمة المرور غير صحيحة.'],
 registration_failed:['Unable to create this account. Check your details, or sign in if you already have an account.','تعذر إنشاء الحساب. راجع البيانات أو سجّل الدخول إذا كان لديك حساب بالفعل.'],
 invalid_password:['Use a password of 12–128 characters.','استخدم كلمة مرور من 12 إلى 128 حرفًا.'],
 try_later:['Too many attempts. Please try again later.','محاولات كثيرة. حاول مرة أخرى لاحقًا.'],
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
  {mode==='register'&&<label className="grid gap-2">{t(['Your name','الاسم'])}<Input name="name" autoComplete="name" required maxLength={100}/></label>}
  <label className="grid gap-2">{t(['Email','البريد الإلكتروني'])}<Input name="email" type="email" dir="ltr" autoComplete="email" required maxLength={254}/></label>
  <div className="grid gap-2"><label htmlFor={passwordId}>{t(['Password','كلمة المرور'])}</label><div className="password-control"><Input id={passwordId} name="password" type={showPassword?'text':'password'} dir="ltr" autoComplete={mode==='register'?'new-password':'current-password'} required minLength={mode==='register'?12:1} maxLength={128}/><button type="button" className="password-toggle" aria-label={t(showPassword?['Hide password','إخفاء كلمة المرور']:['Show password','إظهار كلمة المرور'])} aria-pressed={showPassword} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></div>
  {mode==='register'&&<p className="muted text-sm">{t(['Use at least 12 characters. Your account opens immediately, without a confirmation email.','استخدم 12 حرفًا على الأقل. يُفتح حسابك مباشرةً دون رسالة تأكيد بريد.'])}</p>}
  {error&&<p role="alert" className="text-sm">{t(errors[error]||errors.temporarily_unavailable)}</p>}
  <Button type="submit" disabled={busy} size="lg">{busy?t(['Please wait…','جارٍ التنفيذ…']):t(mode==='register'?['Create account','إنشاء حساب']:['Sign in','تسجيل الدخول'])}</Button>
  <button type="button" className="text-link justify-self-start" disabled={busy} onClick={()=>{setMode(mode==='login'?'register':'login');setError('');setShowPassword(false)}}>{t(mode==='login'?['New here? Create an account','مستخدم جديد؟ أنشئ حسابًا']:['Already registered? Sign in','لديك حساب؟ سجّل الدخول'])}</button>
  <p className="muted text-sm mt-6">{t(['Password recovery is not available in this release. Keep your sign-in details safe.','استعادة كلمة المرور غير متاحة في هذا الإصدار. احتفظ ببيانات الدخول بأمان.'])}</p>
 </form>
}
export function AuthPage({mode}:{mode:'login'|'register'}){const {t}=useLanguage();return <main id="main" className="container account-page"><div className="max-w-lg mx-auto"><Breadcrumbs/><h1 className="text-4xl mb-6">{t(mode==='register'?['Create your account','أنشئ حسابك']:['Welcome back','مرحبًا بعودتك'])}</h1><p className="muted mb-10">{t(['Open a private conversation, create an assistant, and keep project briefs in your account.','افتح محادثة خاصة وأنشئ مساعدًا واحتفظ بموجزات المشاريع في حسابك.'])}</p><AuthForm initialMode={mode}/></div></main>}

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
 function downloadBrief(brief:Brief){const text=[['Organization','المؤسسة',brief.organization],['Work email','بريد العمل',brief.contact_email],['Service','الخدمة',brief.service],['Task','المهمة',brief.problem],['Sources','المصادر',brief.sources],['Success criteria','معايير النجاح',brief.acceptance]].map(([en,arabic,value])=>`${t([en,arabic])}: ${value}`).join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='agynexa-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 async function remove(id:string){setBusy(id);setError('');try{const r=await fetch('/api/v1/project-briefs',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});if(!r.ok)throw Error();setBriefs(items=>items.filter(b=>b.id!==id));setConfirm('')}catch{setError('temporarily_unavailable')}finally{setBusy('')}}
 return <main id="main" className="container account-page"><Breadcrumbs/><div className="flex flex-wrap justify-between gap-6 items-center"><h1 className="text-4xl">{t(['Your account','حسابك'])}</h1>{user&&<Button variant="outline" disabled={!!busy} onClick={logout}>{t(['Sign out','تسجيل الخروج'])}</Button>}</div>
 {state==='loading'&&<p role="status" className="muted mt-8">{t(['Loading your account…','جارٍ تحميل حسابك…'])}</p>}
 {state==='error'&&<div className="mt-8"><p role="alert">{t(errors.temporarily_unavailable)}</p><p className="muted mt-3">{t(['You can sign in again if your session has ended.','يمكنك تسجيل الدخول مجددًا إذا انتهت جلستك.'])} <Link className="text-link" href="/login">{t(['Sign in','تسجيل الدخول'])}</Link></p><Button className="mt-4" onClick={load}>{t(['Try again','إعادة المحاولة'])}</Button></div>}
 {state==='signedout'&&<div className="auth-panel panel"><p className="muted mb-6">{t(['Sign in to view your saved briefs.','سجّل الدخول لعرض موجزاتك المحفوظة.'])}</p><AuthForm onSuccess={load}/></div>}
 {state==='ready'&&user&&<><p className="muted mt-5">{user.displayName} · <span dir="ltr">{user.email}</span></p><p className="mt-6"><Link className="text-link" href="/studio">{t(['Open Agent Studio','فتح Agent Studio'])}</Link></p><div className="flex flex-wrap justify-between items-center gap-6 border-t mt-10 pt-10"><h2 className="text-2xl">{t(['Your project briefs','موجزات مشاريعك'])}</h2><Link className="action" href="/start">{t(['New project brief','موجز مشروع جديد'])}</Link></div><p className="muted mt-4 text-sm">{t(['Briefs are saved privately in your account. Saving does not send them to AGYNEXA or notify anyone. Review and download a brief before choosing a manual handoff. You can delete a brief below.','تُحفظ الموجزات بشكل خاص في حسابك. الحفظ لا يرسلها إلى AGYNEXA ولا يُشعر أحدًا. راجع الموجز ونزّله قبل اختيار مشاركته يدويًا. يمكنك حذفه أدناه.'])}</p>{briefState==='loading'?<p role="status" className="muted py-8">{t(['Loading your briefs…','جارٍ تحميل موجزاتك…'])}</p>:briefState==='error'?<div className="py-8"><p role="alert">{t(['Your account is available, but your briefs could not be loaded. Please retry.','حسابك متاح، لكن تعذر تحميل الموجزات. أعد المحاولة.'])}</p><Button className="mt-4" variant="outline" onClick={loadBriefs}>{t(['Retry briefs','إعادة تحميل الموجزات'])}</Button></div>:briefs.length===0?<p className="muted py-12">{t(['No saved briefs yet.','لا توجد موجزات محفوظة بعد.'])}</p>:<div className="grid gap-5 mt-8">{briefs.map(b=><article className="panel" key={b.id}><div className="flex flex-wrap justify-between gap-4"><h3 className="text-xl">{b.organization}</h3><time className="muted text-sm" dateTime={b.created_at}>{new Date(b.created_at).toLocaleDateString(ar?'ar-EG':'en-GB')}</time></div><p className="text-primary mt-3">{b.service}</p><p className="mt-3 whitespace-pre-wrap break-words">{b.problem}</p><details className="mt-5"><summary className="cursor-pointer text-link">{t(['Details','التفاصيل'])}</summary><dl className="brief-review mt-5"><div><dt>{t(['Sources and systems','المصادر والأنظمة'])}</dt><dd>{b.sources}</dd></div><div><dt>{t(['Success criteria','معايير النجاح'])}</dt><dd>{b.acceptance}</dd></div></dl><p className="muted text-xs mt-4 break-all" dir="ltr">{b.id}</p></details><button className="text-link mt-5 me-5" onClick={()=>downloadBrief(b)}>{t(['Download saved brief','تنزيل الموجز المحفوظ'])}</button>{confirm===b.id?<div className="flex flex-wrap items-center gap-4 mt-5"><p>{t(['Delete this brief permanently?','حذف هذا الموجز نهائيًا؟'])}</p><Button variant="outline" disabled={!!busy} onClick={()=>remove(b.id)}>{t(['Confirm deletion','تأكيد الحذف'])}</Button><button onClick={()=>setConfirm('')} disabled={!!busy}>{t(['Cancel','إلغاء'])}</button></div>:<button className="text-link mt-5" onClick={()=>setConfirm(b.id)}>{t(['Delete brief','حذف الموجز'])}</button>}</article>)}</div>}</>}
 {error&&<p role="alert" className="mt-5">{t(errors[error])}</p>}</main>
}
