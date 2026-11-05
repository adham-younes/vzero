'use client'

import {useCallback,useEffect,useRef,useState,type FormEvent,type ReactNode} from 'react'
import {ArrowRight,BookOpen,Check,ChevronDown,Copy,Download,FileText,Inbox,KeyRound,LoaderCircle,LockKeyhole,LogOut,Mail,Paperclip,Plus,RefreshCw,Search,Send,Settings,ShieldCheck,Trash2,X} from 'lucide-react'
import './owner-mail-console.css'

type Session={authenticated:boolean;owner:boolean;email?:string}
type MailItem={id:string;inbox:string;source?:'resend'|'spacemail';sender:string;subject:string;text_body?:string;message_at:string;direction:string;folder:string;reply_state?:string;review_reason?:string;attachment_count?:number}
type MailDetail={message:MailItem&{attachments?:{filename:string;size:number|null;index:number}[]};job?:{id:string;state:string;reason?:string;policy_reason?:string|null;handling_mode?:string};history:MailItem[]}
type Knowledge={id:string;title:string;content:string;kind:'identity'|'project'|'goal'|'reference';visibility:'public_reply'|'owner_private';active:boolean;source_label:string}
type ConsoleSettings={mailboxes:{inbox:string;auto_reply:boolean}[];gmail?:{status:string;detail?:string};connector?:{tokens:{id:string;name:string;created_at:string;expires_at?:string}[];endpoint:string}}
type Panel='mail'|'knowledge'|'settings'
type Notice={text:string;error?:boolean}|null
const PREFIX='/api/private-mail'
const ADDRESSES=['adham@agynexa.si','nexa.agent@agynexa.si']
const REPLY_LIMIT=5800
const EMPTY_KNOWLEDGE:Omit<Knowledge,'id'>={title:'',content:'',kind:'reference',visibility:'owner_private',active:true,source_label:''}
class RequestError extends Error{constructor(public status:number,public code:string){super(code)}}
async function api<T>(path:string,init?:RequestInit):Promise<T>{
 const response=await fetch(PREFIX+path,{...init,credentials:'same-origin',cache:'no-store',headers:{...(init?.body?{'Content-Type':'application/json'}:{}),...init?.headers}})
 const data=await response.json().catch(()=>null)
 if(!response.ok)throw new RequestError(response.status,String(typeof data?.error==='string'?data.error:data?.error?.code||'request_failed'))
 return data as T
}
const body=(value:unknown)=>JSON.stringify(value)
const messagePath=(id:string)=>'/messages/'+encodeURIComponent(id)
function date(value:string,long=false){const d=new Date(value);const options:Intl.DateTimeFormatOptions={day:'numeric',month:long?'long':'short'};if(long){options.year='numeric';options.hour='numeric';options.minute='2-digit'}return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat('ar-EG',options).format(d)}
function size(bytes:number|null|undefined){return bytes==null?'':bytes<1024?`${bytes} B`:bytes<1048576?`${Math.round(bytes/1024)} KB`:`${(bytes/1048576).toFixed(1)} MB`}
function status(item:MailItem,detail?:MailDetail){
 const state=detail?.job?.state||item.reply_state
 if(state==='review')return {text:'تحتاج مراجعتك',kind:'review'}
 if(state==='sent'||state==='replied')return {text:'تم الرد',kind:'sent'}
 if(detail?.job?.handling_mode==='manual')return {text:'رد يدوي',kind:'manual'}
 if(item.direction==='outbound')return {text:'صادرة',kind:'plain'}
 if(item.source==='spacemail'||item.direction==='historical'||state==='historical')return {text:'من الأرشيف',kind:'plain'}
 if(state==='pending')return {text:'قيد المعالجة',kind:'pending'}
 return {text:'واردة',kind:'plain'}
}
function reviewText(reason?:string){
 if(reason==='sender_auth_review')return 'تعذّر التحقق من هوية المرسل. الإرسال من هذه الرسالة متوقف.'
 if(reason==='reply_to_review')return 'عنوان الرد مختلف عن عنوان المرسل. تحتاج الرسالة إلى مراجعة المستلم أولًا.'
 if(reason==='send_uncertain')return 'نتيجة إرسال سابق غير مؤكدة. راجع الصندوق قبل محاولة إرسال آخر.'
 if(reason==='sender_limit'||reason==='daily_limit')return 'توقفت المعالجة التلقائية بسبب حدّ الردود. الرسالة محفوظة للمراجعة.'
 return 'تحتاج هذه الرسالة إلى مراجعتك قبل أي رد. قد تتضمن معلومات حساسة أو طلبًا لا يملك المساعد صلاحية اعتماده.'
}
function Busy({children}:{children:ReactNode}){return <div className="om-empty" role="status"><LoaderCircle className="om-spin" size={23}/><p>{children}</p></div>}
function Empty({children,icon=<Mail size={29}/>}:{children:ReactNode;icon?:ReactNode}){return <div className="om-empty">{icon}<div>{children}</div></div>}

