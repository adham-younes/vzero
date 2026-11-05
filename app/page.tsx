import HeroSection from '@/components/landing-5-hero-section'
import { HomeSections } from '@/components/agynexa-sections'
import HeroVideo from '@/components/landing-5-hero-video'

import {headers} from 'next/headers'
import {pageMetadata,pageSchema} from '@/lib/site-routes'
export const metadata=pageMetadata([],false)

export default async function DuskLandingPage() {
    const ar=(await headers()).get('x-agynexa-locale')==='ar'
    return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(pageSchema([],ar)).replace(/</g,'\\u003c')}}/><main id="main" className="home-page"><HeroVideo /><HeroSection /><HomeSections /></main></>
}
