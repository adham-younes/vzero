import HeroSection from '@/components/pages-landing-five'
import FeaturesTwo from '@/components/features-2'
import FeaturesThree from '@/components/features-3'
import FeaturesFive from '@/components/features-5'
import Content from '@/components/content-2'
import Stats from '@/components/stats-1'
import Pricing from '@/components/pricing-1'
import Testimonials from '@/components/testimonials-2'
import CallToAction from '@/components/call-to-action-1'
import Footer from '@/components/footer-1'

export default function DuskLandingPage() {
    return (
        <>
            <HeroSection />
            <FeaturesTwo />
            <Content />
            <FeaturesThree />
            <Stats />
            <FeaturesFive />
            <Pricing />
            <Testimonials />
            <CallToAction />
            <Footer />
        </>
    )
}
