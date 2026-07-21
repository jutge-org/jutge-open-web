'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FileCodeIcon } from 'lucide-react'
import Link from 'next/link'

import { useAuth } from '@/components/AuthProvider'
import { HomeWidgetCard, HomeWidgetMessage } from '@/components/general/HomeWidgetCard'
import { ProblemIconImage } from '@/components/problems/ProblemIconImage'
import { ProblemTitleSummaryTooltip } from '@/components/problems/ProblemTitleSummaryTooltip'
import { useRecents } from '@/components/RecentsProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { recentProblemHref, type RecentProblemItem } from '@/lib/recents'

dayjs.extend(relativeTime)

const ROW_HEIGHT_REM = 2

// Titles are filled in from the API by RecentsProvider. Until that lands the store may still hold
// the problem name, which is shown rather than leaving the row blank.
function recentProblemTitle(problem: RecentProblemItem): string {
    return problem.title.trim() || problem.problemNm
}

// Recent problems come straight from the client-side recents store (sorted by accessedAt).
export function HomeRecentProblems() {
    const { recents } = useRecents()
    const { profile } = useAuth()
    const preferredLanguageId = profile?.language_id ?? null

    return (
        <HomeWidgetCard
            title="Recent problems"
            href="/problems"
            accentClassName="border-t-violet-500"
            icon={<FileCodeIcon className="size-4 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden />}
        >
            {recents.problems.length === 0 ? (
                <HomeWidgetMessage>No recent problems.</HomeWidgetMessage>
            ) : (
                <TooltipProvider>
                    {recents.problems.map((problem) => (
                        <RecentProblemRow
                            key={problem.problemNm}
                            problem={problem}
                            preferredLanguageId={preferredLanguageId}
                        />
                    ))}
                </TooltipProvider>
            )}
        </HomeWidgetCard>
    )
}

function RecentProblemRow({
    problem,
    preferredLanguageId,
}: {
    problem: RecentProblemItem
    preferredLanguageId: string | null
}) {
    return (
        <ProblemTitleSummaryTooltip
            problem_nm={problem.problemNm}
            title={recentProblemTitle(problem)}
            preferredLanguageId={preferredLanguageId}
        >
            <Link
                href={recentProblemHref(problem)}
                style={{ height: `${ROW_HEIGHT_REM}rem` }}
                className="flex items-center gap-2 border-b border-border/50 px-3 text-xs transition-colors last:border-b-0 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
                {problem.iconUrl ? (
                    <ProblemIconImage iconUrl={problem.iconUrl} size="xs" />
                ) : (
                    <span className="size-4 shrink-0" aria-hidden />
                )}
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                    {recentProblemTitle(problem)}
                </span>
                <span className="shrink-0 whitespace-nowrap text-muted-foreground tabular-nums">
                    {dayjs(problem.accessedAt).fromNow(true)}
                </span>
            </Link>
        </ProblemTitleSummaryTooltip>
    )
}
