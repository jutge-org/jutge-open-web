'use client'

import { AccountsBlock } from '@/components/home/AccountsBlock'
import { CardsBlock } from '@/components/home/CardsBlock'
import { FeatureBlock } from '@/components/home/FeatureBlock'
import { HeroBlock } from '@/components/home/HeroBlock'
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

    return (
        <div className="flex flex-col">
            <HeroBlock />
            <SignInBlock />
            <FeatureBlock />
            {platformStats ? <StatsBlock stats={platformStats} /> : null}
            <AccountsBlock />
            <RelatedSitesBlock />
            <TelegramBlock />
            <CardsBlock />
            <TestimonialBlock />
            <LogoCloudBlock />
            <BackToTopButton />
        </div>
    )
}
