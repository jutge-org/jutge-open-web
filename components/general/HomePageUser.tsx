import { CrownIcon, EyeIcon, GraduationCapIcon, LayoutDashboardIcon } from 'lucide-react'
import Link from 'next/link'

import { HomeActivityStats } from '@/components/general/HomeActivityStats'
import { HomeRecentCourses } from '@/components/general/HomeRecentCourses'
import { HomeRecentProblems } from '@/components/general/HomeRecentProblems'
import { HomeRecentSubmissions } from '@/components/general/HomeRecentSubmissions'
import { HomeSuggestedProblems } from '@/components/general/HomeSuggestedProblems'
import { HomeYearsGithubCorner } from '@/components/general/HomeYearsGithubCorner'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { canAccessSupervision, type SessionUser } from '@/lib/session'

type HomePageUserProps = {
    user: SessionUser | null
}

export function HomePageUser({ user }: HomePageUserProps) {
    const userName = user?.nickname ?? user?.name ?? 'user'

    return (
        <div className="flex flex-col gap-6">
            <HomeYearsGithubCorner />
            <MainBreadcrumbs breadcrumbs={[{ title: 'Jutge.org', url: '/' }]} />

            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
                        <LayoutDashboardIcon className="size-5 shrink-0 text-primary" aria-hidden />
                        Dashboard
                    </h1>
                    <div className="flex items-center gap-2">
                        <RoleButtons user={user} />
                        <Link
                            href="/profile"
                            className="rounded-md text-sm font-bold tracking-tight text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {userName}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 pb-12">
                {/* Two rows of equal-height widget cards: where you were working on top,
                    what you did and where to go next below. */}
                <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
                    <HomeRecentCourses />
                    <HomeRecentProblems />
                    <HomeRecentSubmissions />
                    <HomeSuggestedProblems />
                </div>
                <HomeActivityStats />
            </div>
        </div>
    )
}

/** Shortcuts to the areas this account can reach, if any. */
function RoleButtons({ user }: { user: SessionUser | null }) {
    if (!user) {
        return null
    }

    return (
        <>
            {canAccessSupervision(user) ? (
                <RoleButton href="/supervision" label="Supervision">
                    <EyeIcon className="size-3.5" aria-hidden />
                </RoleButton>
            ) : null}
            {user.instructor ? (
                <RoleButton href="/instructor" label="Instructor">
                    <GraduationCapIcon className="size-3.5" aria-hidden />
                </RoleButton>
            ) : null}
            {user.administrator ? (
                <RoleButton href="/administrator" label="Administrator">
                    <CrownIcon className="size-3.5" aria-hidden />
                </RoleButton>
            ) : null}
        </>
    )
}

function RoleButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
    return (
        <Button asChild variant="outline" size="sm" className="h-7 gap-1.5 px-2.5 text-xs font-semibold">
            <Link href={href}>
                {children}
                {label}
            </Link>
        </Button>
    )
}