export function OwnerMailConsole(){
 const [session,setSession]=useState<Session|null>(null)
 const [notice,setNotice]=useState<Notice>(null)
 const [panel,setPanel]=useState<Panel>('mail')
 const [inbox,setInbox]=useState(ADDRESSES[0])
 const [loginBusy,setLoginBusy]=useState(false)
 const [email,setEmail]=useState('')
 const [password,setPassword]=useState('')
 const [checking,setChecking]=useState(true)
 const fail=useCallback((error:unknown)=>{
  if(error instanceof RequestError&&error.status===401){setSession({authenticated:false,owner:false});setNotice({text:'انتهت الجلسة. سجّل الدخول مرة أخرى.',error:true});return}
  const code=error instanceof RequestError?error.code:''
  setNotice({error:true,text:code.includes('already')?'تم الرد على هذه الرسالة بالفعل. حدّث المحادثة للاطلاع على الرد.':code.includes('review')?'الإرسال متوقف إلى أن تُراجع هذه الرسالة.':error instanceof RequestError&&error.status===429?'وصلت إلى حدّ المحاولات. انتظر قليلًا ثم حاول مرة أخرى.':'تعذّر إتمام الطلب. لم نؤكد أي تغيير؛ حاول مرة أخرى.'})
 },[])
 const check=useCallback(async()=>{setChecking(true);try{setSession(await api<Session>('/session'))}catch(e){if(e instanceof RequestError&&e.status===401)setSession({authenticated:false,owner:false});else fail(e)}finally{setChecking(false)}},[fail])
 useEffect(()=>{void check()},[check])
 async function login(event:FormEvent){event.preventDefault();setLoginBusy(true);setNotice(null);try{await api('/login',{method:'POST',body:body({email:email.trim(),password})});setPassword('');await check()}catch(e){setNotice({text:'تعذّر تسجيل الدخول. راجع البريد وكلمة المرور وصلاحية حساب المالك.',error:true})}finally{setLoginBusy(false)}}
 async function logout(){try{await api('/logout',{method:'POST'});setSession({authenticated:false,owner:false});setNotice(null);setPassword('')}catch(e){fail(e)}}
 const notify=(text:string)=>setNotice({text})
 return <div className="owner-mail-console" lang="ar" dir="rtl">
  {checking&&!session?<Busy>جارٍ التحقق من الجلسة…</Busy>:!session?.authenticated||!session.owner?<main className="om-login">
   <div className="om-login-brand"><div className="om-brand-icon"><Mail size={25}/></div><span>NEXA <span>MAIL</span></span><span className="om-private"><LockKeyhole size={13}/>خاص</span></div>
   <div className="om-login-card"><span className="om-eyebrow">مساحة البريد الخاصة</span><h1>بريدك، في مكان واحد.</h1><p>الرسائل والمرفقات ومتابعة الردود، بحساب المالك فقط.</p>
    {notice&&<div role="alert" className="om-notice om-error">{notice.text}</div>}
    {session?.authenticated&&!session.owner?<><p className="om-callout">هذا الحساب لا يملك صلاحية فتح البريد.</p><button className="om-primary" onClick={logout}>تسجيل الخروج</button></>:<form onSubmit={login}>
     <label className="om-field">بريد حساب المالك<input type="email" autoComplete="username" dir="ltr" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
     <label className="om-field">كلمة المرور<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
     <button className="om-primary" disabled={loginBusy||checking}>{loginBusy?<LoaderCircle className="om-spin" size={17}/>:<LockKeyhole size={17}/>}دخول إلى البريد</button>
    </form>}
    <p className="om-login-note"><ShieldCheck size={16}/>هذه المساحة مستقلة عن صفحات AGYNEXA العامة.</p>
   </div>
  </main>:<div className="om-app">
   <aside className="om-sidebar">
    <div className="om-brand"><div className="om-brand-icon"><Mail size={23}/></div><div><strong dir="ltr">NEXA MAIL</strong><span>مساحة أدهم الخاصة</span></div></div>
    <span className="om-nav-label">البريد</span>
    <nav aria-label="صناديق البريد" className="om-mailbox-nav">{ADDRESSES.map(address=><button key={address} className={panel==='mail'&&inbox===address?'om-nav-button active':'om-nav-button'} onClick={()=>{setInbox(address);setPanel('mail');setNotice(null)}} aria-current={panel==='mail'&&inbox===address?'page':undefined}><Inbox size={18}/><span><strong>{address.startsWith('adham')?'بريد أدهم':'بريد Nexa'}</strong><small dir="ltr">{address}</small></span></button>)}</nav>
    <span className="om-nav-label">إدارة المساحة</span>
    <nav aria-label="إدارة البريد" className="om-secondary-nav"><button className={panel==='knowledge'?'om-nav-button active':'om-nav-button'} onClick={()=>{setPanel('knowledge');setNotice(null)}} aria-current={panel==='knowledge'?'page':undefined}><BookOpen size={18}/>المعرفة والمشروعات</button><button className={panel==='settings'?'om-nav-button active':'om-nav-button'} onClick={()=>{setPanel('settings');setNotice(null)}} aria-current={panel==='settings'?'page':undefined}><Settings size={18}/>الإعدادات والاتصالات</button></nav>
    <div className="om-sidebar-footer"><span><LockKeyhole size={14}/>وصول خاص بالمالك</span><button onClick={logout} className="om-text-button"><LogOut size={16}/>تسجيل الخروج</button></div>
   </aside>
   <main className="om-main">
    {notice&&<div className={`om-notice ${notice.error?'om-error':''}`} role={notice.error?'alert':'status'}><span>{notice.text}</span><button onClick={()=>setNotice(null)} aria-label="إغلاق التنبيه"><X size={17}/></button></div>}
    {panel==='mail'?<Mailbox key={inbox} inbox={inbox} fail={fail} notify={notify}/>:panel==='knowledge'?<KnowledgePanel fail={fail} notify={notify}/>:<SettingsPanel fail={fail} notify={notify}/>}
   </main>
  </div>}
 </div>
}

