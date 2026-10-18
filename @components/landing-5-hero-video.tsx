'use client'
import {useEffect,useRef,useState} from 'react'
import Image from 'next/image'
import {Pause,Play} from 'lucide-react'
import {useLanguage} from './agynexa-shell'
export default function HeroVideo(){
 const ref=useRef<HTMLVideoElement>(null);const [playing,setPlaying]=useState(false);const [reduced,setReduced]=useState(true);const {t}=useLanguage()
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>{setReduced(query.matches);if(query.matches){ref.current?.pause();setPlaying(false)}else if(ref.current){ref.current.playbackRate=.5;ref.current.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false))}};sync();query.addEventListener('change',sync);return()=>query.removeEventListener('change',sync)},[])
 return <><Image src="/images/architecture.png" alt="" fill priority sizes="100vw" className="object-cover"/><video ref={ref} aria-hidden muted loop playsInline preload="metadata" poster="/images/architecture.png" className={`absolute inset-0 size-full object-cover ${reduced?'invisible':''}`} src="https://videos.pexels.com/video-files/18419650/18419650-uhd_2560_1440_30fps.mp4" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>{!reduced&&<button className="quiet absolute end-6 top-6 z-20 bg-black/70" onClick={()=>{if(playing)ref.current?.pause();else ref.current?.play().catch(()=>setPlaying(false))}}>{playing?<Pause size={16}/>:<Play size={16}/>} {t(playing?['Pause video','إيقاف الفيديو']:['Play video','تشغيل الفيديو'])}</button>}</>
}
