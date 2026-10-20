'use client'
import {useEffect,useRef,useState} from 'react'
import {Pause,Play} from 'lucide-react'
import HeroVideo from './landing-5-hero-video'
import {useLanguage} from './agynexa-shell'

// Keep the approved Hero/video sources intact; expose a persistent pause preference.
export default function HeroMedia(){
 const {t}=useLanguage();const root=useRef<HTMLDivElement>(null)
 const pausedPreference=useRef(false);const [paused,setPaused]=useState(false)
 useEffect(()=>{
  const video=root.current?.querySelector('video');if(!video)return
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)')
  const enforce=()=>{if(pausedPreference.current)video.pause()}
  const sync=()=>setPaused(video.paused)
  const updatePreference=()=>{pausedPreference.current=motion.matches;if(motion.matches)video.pause();else void video.play().catch(()=>{});sync()}
  video.addEventListener('play',enforce);video.addEventListener('play',sync);video.addEventListener('pause',sync)
  motion.addEventListener('change',updatePreference);updatePreference()
  return ()=>{video.removeEventListener('play',enforce);video.removeEventListener('play',sync);video.removeEventListener('pause',sync);motion.removeEventListener('change',updatePreference)}
 },[])
 function toggle(){const video=root.current?.querySelector('video');if(!video)return;pausedPreference.current=!video.paused;if(pausedPreference.current)video.pause();else void video.play().catch(()=>{});setPaused(video.paused)}
 return <div ref={root}><HeroVideo/><button type="button" className="hero-motion quiet" onClick={toggle} aria-label={t(paused?['Play background video','تشغيل فيديو الخلفية']:['Pause background video','إيقاف فيديو الخلفية مؤقتًا'])}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{t(paused?['Play video','تشغيل الفيديو']:['Pause video','إيقاف الفيديو'])}</span></button></div>
}
