import HeroSection from '@/components/landing-5-hero-section'
import { HomeSections } from '@/components/agynexa-sections'
import HeroMedia from '@/components/hero-media'

import {pageMetadata} from '@/lib/site-routes'
export const metadata=pageMetadata([],false)

export default function DuskLandingPage() {
    return <main id="main" className="home-page"><HeroMedia /><HeroSection /><HomeSections /></main>
}
