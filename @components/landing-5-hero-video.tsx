'use client'
import {useEffect,useRef,useState} from 'react'
import {Pause,Play} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useLanguage} from './agynexa-shell'
export default function HeroVideo(){
 const ref=useRef<HTMLVideoElement>(null); const [playing,setPlaying]=useState(false); const [failed,setFailed]=useState(false);const {t}=useLanguage()
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)'); const sync=()=>{if(query.matches)ref.current?.pause();else ref.current?.play().catch(()=>setPlaying(false))};sync();query.addEventListener('change',sync);return()=>query.removeEventListener('change',sync)},[])
 return <><video ref={ref} muted loop playsInline preload="auto" poster="/images/architecture.png" className="architecture-video" src="https://videos.pexels.com/video-files/18419650/18419650-uhd_2560_1440_30fps.mp4" onError={()=>setFailed(true)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} aria-label={t(['Atmospheric system visualization','تصوير بصري لأجواء النظام'])}/><div className="video-tint"/><div className="video-control">{failed?<p role="status">{t(['Video unavailable. Architecture preview shown.','الفيديو غير متاح. تُعرض معاينة البنية.'])}</p>:<Button variant="outline" size="sm" aria-label={t(playing?['Pause video','إيقاف الفيديو']:['Play video','تشغيل الفيديو'])} onClick={()=>{if(playing)ref.current?.pause();else ref.current?.play().catch(()=>setFailed(true))}}>{playing?<Pause/>:<Play/>}{t(playing?['Pause','إيقاف']:['Play film','تشغيل الفيديو'])}</Button>}</div></>
}