function Mailbox({inbox,fail,notify}:{inbox:string;fail:(e:unknown)=>void;notify:(text:string)=>void}){
 const [query,setQuery]=useState(''),[filter,setFilter]=useState('all')
 const [items,setItems]=useState<MailItem[]>([]),[cursor,setCursor]=useState<string|null>(null),[loading,setLoading]=useState(true)
 const [selected,setSelected]=useState<string|null>(null),[detail,setDetail]=useState<MailDetail|null>(null),[reading,setReading]=useState(false)
 const [text,setText]=useState(''),[sending,setSending]=useState(false),[holding,setHolding]=useState(false)
 const listRequest=useRef(0),detailRequest=useRef(0),requestId=useRef<string|null>(null)
 const loadList=useCallback(async(next?:string)=>{
  const seq=++listRequest.current;setLoading(true)
  const p=new URLSearchParams({inbox,status:filter,q:query.trim()});if(next)p.set('cursor',next)
  try{const data=await api<{items:MailItem[];nextCursor?:string|null}>('/messages?'+p);if(seq!==listRequest.current)return;setItems(previous=>next?[...previous,...data.items.filter(item=>!previous.some(old=>old.id===item.id))]:data.items);setCursor(data.nextCursor||null)}catch(e){if(seq===listRequest.current)fail(e)}finally{if(seq===listRequest.current)setLoading(false)}
 },[inbox,filter,query,fail])
 useEffect(()=>{const timer=setTimeout(()=>void loadList(),250);return()=>{clearTimeout(timer);listRequest.current++}},[loadList])
 const open=useCallback(async(id:string)=>{const seq=++detailRequest.current;setSelected(id);setDetail(null);setReading(true);setText('');requestId.current=null;try{const d=await api<MailDetail>(messagePath(id));if(seq===detailRequest.current)setDetail(d)}catch(e){if(seq===detailRequest.current)fail(e)}finally{if(seq===detailRequest.current)setReading(false)}},[fail])
 async function refresh(){void loadList();if(selected)void open(selected)}
 async function hold(mode:'manual'|'auto'){
  if(!detail)return;setHolding(true);const id=detail.message.id,seq=detailRequest.current
  try{await api(messagePath(id)+'/hold',{method:'POST',body:body({mode})});const updated=await api<MailDetail>(messagePath(id));if(seq===detailRequest.current)setDetail(updated);notify(mode==='manual'?'أوقفت الرد الآلي لهذه الرسالة. يمكنك إعداد ردك.':'أعدت هذه الرسالة إلى المعالجة التلقائية.')}catch(e){fail(e)}finally{setHolding(false)}
 }
 async function send(event:FormEvent){event.preventDefault();if(!detail||!liveInbound||blocked||alreadySent||!manual||!text.trim()||text.length>REPLY_LIMIT||sending)return;setSending(true);const seq=detailRequest.current;requestId.current??=crypto.randomUUID();try{await api(messagePath(detail.message.id)+'/reply',{method:'POST',body:body({text:text.trim(),requestId:requestId.current})});notify('تم إرسال ردك وحفظه في المحادثة.');if(seq===detailRequest.current){setText('');requestId.current=null;await open(detail.message.id)}void loadList()}catch(e){fail(e)}finally{setSending(false)}}
 const badge=detail?status(detail.message,detail):null
 const needsReview=detail?.job?.state==='review'||detail?.message.reply_state==='review'
 const blocked=Boolean((needsReview&&detail?.job?.policy_reason!=='routine')||(detail?.job?.policy_reason&&detail.job.policy_reason!=='routine'))
 const alreadySent=['sent','replied'].includes(detail?.job?.state||detail?.message.reply_state||'')
 const manual=detail?.job?.handling_mode==='manual'
 const liveInbound=detail?.message.source==='resend'&&detail?.message.direction==='inbound'
 return <section className="om-mail-section">
  <header className="om-page-header"><div><span className="om-eyebrow">البريد الخاص</span><h1>{inbox.startsWith('adham')?'بريد أدهم':'بريد Nexa'}</h1><p dir="ltr">{inbox}</p></div><button className="om-button" onClick={refresh} disabled={loading||reading} aria-label="تحديث الرسائل"><RefreshCw size={17}/><span>تحديث</span></button></header>
  <div className={`om-inbox-layout ${selected?'om-has-selection':''}`}>
   <section className="om-message-list" aria-label="قائمة الرسائل">
    <label className="om-search"><Search size={18}/><input type="search" placeholder="ابحث في الرسائل…" aria-label="البحث في الرسائل" maxLength={200} value={query} onChange={e=>setQuery(e.target.value)}/></label>
    <div className="om-filter-row" aria-label="تصفية الرسائل">{[['all','الكل'],['review','للمراجعة'],['replied','تم الرد']].map(([value,label])=><button key={value} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label}</button>)}</div>
    <div className="om-list-scroll" aria-busy={loading}>
     {loading&&!items.length?<Busy>جارٍ تحميل الرسائل…</Busy>:!items.length?<Empty icon={<Inbox size={26}/>}><strong>لا توجد رسائل هنا</strong><p>{query?'جرّب كلمة أخرى أو غيّر التصفية.':'ستظهر الرسائل المحفوظة في هذا الصندوق هنا.'}</p></Empty>:items.map(item=>{const b=status(item);return <button key={item.id} className={`om-message-row ${selected===item.id?'selected':''}`} aria-pressed={selected===item.id} onClick={()=>void open(item.id)}><span className="om-message-top"><span className="om-sender" dir="auto">{item.sender||'مرسل غير محدد'}</span><time dateTime={item.message_at}>{date(item.message_at)}</time></span><strong dir="auto">{item.subject||'بلا عنوان'}</strong>{item.text_body&&<p dir="auto">{item.text_body.slice(0,160)}</p>}<span className="om-message-meta"><span className={`om-status ${b.kind}`}>{b.text}</span>{!!item.attachment_count&&<span><Paperclip size={13}/>{item.attachment_count}</span>}</span></button>})}
     {cursor&&<button className="om-load-more" disabled={loading} onClick={()=>void loadList(cursor)}>{loading?'جارٍ التحميل…':'تحميل رسائل أقدم'}<ChevronDown size={16}/></button>}
    </div>
   </section>
   <section className="om-reader" aria-label="قراءة الرسالة" aria-busy={reading}>
    {!selected?<Empty icon={<Mail size={34}/>}><h2>اختر رسالة لقراءتها</h2><p>راجع المرفقات والردود السابقة من نفس المكان.</p></Empty>:reading?<Busy>جارٍ فتح الرسالة…</Busy>:detail?<>
     <div className="om-reader-scroll">
      <div className="om-reader-toolbar"><button className="om-mobile-back om-text-button" onClick={()=>{detailRequest.current++;setSelected(null);setDetail(null)}}><ArrowRight size={17}/>الرسائل</button><span className={`om-status ${badge?.kind}`}>{badge?.text}</span><a className="om-text-button" href={PREFIX+messagePath(detail.message.id)+'/download?attachment=original'} download><Download size={15}/>تنزيل الأصل</a></div>
      <header className="om-message-header"><h2 dir="auto">{detail.message.subject||'بلا عنوان'}</h2><div><span className="om-avatar" aria-hidden="true">{(detail.message.sender||'M').replace(/[^\p{L}\p{N}]/gu,'').slice(0,1).toUpperCase()}</span><div><strong dir="auto">{detail.message.sender}</strong><p>إلى <bdi>{detail.message.inbox}</bdi></p></div></div><time dateTime={detail.message.message_at}>{date(detail.message.message_at,true)}</time></header>
      <div className="om-mail-body" dir="auto">{detail.message.text_body||'هذه الرسالة لا تحتوي على نص قابل للعرض. يمكنك تنزيل الأصل للاطلاع على تنسيقها الكامل.'}</div>
      {!!detail.message.attachments?.length&&<section className="om-attachments" aria-label="مرفقات الرسالة"><h3><Paperclip size={16}/>المرفقات</h3><div>{detail.message.attachments.map((a,index)=><a key={`${a.index??index}-${a.filename}`} className="om-attachment" href={PREFIX+messagePath(detail.message.id)+'/download?attachment='+encodeURIComponent(a.index??index)} download><FileText size={19}/><span><strong dir="auto">{a.filename||'مرفق'}</strong><small dir="ltr">{size(a.size)}</small></span><Download size={16}/></a>)}</div></section>}
      {!!detail.history?.filter(item=>item.id!==detail.message.id).length&&<section className="om-history"><h3>في نفس المحادثة</h3>{detail.history.filter(item=>item.id!==detail.message.id).map(item=><details key={item.id}><summary><span dir="auto">{item.sender}</span><time>{date(item.message_at,true)}</time></summary><div className="om-mail-body" dir="auto">{item.text_body||'النص غير متاح في الملخص.'}</div><button className="om-text-button" onClick={()=>void open(item.id)}>فتح الرسالة ومرفقاتها<ArrowRight size={14}/></button></details>)}</section>}
      {needsReview&&<div className="om-review-note"><ShieldCheck size={19}/><div><strong>{blocked?'الإرسال يحتاج مراجعة':'المعالجة التلقائية متوقفة'}</strong><p>{reviewText(detail.job?.policy_reason&&detail.job.policy_reason!=='routine'?detail.job.policy_reason:detail.job?.reason||detail.message.review_reason)}</p></div></div>}
      {detail.message.source==='spacemail'&&<p className="om-callout">هذه رسالة محفوظة من بريدك السابق. يمكنك قراءتها وتنزيل أصلها ومرفقاتها هنا؛ الرد متاح للرسائل الجديدة الواردة.</p>}
     </div>
     {liveInbound&&<div className="om-reply-area">
      {alreadySent?<div className="om-reply-complete"><Check size={18}/><span>تم الرد على هذه الرسالة. الرد محفوظ في المحادثة.</span></div>:blocked?<p className="om-muted">الرد متوقف لهذه الرسالة لحين حسم سبب المراجعة.</p>:!manual?<div className="om-reply-start"><div><strong>هل تريد الرد بنفسك؟</strong><p>تولّي الرد يوقف الرد الآلي لهذه الرسالة.</p></div><button className="om-button" onClick={()=>void hold('manual')} disabled={holding}>{holding?<LoaderCircle className="om-spin" size={16}/>:<Send size={16}/>}سأتولى الرد</button></div>:<form onSubmit={send} className="om-composer"><div className="om-composer-heading"><label htmlFor="owner-mail-reply">ردك إلى <bdi>{detail.message.sender}</bdi></label><span className="om-status manual">الرد الآلي متوقف</span></div><textarea id="owner-mail-reply" dir="auto" rows={5} placeholder="اكتب ردك هنا…" maxLength={REPLY_LIMIT} value={text} onChange={e=>{setText(e.target.value);requestId.current=null}} disabled={sending} aria-describedby="owner-reply-count" required/><small id="owner-reply-count" className="om-muted" aria-live="polite">{text.length.toLocaleString('ar-EG')} / {REPLY_LIMIT.toLocaleString('ar-EG')} حرف</small><div><button type="button" className="om-text-button" onClick={()=>void hold('auto')} disabled={sending||holding}>إعادة المعالجة التلقائية</button><button className="om-primary" disabled={sending||!text.trim()||text.length>REPLY_LIMIT}>{sending?<LoaderCircle className="om-spin" size={16}/>:<Send size={16}/>}إرسال الرد</button></div></form>}
     </div>}
    </>:<Empty>تعذّر فتح الرسالة. حدّث القائمة ثم حاول مرة أخرى.</Empty>}
   </section>
  </div>
 </section>
}

