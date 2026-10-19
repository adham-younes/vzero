'use client'
import {useLanguage} from './agynexa-shell'
import {ShieldCheck} from 'lucide-react'
export default function SystemDiagram(){
 const {t}=useLanguage()
 return <figure className="system-graphic"><div className="graphic-toolbar"><span>AGYNEXA / {t(['System design','تصميم النظام'])}</span><ShieldCheck size={18} className="text-primary"/></div><svg viewBox="0 0 560 360" role="img" aria-label={t(['Approved sources feed a bounded agent, with a human review gate before output.','مصادر معتمدة تغذي وكيلًا محدد الصلاحيات، ثم مراجعة بشرية قبل تسليم النتيجة.'])}>
 <defs><pattern id="diagram-dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#ffffff18"/></pattern></defs>
 <rect width="560" height="360" fill="url(#diagram-dots)"/>
 <g stroke="var(--primary)" strokeWidth="1.5" fill="none"><path d="M140 85H185V180H220M140 180H220M140 275H185V180M340 180H392V112H430M392 180V275H430"/><circle cx="185" cy="180" r="4" fill="var(--primary)"/><circle cx="392" cy="180" r="4" fill="var(--primary)"/></g>
 {[{y:56,label:t(['Knowledge','المعرفة'])},{y:151,label:t(['Business tools','أدوات العمل'])},{y:246,label:t(['Policies','السياسات'])}].map(x=><g key={x.y}><rect x="24" y={x.y} width="116" height="58" rx="7" fill="var(--card)" stroke="var(--border)"/><text x="82" y={x.y+34} textAnchor="middle" fontSize="13">{x.label}</text></g>)}
 <rect x="218" y="118" width="124" height="124" rx="12" fill="var(--background)" stroke="var(--primary)" strokeWidth="1.5"/>
 <g transform="translate(261,139)" stroke="var(--primary)" strokeWidth="1.5" fill="none"><rect width="38" height="38" rx="8"/><path d="M10 27L19 10L28 27M14 21H24M19 0V-6M19 38V44M0 19H-6M38 19H44"/></g>
 <text x="280" y="206" textAnchor="middle" fontSize="15">{t(['Agent system','نظام الوكلاء'])}</text><text x="280" y="226" textAnchor="middle" fontSize="10" opacity=".7">{t(['DEFINED PERMISSIONS','صلاحيات محددة'])}</text>
 <rect x="430" y="77" width="106" height="70" rx="7" fill="var(--card)" stroke="var(--primary)"/><text x="483" y="109" textAnchor="middle" fontSize="12">{t(['Human review','مراجعة بشرية'])}</text><path d="m474 125 6 5 12-12" stroke="var(--primary)" fill="none" strokeWidth="2"/>
 <rect x="430" y="246" width="106" height="58" rx="7" fill="var(--card)" stroke="var(--border)"/><text x="483" y="280" textAnchor="middle" fontSize="10.5">{t(['Evidence & output','الدليل والنتيجة'])}</text>
 </svg><figcaption>{t(['Architecture illustration · Connections are defined for each engagement.','رسم توضيحي للبنية · تُحدّد الاتصالات بحسب نطاق كل مشروع.'])}</figcaption></figure>
}
