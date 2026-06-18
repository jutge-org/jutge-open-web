import type { HomepageStats } from '@/lib/jutge_api_client'
import { cn } from '@/lib/utils'
import { ClipboardList, PuzzleIcon, SchoolIcon, Trophy, Users } from 'lucide-react'

type HomepageStatsDashboardProps = {
    stats: HomepageStats
}

const statItems = [
    {
        key: 'users' as const,
        label: 'Users',
        icon: Users,
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
        icon: ClipboardList,
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
        icon: Trophy,
        borderAccent: 'border-t-amber-500',
        iconAccent: 'text-amber-600 dark:text-amber-400',
    },
]

function formatStat(value: number): string {
    return value.toLocaleString()
}

export function HomepageStatsDashboard({ stats }: HomepageStatsDashboardProps) {
    return (
        <section aria-label="Platform statistics" className="flex flex-col gap-4">
            <h2 className="text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Platform at a glance
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {statItems.map(({ key, label, icon: Icon, borderAccent, iconAccent }) => (
                    <div
                        key={key}
                        className={cn(
                            'flex flex-col gap-3 rounded-2xl border border-border border-t-4 bg-card px-5 py-5 shadow-sm',
                            borderAccent,
                        )}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-muted-foreground">{label}</span>
                            <Icon className={cn('size-5 shrink-0 opacity-80', iconAccent)} aria-hidden />
                        </div>
                        <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">
                            {formatStat(stats[key])}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