function KnowledgePanel({fail,notify}:{fail:(e:unknown)=>void;notify:(text:string)=>void}){
 const [items,setItems]=useState<Knowledge[]>([]),[loading,setLoading]=useState(true),[editing,setEditing]=useState<Knowledge|Omit<Knowledge,'id'>|null>(null),[busy,setBusy]=useState(false)
 const modal=useRef<HTMLElement|null>(null),dialogOpen=editing!==null
 useEffect(()=>{if(!dialogOpen)return;const previous=document.activeElement;const trap=(event:KeyboardEvent)=>{if(event.key!=='Tab'||!modal.current)return;const controls=Array.from(modal.current.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]'));const first=controls[0],last=controls[controls.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}};document.addEventListener('keydown',trap);return()=>{document.removeEventListener('keydown',trap);if(previous instanceof HTMLElement)previous.focus()}},[dialogOpen])
 const load=useCallback(async()=>{setLoading(true);try{const data=await api<{items:Knowledge[]}>('/knowledge');setItems(data.items)}catch(e){fail(e)}finally{setLoading(false)}},[fail])
 useEffect(()=>{void load()},[load])
 async function save(e:FormEvent){e.preventDefault();if(!editing)return;setBusy(true);const {title,content,kind,visibility,active,source_label}=editing;try{await api('/knowledge'+('id'in editing?'/'+encodeURIComponent(editing.id):''),{method:'id'in editing?'PATCH':'POST',body:body({title:title.trim(),content:content.trim(),kind,visibility,active,source_label:source_label.trim()})});setEditing(null);await load();notify('تم حفظ المعلومات.')}catch(error){fail(error)}finally{setBusy(false)}}
 async function disable(id:string){setBusy(true);try{await api('/knowledge/'+encodeURIComponent(id),{method:'DELETE'});await load();notify('تم تعطيل هذا المرجع مع الاحتفاظ به.')}catch(e){fail(e)}finally{setBusy(false)}}
 return <section className="om-management"><header className="om-page-header"><div><span className="om-eyebrow">معلومات يراجعها المالك</span><h1>المعرفة والمشروعات</h1><p>حدّد ما يعرفه المساعد، وما يُسمح له باستخدامه في الردود.</p></div><button className="om-primary" onClick={()=>setEditing({...EMPTY_KNOWLEDGE})}><Plus size={17}/>إضافة معلومات</button></header>
  <div className="om-knowledge-explainer"><div><BookOpen size={19}/><span><strong>متاح للردود</strong><small>حقائق معتمدة يمكن للمساعد استخدامها في البريد.</small></span></div><div><LockKeyhole size={19}/><span><strong>خاص بك</strong><small>سياق للمالك، لا يُدرج في الردود التلقائية.</small></span></div></div>
  {loading?<Busy>جارٍ تحميل المعرفة…</Busy>:!items.length?<Empty icon={<BookOpen size={30}/>}><h2>ابدأ بالمعلومات التي تثق بها</h2><p>أضف نبذة معتمدة أو مشروعًا أو هدفًا أو مرجعًا.</p></Empty>:<div className="om-knowledge-list">{items.map(item=><article key={item.id} className={!item.active?'inactive':''}><div className="om-knowledge-icon">{item.visibility==='owner_private'?<LockKeyhole size={21}/>:<BookOpen size={21}/>}</div><div><div className="om-knowledge-title"><h2>{item.title}</h2><span className="om-status plain">{!item.active?'معطّل':item.visibility==='owner_private'?'خاص بك':'متاح للردود'}</span></div><p dir="auto">{item.content}</p>{item.source_label&&<small>المرجع: {item.source_label}</small>}</div><div className="om-knowledge-actions"><button className="om-button" onClick={()=>setEditing({...item})}>تعديل</button>{item.active&&<button className="om-icon-button" aria-label={'تعطيل '+item.title} title="تعطيل مع الاحتفاظ بالمعلومات" disabled={busy} onClick={()=>void disable(item.id)}><Trash2 size={16}/></button>}</div></article>)}</div>}
  {editing&&<div className="om-modal-backdrop" onKeyDown={e=>{if(e.key==='Escape'&&!busy)setEditing(null)}}><section ref={modal} className="om-modal" role="dialog" aria-modal="true" aria-labelledby="knowledge-title"><header><h2 id="knowledge-title">{'id'in editing?'تعديل المعلومات':'إضافة معلومات'}</h2><button className="om-icon-button" aria-label="إغلاق" disabled={busy} onClick={()=>setEditing(null)}><X size={20}/></button></header><form onSubmit={save}>
   <label className="om-field">العنوان<input autoFocus value={editing.title} maxLength={160} onChange={e=>setEditing({...editing,title:e.target.value})} required/></label>
   <div className="om-form-pair"><label className="om-field">نوع المعلومات<select value={editing.kind} onChange={e=>setEditing({...editing,kind:e.target.value as Knowledge['kind']})}><option value="identity">الهوية والتعريف</option><option value="project">مشروع</option><option value="goal">هدف</option><option value="reference">مرجع</option></select></label><label className="om-field">استخدام المعلومات<select value={editing.visibility} onChange={e=>setEditing({...editing,visibility:e.target.value as Knowledge['visibility']})}><option value="owner_private">خاص بك</option><option value="public_reply">متاح للردود</option></select></label></div>
   <label className="om-field">المعلومات<textarea dir="auto" rows={8} value={editing.content} maxLength={8000} onChange={e=>setEditing({...editing,content:e.target.value})} required/></label>
   <label className="om-field">مصدر المعلومات <span className="om-muted">اختياري</span><input value={editing.source_label} maxLength={200} placeholder="مثلًا: معلومات اعتمدتها بنفسي" onChange={e=>setEditing({...editing,source_label:e.target.value})}/></label>
   <label className="om-checkbox"><input type="checkbox" checked={editing.active} onChange={e=>setEditing({...editing,active:e.target.checked})}/>المعلومات مفعّلة</label>
   {editing.visibility==='public_reply'&&<p className="om-callout">احفظ هنا فقط ما تسمح باستخدامه في رسائل الآخرين. لا تضع كلمات مرور أو معلومات خاصة.</p>}
   <footer><button type="button" className="om-button" onClick={()=>setEditing(null)} disabled={busy}>إلغاء</button><button className="om-primary" disabled={busy||!editing.title.trim()||!editing.content.trim()}>{busy?<LoaderCircle className="om-spin" size={17}/>:<Check size={17}/>}حفظ المعلومات</button></footer>
  </form></section></div>}
 </section>
}

function SettingsPanel({fail,notify}:{fail:(e:unknown)=>void;notify:(text:string)=>void}){
 const [settings,setSettings]=useState<ConsoleSettings|null>(null),[loading,setLoading]=useState(true),[busy,setBusy]=useState<string|null>(null),[name,setName]=useState(''),[secret,setSecret]=useState<{token:string;expires_at?:string}|null>(null)
 const load=useCallback(async()=>{try{setSettings(await api<ConsoleSettings>('/settings'))}catch(e){fail(e)}finally{setLoading(false)}},[fail])
 useEffect(()=>{void load()},[load])
 async function toggle(inbox:string,auto_reply:boolean){setBusy(inbox);try{await api('/settings',{method:'PATCH',body:body({inbox,auto_reply})});await load();notify(auto_reply?'تم تفعيل الردود الآلية لهذا الصندوق.':'تم إيقاف الردود الآلية لهذا الصندوق.')}catch(e){fail(e)}finally{setBusy(null)}}
 async function createToken(e:FormEvent){e.preventDefault();setBusy('token');try{const result=await api<{token:string;expires_at?:string}>('/connector/tokens',{method:'POST',body:body({name:name.trim()})});setSecret(result);setName('');await load()}catch(error){fail(error)}finally{setBusy(null)}}
 async function revoke(id:string){setBusy(id);try{await api('/connector/tokens/'+encodeURIComponent(id),{method:'DELETE'});setSecret(null);await load();notify('تم إلغاء رمز الوصول.')}catch(error){fail(error)}finally{setBusy(null)}}
 async function copy(value:string){try{await navigator.clipboard.writeText(value);notify('تم النسخ.')}catch{notify('تعذّر النسخ التلقائي. يمكنك تحديد القيمة ونسخها يدويًا.')}}
 return <section className="om-management"><header className="om-page-header"><div><span className="om-eyebrow">التحكم في البريد</span><h1>الإعدادات والاتصالات</h1><p>اضبط الردود الآلية وراجع الوصول إلى مساحتك.</p></div></header>
  {loading?<Busy>جارٍ تحميل الإعدادات…</Busy>:settings?<div className="om-settings-grid">
   <section className="om-setting-card"><h2><Mail size={20}/>الردود الآلية</h2><p>تستخدم المعلومات المعتمدة للردود، وتترك الطلبات الحساسة للمراجعة.</p>{settings.mailboxes.map(mailbox=><div className="om-setting-row" key={mailbox.inbox}><span><strong dir="ltr">{mailbox.inbox}</strong><small>{mailbox.auto_reply?'الرد الآلي مفعّل':'الرد الآلي متوقف'}</small></span><button type="button" role="switch" aria-checked={mailbox.auto_reply} aria-label={'الرد الآلي لصندوق '+mailbox.inbox} className="om-toggle" disabled={busy!==null} onClick={()=>void toggle(mailbox.inbox,!mailbox.auto_reply)}><span/></button></div>)}</section>
   <section className="om-setting-card"><h2><Inbox size={20}/>اتصال Gmail</h2><div className="om-connection-state"><span className={`om-status ${settings.gmail?.status==='connected'?'sent':'plain'}`}>{settings.gmail?.status==='connected'?'متصل':settings.gmail?.status==='pending'?'بانتظار الاستكمال':'غير متصل'}</span></div><p>{settings.gmail?.detail||'لم يُسجل اتصال مباشر بـGmail لهذه المساحة.'}</p><p className="om-muted">اتصال Gmail في محادثة أخرى لا يمنح هذه المساحة وصولًا إليه تلقائيًا.</p></section>
   <section className="om-setting-card om-connector-card"><h2><KeyRound size={20}/>موصل المساحة الخاصة</h2><p>يمنح الرمز الاتصال صلاحية قراءة البريد والمعرفة المعتمدة، وإرسال رد عند طلبك ضمن قواعد المراجعة. يمكنك إلغاء وصوله في أي وقت.</p>{settings.connector?.endpoint&&<label className="om-field">عنوان الموصل<div className="om-copy-field"><input dir="ltr" readOnly value={settings.connector.endpoint}/><button className="om-icon-button" aria-label="نسخ عنوان الموصل" onClick={()=>void copy(settings.connector!.endpoint)}><Copy size={16}/></button></div></label>}
    <p className="om-callout">ذاكرة ChatGPT لا تُنسخ تلقائيًا إلى البريد. أضف المعلومات التي تريد مشاركتها من قسم المعرفة، وراجع صلاحية كل مرجع.</p>
    {secret?<div className="om-secret"><div><strong><ShieldCheck size={17}/>رمز الوصول الجديد</strong><button className="om-text-button" onClick={()=>setSecret(null)}><X size={15}/>إخفاء</button></div><p>يظهر مرة واحدة. احفظه في إعدادات الاتصال، ولا تشاركه في الرسائل.</p><div className="om-copy-field"><textarea dir="ltr" readOnly rows={3} aria-label="رمز الوصول" value={secret.token}/><button className="om-icon-button" aria-label="نسخ رمز الوصول" onClick={()=>void copy(secret.token)}><Copy size={17}/></button></div>{secret.expires_at&&<small>ينتهي في {date(secret.expires_at,true)}</small>}</div>:<form className="om-token-form" onSubmit={createToken}><label className="om-field">اسم الاتصال<input value={name} onChange={e=>setName(e.target.value)} maxLength={80} placeholder="مثلًا: مساعدي الخاص" required/></label><button className="om-button" disabled={busy!==null||!name.trim()}>{busy==='token'?<LoaderCircle className="om-spin" size={16}/>:<Plus size={16}/>}إنشاء رمز وصول</button></form>}
    <div className="om-token-list">{settings.connector?.tokens?.length?settings.connector.tokens.map(token=><div key={token.id}><span><strong>{token.name}</strong><small>أُنشئ {date(token.created_at,true)}{token.expires_at?' · ينتهي '+date(token.expires_at):''}</small></span><button className="om-button" disabled={busy!==null} onClick={()=>void revoke(token.id)}>إلغاء الوصول</button></div>):<p className="om-muted">لا توجد رموز وصول نشطة.</p>}</div>
   </section>
  </div>:<Empty>تعذّر تحميل الإعدادات. افتح القسم مرة أخرى للمحاولة.</Empty>}
 </section>
}

export default OwnerMailConsole
