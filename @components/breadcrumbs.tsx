'use client'
import {usePathname} from 'next/navigation'
import Link from './locale-link'
import {useLanguage} from './agynexa-shell'
import {nav,solutions} from '@/lib/agynexa'
import services from '@/lib/service-catalog.json'
export default function Breadcrumbs(){
 const {t}=useLanguage()
 const parts=usePathname().replace(/^\/ar(?=\/|$)/,'').split('/').filter(Boolean)
 const labels:Record<string,readonly string[]>={start:['Workflow brief','موجز سير العمل'],contact:['Contact','تواصل'],account:['Account','حسابي'],login:['Sign in','تسجيل الدخول'],signup:['Create account','إنشاء حساب'],studio:['Agent Studio','استوديو الوكلاء'],agentnexos:['AgentNexOS','AgentNexOS']}
 const name=(part:string)=>{const item=nav.find(n=>n[0]===part);return item?t(item.slice(1)):t(labels[part]||services.find(s=>s.slug===part)?.title||solutions.find(s=>s.slug===part)?.name||[part,part])}
 return <nav className="breadcrumbs" aria-label={t(['Breadcrumb','مسار الصفحة'])}><ol><li><Link href="/">{t(['Home','الرئيسية'])}</Link></li>{parts.map((part,index)=><li key={part}><span aria-hidden="true">/</span>{index===parts.length-1?<span aria-current="page">{name(part)}</span>:<Link href={`/${parts.slice(0,index+1).join('/')}`}>{name(part)}</Link>}</li>)}</ol></nav>
}
