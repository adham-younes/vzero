'use client'
import {useEffect, useRef} from 'react'

export default function HeroVideo() {
 const ref = useRef<HTMLVideoElement>(null)
 useEffect(() => {
  const video = ref.current
  if (!video) return
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  const resume = () => {
   if (preference.matches) { video.pause(); return }
   if (document.visibilityState !== 'visible') return
   video.muted = true
   video.defaultMuted = true
   void video.play().catch(() => {
    // Browser autoplay restrictions are retried on the next user interaction.
   })
  }
  resume()
  video.addEventListener('canplay', resume)
  window.addEventListener('pageshow', resume)
  document.addEventListener('visibilitychange', resume)
  document.addEventListener('pointerdown', resume)
  document.addEventListener('keydown', resume)
  preference.addEventListener('change', resume)
  return () => {
   video.removeEventListener('canplay', resume)
   window.removeEventListener('pageshow', resume)
   document.removeEventListener('visibilitychange', resume)
   document.removeEventListener('pointerdown', resume)
   document.removeEventListener('keydown', resume)
   preference.removeEventListener('change', resume)
  }
 }, [])
 return <div className="home-video-background" aria-hidden="true"><video ref={ref} autoPlay muted loop playsInline preload="auto" className="architecture-video" src="/videos/background.mp4"/><div className="video-tint"/></div>
}
