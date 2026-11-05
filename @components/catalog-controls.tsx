'use client'
import type {ReactNode} from 'react'
import {useId} from 'react'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'
import {ChevronDown} from 'lucide-react'
import {useLanguage} from './agynexa-shell'

export function CatalogSelect({label,value,onChange,controls,children}:{label:string;value:string;onChange:(value:string)=>void;controls?:string;children:ReactNode}){
 const id=useId()
 return <div className="catalog-control">
  <Label htmlFor={id}>{label}</Label>
  <div className="catalog-select">
   <select id={id} className="field" value={value} onChange={event=>onChange(event.target.value)} aria-controls={controls}>
    {children}
   </select>
   <ChevronDown size={16} aria-hidden="true"/>
  </div>
 </div>
}

export function CatalogSearch({label,placeholder,query,onSearch,controls}:{label:string;placeholder:string;query:string;onSearch:(value:string)=>void;controls:string}){
 const id=useId()
 return <div className="catalog-control catalog-search-control">
  <Label htmlFor={id}>{label}</Label>
  <Input id={id} type="search" value={query} onChange={event=>onSearch(event.target.value)} placeholder={placeholder} aria-controls={controls}/>
 </div>
}

export function CatalogToolbar({count,children}:{count?:number;children:ReactNode}){
 const {ar,t}=useLanguage()
 const resultCount=count===undefined?null:new Intl.NumberFormat(ar?'ar-EG':'en-US').format(count)
 return <div className="catalog-controls-block">
  <div className="catalog-toolbar">{children}</div>
  {resultCount!==null&&<p className="catalog-result-total" role="status" aria-live="polite">{t([`Results: ${resultCount}`,`النتائج: ${resultCount}`])}</p>}
 </div>
}

export function CatalogChoices({items,label,selected,onChoose,controls,idPrefix}:{
 items:{key:string;label:string;icon?:ReactNode}[]
 label:string
 selected:string
 onChoose:(value:string)=>void
 controls:string
 idPrefix:string
}){
 return <div className="catalog-tiles" data-count={items.length} role="group" aria-label={label}>
  {items.map(item=><Button
   key={item.key}
   id={`${idPrefix}-${item.key}`}
   type="button"
   variant="outline"
   className="catalog-tile"
   aria-pressed={item.key===selected}
   aria-controls={controls}
   onClick={()=>onChoose(item.key)}
  >
   {item.icon&&<span aria-hidden="true">{item.icon}</span>}
   <span>{item.label}</span>
  </Button>)}
 </div>
}
