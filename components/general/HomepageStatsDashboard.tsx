'use client'

import type { HomepageStats } from '@/lib/jutge_api_client'
import { CodeIcon, FileBracesCornerIcon, SchoolIcon, SendIcon, TerminalIcon, TrophyIcon, UsersIcon } from 'lucide-react'
import { useState } from 'react'

import { HomepageStatCard } from '@/components/general/HomepageStatCard'
import { HomepageStatsRefreshButton } from '@/components/general/HomepageStatsRefreshButton'
import { HomeSectionHeading } from '@/components/general/HomeSectionHeading'
import { RecentSubmissionsCard } from '@/components/general/RecentSubmissionsCard'

type HomepageStatsDashboardProps = {
    stats: HomepageStats & {
        languages: number
        compilers: number
    }
}

const statItems = [
    {
        key: 'submissions' as const,
        label: 'Submissions',
        icon: SendIcon,
        borderAccent: 'border-t-cyan-400',
        iconAccent: 'text-cyan-500 dark:text-cyan-400',
    },
    {
        key: 'problems' as const,
        label: 'Problems',
        icon: FileBracesCornerIcon,
        borderAccent: 'border-t-fuchsia-500',
        iconAccent: 'text-fuchsia-500 dark:text-fuchsia-400',
    },
    {
        key: 'users' as const,
        label: 'Users',
        icon: UsersIcon,
        borderAccent: 'border-t-lime-400',
        iconAccent: 'text-lime-500 dark:text-lime-400',
    },
    {
        key: 'exams' as const,
        label: 'Exams',
        icon: SchoolIcon,
        borderAccent: 'border-t-sky-400',
        iconAccent: 'text-sky-500 dark:text-sky-400',
    },
    {
        key: 'contests' as const,
        label: 'Contests',
        icon: TrophyIcon,
        borderAccent: 'border-t-yellow-400',
        iconAccent: 'text-yellow-500 dark:text-yellow-400',
    },
    {
        key: 'languages' as const,
        label: 'Proglangs',
        icon: CodeIcon,
        borderAccent: 'border-t-violet-500',
        iconAccent: 'text-violet-500 dark:text-violet-400',
    },
    {
        key: 'compilers' as const,
        label: 'Compilers',
        icon: TerminalIcon,
        borderAccent: 'border-t-orange-500',
        iconAccent: 'text-orange-500 dark:text-orange-400',
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statItems.map(({ key, label, icon, borderAccent, iconAccent }) => (
                    <HomepageStatCard
                        key={key}
                        label={label}
                        value={stats[key]}
                        icon={icon}
                        borderAccent={borderAccent}
                        iconAccent={iconAccent}
                        replayKey={replayKey}
                    />
                ))}
                {stats.recent_submissions && (
                    <RecentSubmissionsCard recentSubmissions={stats.recent_submissions} replayKey={replayKey} />
                )}
            </div>
        </section>
    )
}
