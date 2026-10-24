'use client'
import {createContext,useContext,useEffect,useRef,useState} from 'react'
import Link from './locale-link'
import {usePathname,useRouter} from 'next/navigation'
import {Menu,X,ArrowUpRight} from 'lucide-react'
import {nav} from '@/lib/agynexa'
import {buttonVariants} from '@/components/ui/button'
const LanguageContext=createContext({ar:false,t:(copy:readonly string[])=>copy[0]})
export const useLanguage=()=>useContext(LanguageContext)
export function Action({href,children}:{href:string;children:React.ReactNode}){return <Link className={buttonVariants({size:'lg'})} href={href}>{children}<ArrowUpRight size={16}/></Link>}
export default function Shell({children}:{children:React.ReactNode}){
 const [open,setOpen]=useState(false)
 const menuButton=useRef<HTMLButtonElement>(null)
 const pathname=usePathname();const ar=pathname.split('/')[1]==='ar'
 const path=pathname.replace(/^\/ar(?=\/|$)/,'')||'/'
 const router=useRouter();const t=(copy:readonly string[])=>copy[ar?1:0]
 useEffect(()=>{document.documentElement.lang=ar?'ar':'en';document.documentElement.dir=ar?'rtl':'ltr'},[ar])
 useEffect(()=>setOpen(false),[pathname])
 useEffect(()=>{
  if(!open)return
  const close=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);menuButton.current?.focus()}}
  document.addEventListener('keydown',close)
  return ()=>document.removeEventListener('keydown',close)
 },[open])
 const groups=[
  {title:['Explore','استكشف'],slugs:['solutions','services','industries','methodology']},
  {title:['Learn more','اعرف أكثر'],slugs:['architecture','integrations','security','resources','about']},
 ]
 if(path==='/studio')return <LanguageContext.Provider value={{ar,t}}><a href="#main" className="skip">{t(['Skip to conversation','تجاوز إلى المحادثة'])}</a>{children}</LanguageContext.Provider>
 if(pathname.startsWith('/widget/'))return <>{children}</>
 return <LanguageContext.Provider value={{ar,t}}>
  <a href="#main" className="skip">{t(['Skip to content','انتقل إلى المحتوى'])}</a>
  <header className="site-header">
   <div className="container header-row">
    <Link href="/" aria-label={t(['AGYNEXA home','AGYNEXA الرئيسية'])} className="brand" dir="ltr">AGYNEXA<span className="text-primary">.</span></Link>
    <nav aria-label={t(['Main navigation','التنقل الرئيسي'])} className="desktop-nav">{nav.slice(0,5).map(([slug,en,arabic])=><Link key={slug} aria-current={path===`/${slug}`?'page':undefined} href={`/${slug}`}>{t([en,arabic])}</Link>)}</nav>
    <div className="header-actions">
     <button className="language-switch" type="button" aria-label={ar?'Switch to English':'التبديل إلى العربية'} title={ar?'English':'العربية'} lang={ar?'en':'ar'} onClick={()=>router.push((ar?path:`/ar${path==='/'?'':path}`)+window.location.search+window.location.hash)}><span dir="ltr">{ar?'EN':'AR'}</span></button>
     <Link className="header-account" href="/account">{t(['Account','حسابي'])}</Link>
     <div className="header-cta"><Action href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Action></div>
     <button ref={menuButton} className="quiet menu-toggle" aria-expanded={open} aria-controls="site-menu" aria-label={t(open?['Close menu','إغلاق القائمة']:['Open menu','فتح القائمة'])} onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button>
    </div>
   </div>
   {open&&<nav id="site-menu" aria-label={t(['All pages','كل الصفحات'])} className="site-menu container">
    <div className="menu-start"><Action href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Action><p className="muted text-sm">{t(['Build a private agent around your company’s knowledge and the work it needs to support.','ابنِ وكيلًا خاصًا يستفيد من معرفة شركتك ويؤدي دورًا مفهومًا في العمل.'])}</p><Link className="text-link" href="/account">{t(['Your account','حسابك'])}</Link><Link className="text-link" href="/studio">{t(['Agent Studio','استوديو الوكلاء'])}</Link></div>
    {groups.map(group=><div className="menu-group" key={group.title[0]}><p>{t(group.title)}</p>{group.slugs.map(slug=>{const item=nav.find(n=>n[0]===slug)!;return <Link key={slug} aria-current={path===`/${slug}`?'page':undefined} href={`/${slug}`}>{t(item.slice(1))}</Link>})}{group.slugs.includes('architecture')&&<Link href="/agentnexos">AgentNexOS</Link>}</div>)}
   </nav>}
  </header>
  {children}
  <footer className="border-t"><div className="container grid gap-12 py-16 md:grid-cols-3"><div><Link className="brand" dir="ltr" href="/">AGYNEXA<span className="text-primary">.</span></Link><p className="muted mt-6">{t(['AGYNEXA is an AI Agent Builder for business. Define agent roles around your organization’s knowledge and operating procedures.','AGYNEXA منصة لبناء وكلاء الذكاء الاصطناعي للأعمال، وتحديد أدوارهم وفق معرفة المؤسسة وإجراءاتها.'])}</p><a className="inline-flex min-h-11 items-center mt-4" dir="ltr" href="mailto:adham@agynexa.si">adham@agynexa.si</a></div><nav aria-label={t(['Footer navigation','روابط التذييل'])} className="grid grid-cols-2 gap-2">{nav.map(([slug,en,arabic])=><Link className="min-h-11" key={slug} href={`/${slug}`}>{t([en,arabic])}</Link>)}</nav><div><Action href="/agentnexos">AgentNexOS</Action><p className="muted mt-4 text-sm">{t(['Agent roles, workflow rules and human decisions in one system.','أدوار الوكلاء وقواعد سير العمل والقرارات البشرية ضمن نظام واحد.'])}</p></div></div><div className="container border-t py-6 text-sm muted flex flex-wrap justify-between gap-4"><span dir="ltr">© {new Date().getFullYear()} AGYNEXA</span><nav className="flex flex-wrap gap-5"><Link href="/contact">{t(['Contact','التواصل'])}</Link><Link href="/start">{t(['Getting started','خطوات البدء'])}</Link><Link href="/privacy">{t(['Privacy','الخصوصية'])}</Link><Link href="/terms">{t(['Usage terms','شروط الاستخدام'])}</Link></nav></div></footer>
 </LanguageContext.Provider>
}
