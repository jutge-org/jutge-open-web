import { HomeQuickNav } from '@/components/general/HomeQuickNav'
import { HomeYearsRibbon } from '@/components/general/HomeYearsRibbon'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import type { SessionUser } from '@/lib/auth'

type HomePageUserProps = {
    user: SessionUser | null
}

export function HomePageUser({ user }: HomePageUserProps) {
    return (
        <div className="flex flex-col gap-10">
            <HomeYearsRibbon />
            <MainBreadcrumbs breadcrumbs={[{ title: 'Jutge.org', url: '/' }]} />
            <div className="flex flex-col items-center space-y-4 pt-8 text-center">
                <h1 className="inline-block bg-linear-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text pb-1 text-5xl leading-[1.2] font-thin tracking-wide text-balance text-transparent sm:text-6xl">
                    Jutge.org
                </h1>
                <p className="max-w-2xl text-xl text-pretty font-thin text-muted-foreground italic sm:text-2xl">
                    {`Welcome back, ${user?.name ?? 'user'}`}
                </p>
            </div>

            <div className="flex flex-col gap-8 pb-12">
                <HomeQuickNav
                    authenticated
                    instructor={user?.instructor ?? false}
                    administrator={user?.administrator ?? false}
                />
            </div>
        </div>
    )
}
