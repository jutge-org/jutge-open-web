'use client'

import { Gavel, Send, ThumbsDown, ThumbsUp } from 'lucide-react'

import { Spinner } from '@/components/ui/spinner'
import type { DashboardSummary } from '@/lib/statistics/data'
import { cn } from '@/lib/utils'

/** Label, icon and accent per dashboard metric, shared by every place that renders them. */
export const SUMMARY_METRICS = [
    {
        key: 'acceptedProblems' as const,
        label: 'Accepted problems',
        icon: ThumbsUp,
        borderAccent: 'border-t-emerald-500',
        iconAccent: 'text-emerald-600 dark:text-emerald-400',
    },
    {
        key: 'rejectedProblems' as const,
        label: 'Rejected problems',
        icon: ThumbsDown,
        borderAccent: 'border-t-red-500',
        iconAccent: 'text-red-600 dark:text-red-400',
    },
    {
        key: 'submissions' as const,
        label: 'Submissions',
        icon: Send,
        borderAccent: 'border-t-orange-500',
        iconAccent: 'text-orange-600 dark:text-orange-400',
    },
    {
        key: 'level' as const,
        label: 'Judge level',
        icon: Gavel,
        borderAccent: 'border-t-blue-500',
        iconAccent: 'text-blue-600 dark:text-blue-400',
    },
]

type StatisticsSummaryCardsProps = {
    /** Null while the dashboard is loading — each card shows a spinner in place of its value. */
    summary: DashboardSummary | null
}

/** The full-width summary row used by the activity dashboard. */
export function StatisticsSummaryCards({ summary }: StatisticsSummaryCardsProps) {
    return (
        <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {SUMMARY_METRICS.map(({ key, label, icon: Icon, borderAccent, iconAccent }) => (
                <div
                    key={key}
                    className={cn(
                        'flex flex-col rounded-2xl border border-border border-t-4 bg-card shadow-sm',
                        borderAccent,
                    )}
                >
                    <div className="flex flex-1 items-center justify-between gap-3 px-5 py-5">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="text-sm font-medium text-muted-foreground">{label}</span>
                            {summary === null ? (
                                <Spinner className="size-8 text-muted-foreground" />
                            ) : (
                                <span className="text-3xl font-semibold tracking-tight tabular-nums">
                                    {key === 'level' ? summary.level : summary[key].toLocaleString()}
                                </span>
                            )}
                        </div>
                        <Icon className={cn('size-8 shrink-0 opacity-80', iconAccent)} aria-hidden />
                    </div>
                </div>
            ))}
        </section>
    )
}
