'use client'
import {Action,useLanguage} from './agynexa-shell'
import Link from './locale-link'
import {buttonVariants} from '@/components/ui/button'
import {ArrowUpRight} from 'lucide-react'
import {usePageCopy} from './public-copy'
export default function HeroSection(){
 const {t}=useLanguage();const copy=usePageCopy('/')
 return <section className="premium-hero"><div className="container"><div className="hero-heading"><p className="eyebrow"><span className="status-dot"/>{t(['AGENT BUILDER STUDIO','استوديو بناء الوكلاء'])}</p><h1>{t(['Build AI agents', 'ابنِ وكلاء يفهمون'])}<br/><span>{t(['for the way your company works','طبيعة العمل في شركتك'])}</span></h1><p className="hero-description">{copy.blocks[0].text}</p><div className="hero-actions"><Action href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Action><Link href="/services" className={buttonVariants({variant:'outline',size:'lg'})}>{t(['Explore platform capabilities','استكشف قدرات المنصة'])}<ArrowUpRight data-icon="inline-end"/></Link></div></div></div></section>
}
