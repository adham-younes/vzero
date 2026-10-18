'use client'
import {useEffect, useRef} from 'react'

export default function HeroVideo() {
 const ref = useRef<HTMLVideoElement>(null)
 useEffect(() => {
  const video = ref.current
  if (!video) return
  const resume = () => {
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
  const fallback = () => {
   if (video.dataset.fallback) return
   video.dataset.fallback = 'true'
   video.src = 'https://videos.pexels.com/video-files/18419650/18419650-uhd_2560_1440_30fps.mp4'
   video.load()
   resume()
  }
  video.addEventListener('error', fallback)
  return () => {
   video.removeEventListener('canplay', resume)
   window.removeEventListener('pageshow', resume)
   document.removeEventListener('visibilitychange', resume)
   document.removeEventListener('pointerdown', resume)
   document.removeEventListener('keydown', resume)
   video.removeEventListener('error', fallback)
  }
 }, [])
 return <div className="home-video-background" aria-hidden="true"><video ref={ref} autoPlay muted loop playsInline preload="auto" className="architecture-video" src="/videos/background.mp4"/><div className="video-tint"/></div>
}
