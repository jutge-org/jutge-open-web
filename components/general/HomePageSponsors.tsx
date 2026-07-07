'use client'

import { useAppearancePreferences } from '@/components/AppearancePreferencesProvider'
import { HomeSectionHeading } from '@/components/general/HomeSectionHeading'
import { Marquee, MarqueeContent, MarqueeItem } from '@/components/kibo-ui/marquee'
import { isMotionReduced } from '@/lib/reducedMotion'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const sponsors = [
    {
        href: 'https://www.upc.edu/en',
        src: '/logos/upc.svg',
        alt: 'Universitat Politècnica de Catalunya',
    },
    {
        href: 'https://www.fib.upc.edu/en',
        src: '/logos/fib.svg',
        alt: "Facultat d'Informàtica de Barcelona",
    },
    {
        href: 'https://www.fme.upc.edu/en',
        src: '/logos/fme.svg',
        alt: 'Facultat de Matemàtiques i Estadística',
    },
    {
        href: 'https://olimpiada-informatica.cat',
        src: '/logos/oicat.svg',
        alt: 'Olimpiada Informàtica Catalana',
    },
    {
        href: 'https://jutge.org',
        src: '/logos/jutge.svg',
        alt: 'Jutge.org',
    },
]

const sponsorCardClassName =
    'grid h-34 w-36 shrink-0 grid-rows-[4.5rem_minmax(0,1fr)] gap-2 justify-items-center text-center'

function SponsorLogoCard({ href, src, alt, className }: (typeof sponsors)[number] & { className?: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cn(sponsorCardClassName, className)}>
            <div className="row-start-1 flex h-full w-full min-h-0 items-end justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    alt={alt}
                    className="max-h-full max-w-full object-contain opacity-80 grayscale transition-opacity hover:opacity-100 dark:invert"
                    src={src}
                />
            </div>
            <span className="row-start-2 block w-full self-start px-1 text-center text-xs leading-tight text-pretty text-muted-foreground">
                {alt}
                <span className="sr-only"> (opens in new window)</span>
            </span>
        </a>
    )
}

export function HomePageSponsors({ className }: { className?: string }) {
    const { reducedMotion } = useAppearancePreferences()
    const [systemPrefersReduced, setSystemPrefersReduced] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setSystemPrefersReduced(mediaQuery.matches)

        function handleChange(event: MediaQueryListEvent) {
            setSystemPrefersReduced(event.matches)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const motionReduced = !mounted || isMotionReduced(reducedMotion, systemPrefersReduced)

    return (
        <section aria-label="Sponsors" className={cn('home-page-logos flex w-full flex-col gap-4', className)}>
            <HomeSectionHeading>
                <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Sponsors</h2>
            </HomeSectionHeading>
            {motionReduced ? (
                <ul className="flex flex-wrap items-start justify-center gap-x-8 gap-y-6">
                    {sponsors.map((sponsor) => (
                        <li key={sponsor.href}>
                            <SponsorLogoCard {...sponsor} />
                        </li>
                    ))}
                </ul>
            ) : (
                <Marquee>
                    <MarqueeContent autoFill={false} speed={40}>
                        {sponsors.map((sponsor) => (
                            <MarqueeItem key={sponsor.href} className="h-34 self-start">
                                <SponsorLogoCard {...sponsor} className="mx-8" />
                            </MarqueeItem>
                        ))}
                    </MarqueeContent>
                </Marquee>
            )}
        </section>
    )
}
