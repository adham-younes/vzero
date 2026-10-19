import HeroSection from '@/components/landing-5-hero-section'
import { HomeSections } from '@/components/agynexa-sections'
import HeroVideo from '@/components/landing-5-hero-video'

import {pageMetadata} from '@/lib/site-routes'
export const metadata=pageMetadata([],false)

export default function DuskLandingPage() {
    return <main id="main" className="home-page"><HeroVideo /><HeroSection /><HomeSections /></main>
}
