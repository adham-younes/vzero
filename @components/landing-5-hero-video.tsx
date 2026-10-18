'use client'
import {useEffect,useRef} from 'react'
export default function HeroVideo(){
 const ref=useRef<HTMLVideoElement>(null)
 useEffect(()=>{const preference=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>{if(preference.matches)ref.current?.pause();else void ref.current?.play().catch(()=>{})};sync();preference.addEventListener('change',sync);return()=>preference.removeEventListener('change',sync)},[])
 return <div className="home-video-background" aria-hidden="true"><video ref={ref} autoPlay muted loop playsInline preload="auto" className="architecture-video" src="https://videos.pexels.com/video-files/18419650/18419650-uhd_2560_1440_30fps.mp4"/><div className="video-tint"/></div>
}
