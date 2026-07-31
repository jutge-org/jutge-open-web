'use client'

import { HomeYearsRibbon } from '@/components/general/HomeYearsRibbon'
import { AccountsBlock } from '@/components/home/AccountsBlock'
import { CardsBlock } from '@/components/home/CardsBlock'
import { DocumentationBlock } from '@/components/home/DocumentationBlock'
import { FeatureBlock } from '@/components/home/FeatureBlock'
import { GithubBlock } from '@/components/home/GithubBlock'
import { MerchandisingBlock } from '@/components/home/MerchandisingBlock'
import { HeroBlock } from '@/components/home/HeroBlock'
import { HomeSectionNav, type HomeSectionNavItem } from '@/components/home/HomeSectionNav'
import { LogoCloudBlock } from '@/components/home/LogoCloudBlock'
import { RelatedSitesBlock } from '@/components/home/RelatedSitesBlock'
import { SignInBlock } from '@/components/home/SignInBlock'
import { StatsBlock } from '@/components/home/StatsBlock'
import { TelegramBlock } from '@/components/home/TelegramBlock'
import { TestimonialBlock } from '@/components/home/TestimonialBlock'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { countActiveProglangs, getActiveCompilers } from '@/lib/documentation'
import { fetchHomepageStats } from '@/lib/data/misc'
import { fetchCompilers } from '@/lib/data/tables'
import type { HomepageStats } from '@/lib/jutge_api_client'
import { ArrowUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

const GUEST_SECTIONS: HomeSectionNavItem[] = [
    { id: 'home-hero', label: 'Jutge.org' },
    { id: 'home-account', label: 'Sign in' },
    { id: 'home-features', label: 'Learn and teach' },
    { id: 'home-stats', label: 'Platform at a glance' },
    { id: 'home-accounts', label: 'Accounts' },
    { id: 'home-related-sites', label: 'Related sites' },
    { id: 'home-telegram', label: 'Stay informed' },
    { id: 'home-documentation', label: 'Documentation' },
    { id: 'home-github', label: 'Open source' },
    { id: 'home-collectible-cards', label: 'Collectible cards' },
    { id: 'home-merchandising', label: 'Merchandising' },
    { id: 'home-testimonials', label: 'What people say' },
    { id: 'home-sponsors', label: 'Sponsors' },
]

type PlatformStats = HomepageStats & {
    languages: number
    compilers: number
}

function BackToTopButton() {
    return (
        <div className="flex justify-end px-6 pb-8">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Back to top"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <ArrowUpIcon aria-hidden />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Back to top</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export function HomePageGuest() {
    const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadStats() {
            const [homepageStats, compilers] = await Promise.all([fetchHomepageStats(), fetchCompilers()])
            if (cancelled || !homepageStats) {
                return
            }
            const activeCompilers = getActiveCompilers(compilers)
            setPlatformStats({
                ...homepageStats,
                languages: countActiveProglangs(compilers),
                compilers: activeCompilers.length,
            })
        }

        void loadStats()
        return () => {
            cancelled = true
        }
    }, [])

    const sections = platformStats
        ? GUEST_SECTIONS
        : GUEST_SECTIONS.filter((section) => section.id !== 'home-stats')

    return (
        <div className="flex flex-col">
            <HomeYearsRibbon />
            <HomeSectionNav sections={sections} />
            <HeroBlock />
            <SignInBlock />
            <FeatureBlock />
            {platformStats ? <StatsBlock stats={platformStats} /> : null}
            <AccountsBlock />
            <RelatedSitesBlock />
            <TelegramBlock />
            <CardsBlock />
            <MerchandisingBlock />
            <DocumentationBlock />
            <GithubBlock />
            <TestimonialBlock />
            <LogoCloudBlock />
            <BackToTopButton />
        </div>
    )
}
