'use client'
import type {ReactNode} from 'react'
import {ArrowLeft,ChevronDown} from 'lucide-react'
import Breadcrumbs from './breadcrumbs'
import Link from './locale-link'
import {useLanguage} from './agynexa-shell'
import {useCatalogReturn} from './catalog-state'
import {CopyBlocks,type CopyBlock} from './public-copy'

export function PublicPageHeader({eyebrow,title,description,children}:{eyebrow?:readonly string[];title:string;description:ReactNode;children?:ReactNode}){
 const {t}=useLanguage()
 return <header className="container public-page-header"><Breadcrumbs/>{eyebrow&&<p className="public-kicker">{t(eyebrow)}</p>}<div className="public-heading-row"><h1>{title}</h1><div className="public-page-lead">{description}</div></div>{children}</header>
}

export function PublicSectionNav({items}:{items:{id:string;label:string}[]}){
 const {t}=useLanguage()
 return <details className="public-page-index"><summary>{t(['On this page','في هذه الصفحة'])}<ChevronDown size={16} aria-hidden="true"/></summary><nav className="public-section-nav" aria-label={t(['On this page','في هذه الصفحة'])}>{items.map(item=><a key={item.id} href={`#${item.id}`} onClick={()=>{const target=document.getElementById(item.id);if(target instanceof HTMLDetailsElement)target.open=true}}>{item.label}</a>)}</nav></details>
}

export function CatalogReturnLink({fallback}:{fallback:'/services'|'/solutions'}){
 const {t}=useLanguage();const from=useCatalogReturn();const target=from||fallback
 const label=target.startsWith('/industries')?['Back to industry context','العودة إلى القطاع']:target.startsWith('/solutions')?['Back to solutions','العودة إلى الحلول']:['Back to capabilities','العودة إلى القدرات']
 return <Link className="public-return" href={target}><ArrowLeft size={16} aria-hidden="true"/>{t(label)}</Link>
}

export function SupportingReading({title,blocks}:{title:readonly string[];blocks:CopyBlock[]}){
 const {t}=useLanguage()
 return <details className="public-supporting"><summary>{t(title)}<ChevronDown size={18} aria-hidden="true"/></summary><div className="public-reading"><CopyBlocks blocks={blocks}/></div></details>
}

export function splitCopySections(blocks:CopyBlock[]){
 const introduction:CopyBlock[]=[];const sections:{title:string;blocks:CopyBlock[]}[]=[]
 for(const block of blocks){if(block.type==='heading')sections.push({title:block.text||'',blocks:[]});else if(sections.length)sections[sections.length-1].blocks.push(block);else introduction.push(block)}
 return {introduction,sections}
}

export function EditorialSections({blocks,prefix='reading'}:{blocks:CopyBlock[];prefix?:string}){
 const {introduction,sections}=splitCopySections(blocks)
 return <><div className="public-reading public-reading-intro"><CopyBlocks blocks={introduction}/></div>{sections.map((section,i)=><section id={`${prefix}-${i+1}`} className="public-editorial-section" key={section.title}><div className="public-section-label"><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h2>{section.title}</h2></div><div className="public-reading"><CopyBlocks blocks={section.blocks}/></div></section>)}</>
}

// These paragraphs contain navigation labels only. The same destinations stay
// available as subordinate references; catalog reading no longer repeats exits.
export function withoutNavigationParagraphs(blocks:CopyBlock[]){
 return blocks.filter(block=>block.type!=='paragraph'||!/^\s*(?:\[[^\]]+\]\([^)]+\)[\s·.؛;]*)+$/.test(block.text||''))
}
