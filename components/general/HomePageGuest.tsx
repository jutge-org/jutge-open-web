import { HomeLoginCard } from '@/components/HomeLoginCard'
import { HomeNewsSection } from '@/components/general/HomeNewsSection'
import { HomepageStatsDashboard } from '@/components/general/HomepageStatsDashboard'
import { HomePageSponsors } from '@/components/general/HomePageSponsors'
import { HomeQuickNav } from '@/components/general/HomeQuickNav'
import { HomeYearsRibbon } from '@/components/general/HomeYearsRibbon'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { countActiveProglangs, getActiveCompilers } from '@/lib/documentation'
import { fetchHomepageStats } from '@/services/queries/misc'
import { fetchCompilers } from '@/services/queries/tables'
import Image from 'next/image'

export async function HomePageGuest() {
    const [homepageStats, compilers] = await Promise.all([fetchHomepageStats(), fetchCompilers()])
    const activeCompilers = getActiveCompilers(compilers)
    const platformStats = homepageStats
        ? {
              ...homepageStats,
              languages: countActiveProglangs(compilers),
              compilers: activeCompilers.length,
          }
        : null

    return (
        <div className="flex flex-col gap-10">
            <HomeYearsRibbon />
            <MainBreadcrumbs breadcrumbs={[{ title: 'Jutge.org', url: '/' }]} />
            <div className="flex flex-col items-center space-y-4 pt-8 text-center">
                <Image
                    src="/jutge/modern.png"
                    alt="Jutge.org"
                    width={250}
                    height={250}
                    loading="eager"
                    className="-mb-2 hover:ease-in-out hover:duration-300 hover:scale-125"
                />
                <h1 className="inline-block bg-linear-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text pb-1 leading-[1.2] font-thin tracking-wide text-balance text-transparent sm:text-8xl">
                    Jutge.org
                </h1>
                <p className="max-w-2xl text-xl text-pretty font-thin text-muted-foreground italic sm:text-2xl">
                    The Virtual Learning Environment for Computer Programming
                </p>
            </div>

            <div className="flex flex-col gap-8 pb-1">
                <HomeLoginCard />
                <HomeQuickNav authenticated={false} />
                <HomeNewsSection />
                {platformStats ? <HomepageStatsDashboard stats={platformStats} /> : null}
            </div>

            <HomePageSponsors className="mb-4" />

            <div className="py-8"></div>
        </div>
    )
}
