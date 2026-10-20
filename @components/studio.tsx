'use client'
import {useEffect,useState} from 'react'
import {StudioAgent} from './studio-agent'
import {useLanguage} from './agynexa-shell'
import Link from './locale-link'
import {AuthForm} from './account-ui'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {templates,modelIds,type Agent,type Template} from '@/lib/studio/settings'

const messages:Record<string,readonly string[]>={
 unavailable:['Studio is not available here yet. Your account and project briefs remain available.','Studio غير متاح هنا بعد. يمكنك الاستمرار في استخدام حسابك وموجزات المشاريع.'],
 failed:['Could not load Studio. Please try again.','تعذر تحميل Studio. حاول مرة أخرى.'],
 revision_conflict:['This agent was updated elsewhere. Reload it before saving your changes.','عُدّل هذا الوكيل في جلسة أخرى. أعد تحميله قبل حفظ تغييراتك.'],
 request_conflict:['This creation request was already saved with different settings. Reload the agent list.','حُفظ طلب الإنشاء مسبقًا بإعدادات مختلفة. أعد تحميل قائمة الوكلاء.'],
 sign_in_required:['Your session has ended. Sign in again.','انتهت جلستك. سجّل الدخول مجددًا.'],
 invalid_input:['Check the required fields and their length.','راجع الحقول المطلوبة وأطوالها.'],
}
async function api(path:string,method='GET',body?:unknown){
 const response=await fetch(path,{method,cache:'no-store',...(body===undefined?{}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})})
 const result=await response.json()
 if(!response.ok)throw new Error(result.error||'failed')
 return result
}
function AgentForm({agent,onSaved,onCancel}:{agent:Agent|null;onSaved:(agent:Agent)=>void;onCancel:()=>void}){
 const {t,ar}=useLanguage();const [template,setTemplate]=useState<Template>(agent?.template||'knowledgegrid')
 const [language,setLanguage]=useState<'ar'|'en'>(agent?.language||(ar?'ar':'en'))
 const [name,setName]=useState(agent?.name||'')
 const [instructions,setInstructions]=useState(agent?.instructions||templates.knowledgegrid.instructions[ar?'ar':'en'])
 const [model,setModel]=useState<string>(agent?.model||modelIds[0])
 const [requestKey]=useState(()=>crypto.randomUUID());const [busy,setBusy]=useState(false);const [error,setError]=useState('')
 function choose(value:Template){setTemplate(value);setInstructions(templates[value].instructions[language])}
 async function save(event:React.FormEvent){
  event.preventDefault();setBusy(true);setError('')
  try{
   const settings={name,instructions,language,model}
   const result=await api(agent?`/api/v1/agents/${agent.id}`:'/api/v1/agents',agent?'PATCH':'POST',agent?{...settings,revision:agent.revision}:{...settings,template,requestKey})
   onSaved(result.agent)
  }catch(e){setError(e instanceof Error?e.message:'failed')}finally{setBusy(false)}
 }
 return <form className="panel grid gap-6 min-w-0" onSubmit={save}>
  <div><p className="breadcrumb">{agent?templates[agent.template].title:t(['New agent','وكيل جديد'])}</p><h2 className="text-2xl">{t(agent?['Agent settings','إعدادات الوكيل']:['Create your agent','أنشئ وكيلك'])}</h2></div>
  {!agent&&<fieldset disabled={busy} className="grid gap-3"><legend className="mb-3">{t(['Choose a template','اختر قالبًا'])}</legend><div className="grid gap-3 sm:grid-cols-2">{(Object.keys(templates) as Template[]).map(key=><label key={key} className={`border rounded-lg p-4 cursor-pointer ${template===key?'border-primary':'border-white/15'}`}><span className="flex gap-3 items-center"><input type="radio" name="template" value={key} checked={template===key} onChange={()=>choose(key)} className="accent-primary"/><span>{templates[key].title}</span></span><span className="block muted text-sm mt-2">{t(key==='knowledgegrid'?['Answers grounded in your knowledge sources.','إجابات تستند إلى مصادر معرفتك.']:['Support knowledge and reviewed internal requests.','معرفة للدعم وطلبات داخلية بعد المراجعة.'])}</span></label>)}</div></fieldset>}
  <label className="grid gap-2">{t(['Agent name','اسم الوكيل'])}<Input dir="auto" className="h-11" name="agentName" value={name} onChange={e=>setName(e.target.value)} required maxLength={100} disabled={busy}/></label>
  <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2">{t(['Response language','لغة الإجابة'])}<select className="border rounded-lg bg-background p-3 min-w-0" value={language} disabled={busy} onChange={e=>setLanguage(e.target.value as 'ar'|'en')}><option value="ar">العربية</option><option value="en">English</option></select></label><label className="grid gap-2 min-w-0">{t(['Model','النموذج'])}<select className="border rounded-lg bg-background p-3 min-w-0 w-full" dir="ltr" value={model} disabled={busy} onChange={e=>setModel(e.target.value)}>{modelIds.filter(id=>!id.startsWith('qwen/')||id===agent?.model).map(id=><option key={id} value={id}>{id}</option>)}</select></label></div>
  <p className="muted text-sm">{t(['Save settings before testing. Qwen is reserved for internal evaluation.','احفظ الإعدادات قبل الاختبار. نموذج Qwen مخصص للتقييم الداخلي.'])}</p>
  <label className="grid gap-2">{t(['Instructions','التعليمات'])}<textarea dir="auto" name="instructions" rows={9} value={instructions} onChange={e=>setInstructions(e.target.value)} required maxLength={6000} disabled={busy} className="w-full min-w-0 resize-y rounded-lg border border-input bg-transparent p-3 focus-visible:outline-primary"/><span className="muted text-sm" dir="ltr">{instructions.length} / 6000</span></label>
  {agent&&<p className="muted text-sm">{t(['Saved draft revision','مراجعة المسودة المحفوظة'])}: {agent.revision}. {t(['Publishing creates a separate fixed version.','النشر ينشئ إصدارًا ثابتًا مستقلًا.'])}</p>}
  {error&&<p role="alert">{t(messages[error]||messages.failed)}</p>}
  <div className="flex flex-wrap gap-3"><Button type="submit" disabled={busy}>{busy?t(['Saving…','جارٍ الحفظ…']):t(agent?['Save settings','حفظ الإعدادات']:['Create agent','إنشاء الوكيل'])}</Button><Button type="button" variant="outline" disabled={busy} onClick={onCancel}>{t(['Back to agents','العودة للوكلاء'])}</Button></div>
 </form>
}
export function Studio({enabled}:{enabled:boolean}){
 const {t}=useLanguage();const [state,setState]=useState(enabled?'loading':'unavailable');const [workspace,setWorkspace]=useState<{id:string;name:string}|null>(null)
 const [agents,setAgents]=useState<Agent[]>([]);const [selected,setSelected]=useState<Agent|null>(null);const [editing,setEditing]=useState(false);const [busy,setBusy]=useState(false);const [notice,setNotice]=useState('');const [error,setError]=useState('')
 async function load(){
  setState('loading');setEditing(false);setSelected(null);setAgents([]);setWorkspace(null);setError('')
  try{const data=await api('/api/v1/agents');setAgents(data.agents);setWorkspace(data.workspace);setState('ready')}
  catch(e){const code=e instanceof Error?e.message:'';setState(code==='sign_in_required'?'signedout':code==='studio_unavailable'?'unavailable':'error')}
 }
 useEffect(()=>{if(enabled)void load()},[enabled])
 async function initialize(){setBusy(true);setError('');try{const result=await api('/api/v1/workspace','POST',{});setWorkspace(result.workspace)}catch(e){setError(e instanceof Error?e.message:'failed')}finally{setBusy(false)}}
 async function open(agent:Agent){setBusy(true);setError('');setNotice('');try{const result=await api(`/api/v1/agents/${agent.id}`);setSelected(result.agent);setEditing(true)}catch(e){setError(e instanceof Error?e.message:'failed')}finally{setBusy(false)}}
 function saved(agent:Agent){setAgents(items=>[agent,...items.filter(a=>a.id!==agent.id)]);setSelected(agent);setNotice('saved');setEditing(true)}
 return <main id="main" className="container py-16 md:py-20"><p className="breadcrumb">AGYNEXA / Studio</p><div className="flex flex-wrap justify-between items-start gap-5"><div><h1 className="text-4xl md:text-5xl">Agent Studio</h1><p className="muted mt-5 max-w-2xl">{t(['Create agents and keep their instructions, language and model settings in your private workspace.','أنشئ وكلاء واحفظ تعليماتهم ولغتهم وإعدادات نماذجهم في مساحة عملك الخاصة.'])}</p></div><Link href="/account" className="text-link">{t(['Your account','حسابك'])}</Link></div>
 {state==='loading'&&<p role="status" className="muted py-12">{t(['Loading your workspace…','جارٍ تحميل مساحة العمل…'])}</p>}
 {state==='unavailable'&&<p role="status" className="panel mt-10">{t(messages.unavailable)}</p>}
 {state==='error'&&<div className="panel mt-10"><p role="alert">{t(messages.failed)}</p><Button className="mt-5" onClick={load}>{t(['Try again','إعادة المحاولة'])}</Button></div>}
 {state==='signedout'&&<div className="max-w-lg panel mt-10"><p className="muted mb-6">{t(['Sign in to open your workspace.','سجّل الدخول لفتح مساحة عملك.'])}</p><AuthForm onSuccess={load}/></div>}
 {state==='ready'&&!workspace&&<section className="panel mt-10 max-w-2xl"><h2 className="text-2xl">{t(['Your private workspace','مساحة عملك الخاصة'])}</h2><p className="muted my-5">{t(['Start with one workspace owned by your account. Your existing project briefs stay in your account.','ابدأ بمساحة عمل تملكها بحسابك. تظل موجزات المشاريع الحالية محفوظة في حسابك.'])}</p><Button disabled={busy} onClick={initialize}>{t(['Create workspace','إنشاء مساحة عمل'])}</Button></section>}
 {state==='ready'&&workspace&&<div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]"><section className="min-w-0">{editing?(selected?<StudioAgent key={`${selected.id}-${selected.revision}`} agent={selected} onBack={()=>setEditing(false)} settings={<AgentForm agent={selected} onSaved={saved} onCancel={()=>setEditing(false)}/>}/>:<AgentForm agent={null} onSaved={saved} onCancel={()=>setEditing(false)}/>):<><div className="flex flex-wrap items-center justify-between gap-4 mb-6"><h2 className="text-2xl">{t(['Your agents','وكلاؤك'])} <span className="muted text-base">({agents.length})</span></h2><Button onClick={()=>{setSelected(null);setEditing(true);setNotice('')}}>{t(['New agent','وكيل جديد'])}</Button></div>{agents.length===0?<div className="panel"><h3 className="text-xl">{t(['Create your first agent','أنشئ وكيلك الأول'])}</h3><p className="muted mt-3">{t(['Choose KnowledgeGrid or ServiceFlow, then save the settings for your use case.','اختر KnowledgeGrid أو ServiceFlow، ثم احفظ الإعدادات المناسبة لمهمتك.'])}</p></div>:<div className="grid gap-4">{agents.map(agent=><article key={agent.id} className="panel min-w-0"><div className="flex flex-wrap justify-between items-start gap-4"><div className="min-w-0"><p className="breadcrumb">{templates[agent.template].title}</p><h3 className="text-xl break-words">{agent.name}</h3></div><Button variant="outline" disabled={busy} onClick={()=>open(agent)}>{t(['Open agent','فتح الوكيل'])}</Button></div><p className="muted mt-4 text-sm break-words" dir="ltr">{agent.model} · {agent.language.toUpperCase()}</p><p className="muted text-sm mt-2">{t(['Draft · revision','مسودة · مراجعة'])} {agent.revision}</p></article>)}</div>}</>}{notice&&<p role="status" className="text-primary mt-5">{t(['Agent settings saved.','تم حفظ إعدادات الوكيل.'])}</p>}</section><aside className="border-s ps-6 self-start"><h2 className="text-lg">{t(['Workspace','مساحة العمل'])}</h2><p className="muted mt-3">{t(['Owned by your account','مملوكة لحسابك'])}</p><p className="muted mt-6 text-sm">{t(['Add private knowledge, test answers with sources, then publish a fixed version for API or widget use.','أضف معرفة خاصة واختبر إجابات بمصادر، ثم انشر إصدارًا ثابتًا للاستخدام عبر API أو المحادثة المضمّنة.'])}</p></aside></div>}
 {error&&<p role="alert" className="mt-6">{t(messages[error]||messages.failed)} <Link className="text-link" href="/login">{error==='sign_in_required'?t(['Sign in','تسجيل الدخول']):''}</Link></p>}
 </main>
}
