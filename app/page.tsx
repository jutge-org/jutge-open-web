import { HomeLoginCard } from '@/components/HomeLoginCard'
import { HomepageStatsDashboard } from '@/components/general/HomepageStatsDashboard'
import { HomeQuickNav } from '@/components/general/HomeQuickNav'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { isAuthenticated, tryGetCurrentUser } from '@/lib/auth'
import { fetchHomepageStats } from '@/services/queries/misc'

export const dynamic = 'force-dynamic'

export default async function Home() {
    const authenticated = await isAuthenticated()
    const user = authenticated ? await tryGetCurrentUser() : null
    const homepageStats = authenticated ? null : await fetchHomepageStats()

    return (
        <div className="flex flex-col gap-10">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Jutge.org', url: '/' }]} />
            <div className="flex flex-col items-center space-y-4 pt-8 text-center">
                <h1 className="text-5xl font-thin tracking-wide text-balance sm:text-6xl dark:inline-block dark:bg-linear-to-r dark:from-cyan-300 dark:via-sky-400 dark:to-blue-500 dark:bg-clip-text dark:pb-1 dark:leading-[1.2] dark:text-transparent">
                    Jutge.org
                </h1>
                <p className="max-w-2xl text-xl text-pretty text-muted-foreground italic sm:text-2xl">
                    {authenticated
                        ? `Welcome back, ${user?.name ?? 'user'}`
                        : 'The Virtual Learning Environment for Computer Programming'}
                </p>
            </div>

            {authenticated ? (
                <HomeQuickNav
                    authenticated
                    instructor={user?.instructor ?? false}
                    administrator={user?.administrator ?? false}
                />
            ) : (
                <>
                    <HomeLoginCard />
                    <HomeQuickNav authenticated={false} />
                    {homepageStats ? <HomepageStatsDashboard stats={homepageStats} /> : null}
                </>
            )}
        </div>
    )
}
