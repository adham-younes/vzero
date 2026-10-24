'use client'
import {Fragment} from 'react'
import Link from './locale-link'
import copy from '@/lib/public-page-copy.json'
import {useLanguage} from './agynexa-shell'

export type CopyBlock={type:string;text?:string;depth?:number;header?:string[];rows?:string[][];items?:string[];ordered?:boolean}
export function usePageCopy(route:string){const {ar}=useLanguage();return (copy as Record<string,{en:{title:string;description:string;h1:string;blocks:CopyBlock[]};ar:{title:string;description:string;h1:string;blocks:CopyBlock[]}}>)[route][ar?'ar':'en']}
function Inline({text}:{text:string}){
 // Editorial source is static text; React escapes every value. Only local paths
 // and the published contact address become links, never arbitrary HTML.
 const tokens=text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
 return <>{tokens.map((s,i)=>s.startsWith('**')?<strong key={i}>{s.slice(2,-2)}</strong>:s.startsWith('`')?<bdi dir="ltr" key={i}>{s.slice(1,-1)}</bdi>:s.startsWith('[')?(()=>{const m=s.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;return m[2].startsWith('/')?<Link key={i} href={m[2]} className="text-link">{m[1]}</Link>:<Fragment key={i}>{m[1]}</Fragment>})():<Fragment key={i}>{s}</Fragment>)}</>
}
function LinkParagraph({text}:{text:string}){
 const clean=text.replace(/^(?:Links?|Primary link|Secondary link|Supporting link|Action|الروابط|الرابط الرئيسي|الرابط الثاني|رابط مساعد|الرابط|الإجراء):\s*/,'')
 const links=[...clean.matchAll(/(\*\*[^*]+\*\*|[^\n;؛.؟]+?)\s*[→←]\s*`?(\/(?:[a-z-]+\/?)*(?:#[a-z-]+)?|mailto:adham@agynexa\.si)`?/g)]
 if(!links.length)return <p className="muted mt-5 leading-relaxed"><Inline text={text}/></p>
 let end=0
 return <p className="muted mt-5 leading-relaxed">{links.map((m,i)=>{const prefix=clean.slice(end,m.index);end=(m.index||0)+m[0].length;const label=m[1].replaceAll('**','').trim();return <Fragment key={i}><Inline text={prefix}/>{m[2].startsWith('mailto:')?<a className="text-link" href={m[2]}>{label}</a>:<Link className="text-link" href={m[2]}>{label}</Link>}</Fragment>})}<Inline text={clean.slice(end)}/></p>
}
export function CopyBlocks({blocks}:{blocks:CopyBlock[]}){return <>{blocks.map((b,i)=>b.type==='heading'?<h2 className="text-2xl md:text-3xl mt-12 mb-6 tracking-tight" key={i}><Inline text={b.text||''}/></h2>:b.type==='table'?<div className="max-w-full overflow-x-auto mt-6" key={i}><table className="w-full text-start"><thead><tr>{b.header?.map((s,j)=><th className="p-4 border-b text-start" key={j}><Inline text={s}/></th>)}</tr></thead><tbody>{b.rows?.map((row,j)=><tr key={j}>{row.map((s,k)=><td className="p-4 border-b align-top" key={k}><Inline text={s}/></td>)}</tr>)}</tbody></table></div>:b.type==='list'?<ul className="list-disc ps-6 space-y-3 mt-5 muted" key={i}>{b.items?.map((s,j)=><li key={j}><Inline text={s}/></li>)}</ul>:<LinkParagraph key={i} text={b.text||''}/>)}</>}
