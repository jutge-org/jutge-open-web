'use client'

import type { HomepageStats } from '@/lib/jutge_api_client'
import { cn } from '@/lib/utils'
import { PuzzleIcon, SchoolIcon, SendIcon, TrophyIcon, UsersIcon } from 'lucide-react'
import { useState } from 'react'

import { AnimatedStatValue } from '@/components/general/AnimatedStatValue'
import { HomepageStatsRefreshButton } from '@/components/general/HomepageStatsRefreshButton'
import { HomeSectionHeading } from '@/components/general/HomeSectionHeading'

type HomepageStatsDashboardProps = {
    stats: HomepageStats
}

const statItems = [
    {
        key: 'users' as const,
        label: 'Users',
        icon: UsersIcon,
        borderAccent: 'border-t-emerald-500',
        iconAccent: 'text-emerald-600 dark:text-emerald-400',
    },
    {
        key: 'problems' as const,
        label: 'Problems',
        icon: PuzzleIcon,
        borderAccent: 'border-t-violet-500',
        iconAccent: 'text-violet-600 dark:text-violet-400',
    },
    {
        key: 'submissions' as const,
        label: 'Submissions',
        icon: SendIcon,
        borderAccent: 'border-t-blue-500',
        iconAccent: 'text-blue-600 dark:text-blue-400',
    },
    {
        key: 'exams' as const,
        label: 'Exams',
        icon: SchoolIcon,
        borderAccent: 'border-t-orange-500',
        iconAccent: 'text-orange-600 dark:text-orange-400',
    },
    {
        key: 'contests' as const,
        label: 'Contests',
        icon: TrophyIcon,
        borderAccent: 'border-t-amber-500',
        iconAccent: 'text-amber-600 dark:text-amber-400',
    },
]

export function HomepageStatsDashboard({ stats }: HomepageStatsDashboardProps) {
    const [replayKey, setReplayKey] = useState(0)

    function handleRefresh() {
        setReplayKey((key) => key + 1)
    }

    return (
        <section aria-label="Platform statistics" className="flex flex-col gap-4">
            <HomeSectionHeading>
                <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                    Platform at a glance
                </h2>
                <HomepageStatsRefreshButton onRefresh={handleRefresh} />
            </HomeSectionHeading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {statItems.map(({ key, label, icon: Icon, borderAccent, iconAccent }) => (
                    <div
                        key={key}
                        className={cn(
                            'group flex flex-col gap-3 rounded-2xl border border-border border-t-4 bg-card px-5 py-5 shadow-sm',
                            borderAccent,
                        )}
                    >
                        <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground group-hover:animate-pulse">
                            <AnimatedStatValue value={stats[key]} replayKey={replayKey} />
                        </p>
                        <div className="flex items-center gap-2">
                            <Icon className={cn('size-5 shrink-0 opacity-80', iconAccent)} aria-hidden />
                            <span className={cn('text-sm font-medium', iconAccent)}>{label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
