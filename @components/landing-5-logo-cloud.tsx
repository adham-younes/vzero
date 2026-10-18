'use client'
import { Spotify } from '@/components/ui/svgs/spotify'
import { VercelFull } from '@/components/ui/svgs/vercel'
import { SupabaseFull } from '@/components/ui/svgs/supabase'
import { Hulu } from '@/components/ui/svgs/hulu'
import { Bolt } from '@/components/ui/svgs/bolt'
import { Beacon } from '@/components/ui/svgs/beacon'
import { useMedia } from '@/hooks/use-media'
import { InfiniteSlider } from '@/components/ui/motion-primitives/infinite-slider'

export default function LogoCloud() {
    const isLarge = useMedia('(min-width: 64rem)')

    const Logos = () => {
        return (
            <>
                <Hulu
                    height={20}
                    width={60}
                />

                <VercelFull
                    height={24}
                    width={100}
                />

                <Bolt
                    height={24}
                    width={58}
                />

                <SupabaseFull className="h-7" />

                <Beacon
                    height={26}
                    width={92}
                />

                <Spotify
                    height={28}
                    width={90}
                />
            </>
        )
    }

    return (
        <section className="bg-background">
            <div className="**:fill-foreground relative m-auto max-w-7xl">
                {isLarge ? (
                    <div className="relative flex items-center justify-between px-6 py-12">
                        <Logos />
                    </div>
                ) : (
                    <InfiniteSlider
                        gap={44}
                        className="mask-x-from-85% mask-x-to-99% *:[&>svg]:scale-80 py-8"
                    >
                        <Logos />
                    </InfiniteSlider>
                )}
            </div>
        </section>
    )
}
