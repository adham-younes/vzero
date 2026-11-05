'use client'
import {useEffect,useState} from 'react'
import {usePathname} from 'next/navigation'

const locationEvent='agynexa:public-location'
let subscribers=0
let restoreHistory:(()=>void)|undefined
// Next's native history integration handles route state. This small shared
// subscription also observes same-path query changes made by Links/router.
function subscribeToLocation(read:()=>void){
 if(subscribers++===0){
  const push=window.history.pushState,replace=window.history.replaceState
  const pushWithNotice:History['pushState']=function(this:History,...args){push.apply(this,args);window.dispatchEvent(new Event(locationEvent))}
  const replaceWithNotice:History['replaceState']=function(this:History,...args){replace.apply(this,args);window.dispatchEvent(new Event(locationEvent))}
  window.history.pushState=pushWithNotice
  window.history.replaceState=replaceWithNotice
  restoreHistory=()=>{
   if(window.history.pushState===pushWithNotice)window.history.pushState=push
   if(window.history.replaceState===replaceWithNotice)window.history.replaceState=replace
  }
 }
 window.addEventListener('popstate',read)
 window.addEventListener(locationEvent,read)
 return ()=>{
  window.removeEventListener('popstate',read)
  window.removeEventListener(locationEvent,read)
  if(--subscribers===0){restoreHistory?.();restoreHistory=undefined}
 }
}

// Browser query state is read after hydration; static public content remains
// available without requiring a client-rendering boundary for the catalog.
export function useCatalogState(defaults:Record<string,string>){
 const pathname=usePathname()
 const [values,setValues]=useState(defaults)
 const keys=Object.keys(defaults).join(',')
 useEffect(()=>{
  const read=()=>{const params=new URLSearchParams(window.location.search);setValues(Object.fromEntries(keys.split(',').map(key=>[key,params.get(key)||defaults[key]])))}
  read()
  return subscribeToLocation(read)
 // Defaults are constant per catalog; pathname includes locale changes.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[pathname,keys])
 function update(next:Record<string,string>){
  setValues(current=>({...current,...next}))
  const url=new URL(window.location.href)
  for(const [key,value] of Object.entries(next)){if(value&&value!==defaults[key])url.searchParams.set(key,value);else url.searchParams.delete(key)}
  window.history.replaceState(null,'',url.pathname+url.search+url.hash)
 }
 return [values,update] as const
}

export function catalogDetailHref(path:string,catalog:string,values:Record<string,string>){
 const params=new URLSearchParams(Object.entries(values).filter(([,value])=>!!value))
 const from=catalog+(params.size?`?${params}`:'')
 return `${path}?from=${encodeURIComponent(from)}`
}

export function useCatalogReturn(){
 const pathname=usePathname()
 const [from,setFrom]=useState<string|null>(null)
 useEffect(()=>{
  const read=()=>{
   const value=new URLSearchParams(window.location.search).get('from')
   // Only known public catalogs and their search state can become links.
   if(!value||!/^\/(?:ar\/)?(?:services|solutions|industries)(?:\?[^#]*)?$/.test(value)){setFrom(null);return}
   const url=new URL(value,window.location.origin)
   const route=url.pathname.replace(/^\/ar(?=\/|$)/,'')
   const clean=new URLSearchParams()
   for(const key of ['category','q','industry','solution','capability','reading']){const item=url.searchParams.get(key);if(item)clean.set(key,item)}
   setFrom(route+(clean.size?`?${clean}`:''))
  }
  read()
  return subscribeToLocation(read)
 },[pathname])
 return from
}
