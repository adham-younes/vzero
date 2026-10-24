'use client'
import {Action,useLanguage} from './agynexa-shell'
import Link from './locale-link'
import {buttonVariants} from '@/components/ui/button'
import {ArrowUpRight} from 'lucide-react'
export default function HeroSection(){
 const {t}=useLanguage()
 return <section className="premium-hero"><div className="container"><div className="hero-heading"><p className="eyebrow"><span className="status-dot"/>{t(['AGENT BUILDER STUDIO','استوديو بناء الوكلاء'])}</p><h1>{t(['Build AI agents around', 'ابنِ وكلاء ذكاء اصطناعي'])}<br/><span>{t(["your company's work",'للعمل الذي تعرفه'])}</span></h1><p className="hero-description">{t(["AGYNEXA is an Agent Builder Studio for company knowledge and business workflows. Define an agent’s role, add approved information and work with its responses in your private workspace.",'AGYNEXA استوديو لبناء الوكلاء حول معرفة المؤسسة وسير العمل. حدّد دور الوكيل، وأضف المعلومات المعتمدة، وتابع إجاباته في مساحة عملك الخاصة.'])}</p><div className="hero-actions"><Action href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Action><Link href="/services" className={buttonVariants({variant:'outline',size:'lg'})}>{t(['Explore platform capabilities','استكشف قدرات المنصة'])}<ArrowUpRight data-icon="inline-end"/></Link></div></div></div></section>
}
