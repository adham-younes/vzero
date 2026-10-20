'use client'
import {useState} from 'react'
import {Button} from '@/components/ui/button'
export function StudioWidget({publicId}:{publicId:string}){
 const [ar,setAr]=useState(false),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('')
 const [session,setSession]=useState<{token:string;agentId:string}|null>(null);const [conversation]=useState(()=>crypto.randomUUID())
 const [items,setItems]=useState<{question:string;answer:string;citations:{title:string;quote:string}[]}[]>([])
 async function send(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{
  let s=session
  if(!s){const r=await fetch(`/api/v1/widget/${publicId}/session`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(!r.ok)throw new Error('session');s=await r.json();setSession(s)}
  if(!s)throw new Error('session')
  const r=await fetch(`/api/v1/widget/${s.agentId}/invoke`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${s.token}`},body:JSON.stringify({message,requestKey:crypto.randomUUID(),conversationId:conversation})});const result=await r.json()
  if(!r.ok||result.run.status!=='succeeded'){if(r.status===401)setSession(null);throw new Error('run')}
  setItems(old=>[...old,{question:message,answer:result.run.answer,citations:result.run.citations}]);setMessage('')
 }catch{setError(ar?'تعذر إكمال الطلب. قد تكون المحادثة متوقفة أو الجلسة منتهية. أعد المحاولة.':'The request could not complete. The assistant may be offline or the session expired. Please retry.')}finally{setBusy(false)}}
 return <main dir={ar?'rtl':'ltr'} className="mx-auto max-w-2xl p-5"><header className="flex justify-between gap-4 border-b pb-4"><strong>AGYNEXA</strong><button className="text-link" onClick={()=>setAr(!ar)}>{ar?'English':'العربية'}</button></header><p className="muted text-sm my-5">{ar?'إجابات من المصادر المعتمدة للعامة. لا تشارك بيانات حساسة.':'Answers from sources approved for public use. Do not share sensitive information.'}</p><div aria-live="polite" className="grid gap-5">{items.map((item,i)=><article key={i} className="border rounded-lg p-4"><p className="text-primary" dir="auto">{item.question}</p><p className="whitespace-pre-wrap mt-4" dir="auto">{item.answer}</p>{item.citations.map((c,j)=><details key={j} className="muted text-sm mt-3"><summary>{c.title}</summary><p dir="auto">{c.quote}</p></details>)}</article>)}</div><form onSubmit={send} className="grid gap-3 mt-6"><label>{ar?'سؤالك':'Your question'}<textarea required maxLength={3000} rows={3} dir="auto" className="block mt-2 w-full border rounded-lg p-3 bg-transparent" value={message} onChange={e=>setMessage(e.target.value)} disabled={busy}/></label><Button type="submit" disabled={busy}>{busy?(ar?'جارٍ الإجابة…':'Answering…'):(ar?'إرسال':'Send')}</Button>{error&&<p role="alert">{error}</p>}</form></main>
}
