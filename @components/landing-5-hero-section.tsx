'use client'
import {Action,useLanguage} from './agynexa-shell'
import Link from './locale-link'
import {buttonVariants} from '@/components/ui/button'
import {ArrowUpRight} from 'lucide-react'
import {usePageCopy} from './public-copy'
export default function HeroSection(){
 const {t}=useLanguage();const copy=usePageCopy('/')
 const introduction=copy.blocks.slice(0,copy.blocks.findIndex(block=>block.type==='heading'))
 return <section className="premium-hero"><div className="container"><div className="hero-heading"><p className="eyebrow"><span className="status-dot"/>{t(['AGENT BUILDER STUDIO','استوديو بناء وكلاء الذكاء الاصطناعي'])}</p><h1>{t(['Build AI agents', 'ابنِ وكلاء ذكاء اصطناعي'])}<br/><span>{t(['for your business operations','لعمليات شركتك'])}</span></h1><div className="hero-description space-y-4">{introduction.map((block,i)=><p key={i}>{block.text}</p>)}</div><div className="hero-actions"><Action href="/studio">{t(['Open Studio','افتح الاستوديو'])}</Action><Link href="/services" className={buttonVariants({variant:'outline',size:'lg'})}>{t(['Explore platform capabilities','استكشف قدرات المنصة'])}<ArrowUpRight data-icon="inline-end"/></Link></div></div></div></section>
}
