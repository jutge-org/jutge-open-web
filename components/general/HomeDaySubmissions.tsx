'use client'

import dayjs from 'dayjs'
import { XIcon } from 'lucide-react'
import Link from 'next/link'

import { useAuth } from '@/components/AuthProvider'
import { ProblemTitleSummaryTooltip } from '@/components/problems/ProblemTitleSummaryTooltip'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatDayLabel } from '@/lib/statistics/heatmap'
import type { SubmissionRow } from '@/lib/submissions'
import { cn } from '@/lib/utils'

function verdictClassName(verdict: string): string {
    if (verdict === 'AC') return 'text-emerald-600 dark:text-emerald-400'
    if (verdict === 'Pending') return 'animate-pulse text-muted-foreground'
    return 'text-rose-600 dark:text-rose-400'
}

type HomeDaySubmissionsProps = {
    /** Day key (UTC-midnight seconds) of the selected cell. */
    dayTs: number
    /** Null while the submissions are loading. */
    rows: SubmissionRow[] | null
    onClose: () => void
}

export function HomeDaySubmissions({ dayTs, rows, onClose }: HomeDaySubmissionsProps) {
    const { profile } = useAuth()
    const preferredLanguageId = profile?.language_id ?? null

    return (
        <Card className="h-full gap-4 rounded-2xl border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="text-base font-semibold">Submissions on {formatDayLabel(dayTs)}</CardTitle>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="-mr-1 size-7 shrink-0 text-muted-foreground"
                                onClick={onClose}
                                aria-label="Back to activity summary"
                            >
                                <XIcon className="size-4" aria-hidden />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Back to activity summary</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>

            {/* The card is sized by the calendar beside it, so the list scrolls inside instead of
                changing the card's height. */}
            <CardContent className="min-h-0 flex-1 overflow-hidden">
                {rows === null ? (
                    <div
                        aria-busy="true"
                        aria-label="Loading submissions"
                        className="flex h-full items-center justify-center"
                    >
                        <Spinner className="size-8 text-muted-foreground" />
                    </div>
                ) : rows.length === 0 ? (
                    <p className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                        No submissions on this day.
                    </p>
                ) : (
                    <TooltipProvider>
                        <ul className="h-full divide-y divide-border/50 overflow-y-auto overscroll-contain">
                            {rows.map((row) => (
                                <li key={row.rowKey}>
                                    <DaySubmissionRow row={row} preferredLanguageId={preferredLanguageId} />
                                </li>
                            ))}
                        </ul>
                    </TooltipProvider>
                )}
            </CardContent>
        </Card>
    )
}

function DaySubmissionRow({ row, preferredLanguageId }: { row: SubmissionRow; preferredLanguageId: string | null }) {
    return (
        <ProblemTitleSummaryTooltip
            problem_nm={row.problem_nm}
            title={row.problemTitle}
            preferredLanguageId={preferredLanguageId}
        >
            <Link
                href={row.submissionHref}
                className={cn(
                    'flex items-center gap-2 px-1 py-2 text-xs transition-colors hover:bg-accent/40',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                )}
            >
                <span aria-hidden className="shrink-0 text-sm leading-none">
                    {row.verdictEmoji ?? '—'}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">{row.problemTitle}</span>
                <span className="shrink-0 text-muted-foreground tabular-nums">{row.submission_id}</span>
                <span className={cn('shrink-0 font-semibold', verdictClassName(row.verdict))}>{row.verdict}</span>
                <span className="shrink-0 whitespace-nowrap text-muted-foreground tabular-nums">
                    {dayjs(row.time_inMs).format('HH:mm')}
                </span>
            </Link>
        </ProblemTitleSummaryTooltip>
    )
}
