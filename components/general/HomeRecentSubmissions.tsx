'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { SendIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useAuth } from '@/components/AuthProvider'
import { HomeWidgetCard, HomeWidgetLoading, HomeWidgetMessage } from '@/components/general/HomeWidgetCard'
import { ProblemIconImage } from '@/components/problems/ProblemIconImage'
import { ProblemTitleSummaryTooltip } from '@/components/problems/ProblemTitleSummaryTooltip'
import { TooltipProvider } from '@/components/ui/tooltip'
import { fetchSubmissionsData } from '@/lib/data/submissions'
import jutge from '@/lib/jutge'
import type { SubmissionRow } from '@/lib/submissions'
import { cn } from '@/lib/utils'

dayjs.extend(relativeTime)

const MAX_RECENT_SUBMISSIONS = 10
const ROW_HEIGHT_REM = 2

function RecentSubmissionRow({ row, preferredLanguageId }: { row: SubmissionRow; preferredLanguageId: string | null }) {
    return (
        <ProblemTitleSummaryTooltip
            problem_nm={row.problem_nm}
            title={row.problemTitle}
            preferredLanguageId={preferredLanguageId}
        >
            <Link
                href={row.submissionHref}
                style={{ height: `${ROW_HEIGHT_REM}rem` }}
                className={cn(
                    'flex items-center gap-2 border-b border-border/50 px-3 text-xs last:border-b-0',
                    'transition-colors hover:bg-accent/40',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                )}
            >
                {row.iconUrl ? (
                    <ProblemIconImage iconUrl={row.iconUrl} size="xs" />
                ) : (
                    <span className="size-4 shrink-0" aria-hidden />
                )}
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">{row.problemTitle}</span>
                <span className="w-9 shrink-0 text-right text-muted-foreground tabular-nums">{row.submission_id}</span>
                <span
                    className={cn(
                        'inline-flex w-5 shrink-0 justify-center text-sm leading-none',
                        row.verdict === 'Pending' && 'animate-pulse',
                    )}
                    title={row.verdictFullName}
                    aria-label={row.verdictFullName}
                >
                    {row.verdictEmoji ?? '—'}
                </span>
                <span className="w-[5.75rem] shrink-0 whitespace-nowrap text-right text-muted-foreground tabular-nums">
                    {dayjs(row.time_inMs).fromNow()}
                </span>
            </Link>
        </ProblemTitleSummaryTooltip>
    )
}

export function HomeRecentSubmissions() {
    const [rows, setRows] = useState<SubmissionRow[] | null>(null)
    const { profile } = useAuth()
    const preferredLanguageId = profile?.language_id ?? null

    useEffect(() => {
        let active = true
        void fetchSubmissionsData(jutge)
            .then((allRows) => {
                if (!active) return
                const recent = [...allRows].sort((a, b) => b.time_inMs - a.time_inMs).slice(0, MAX_RECENT_SUBMISSIONS)
                setRows(recent)
            })
            .catch(() => {
                if (active) setRows([])
            })
        return () => {
            active = false
        }
    }, [])

    return (
        <HomeWidgetCard
            title="Recent submissions"
            href="/submissions"
            accentClassName="border-t-blue-500"
            icon={<SendIcon className="size-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />}
        >
            {rows === null ? (
                <HomeWidgetLoading label="Loading recent submissions" />
            ) : rows.length === 0 ? (
                <HomeWidgetMessage>No submissions yet.</HomeWidgetMessage>
            ) : (
                <TooltipProvider>
                    {rows.map((row) => (
                        <RecentSubmissionRow key={row.rowKey} row={row} preferredLanguageId={preferredLanguageId} />
                    ))}
                </TooltipProvider>
            )}
        </HomeWidgetCard>
    )
}
