'use client'

import { SparklesIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useAuth } from '@/components/AuthProvider'
import { HomeWidgetCard, HomeWidgetLoading, HomeWidgetMessage } from '@/components/general/HomeWidgetCard'
import { ProblemIconImage } from '@/components/problems/ProblemIconImage'
import { ProblemTitleSummaryTooltip } from '@/components/problems/ProblemTitleSummaryTooltip'
import { useRecents } from '@/components/RecentsProvider'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    fetchSuggestionPool,
    selectSuggestions,
    SUGGESTION_MODE_DESCRIPTIONS,
    SUGGESTION_MODE_LABELS,
    SUGGESTION_MODES,
    type SuggestedProblem,
    type SuggestionMode,
    type SuggestionPool,
} from '@/lib/data/suggestedProblems'

const ROW_HEIGHT_REM = 2.66

export function HomeSuggestedProblems() {
    const { recents } = useRecents()
    const { profile } = useAuth()
    const preferredLanguageId = profile?.language_id ?? null
    const [mode, setMode] = useState<SuggestionMode>('continue')
    const [pool, setPool] = useState<SuggestionPool | null>(null)
    const [loaded, setLoaded] = useState(false)
    const [suggestions, setSuggestions] = useState<SuggestedProblem[]>([])

    const lastListNm = recents.lists[0]?.listNm ?? null
    const lastCourseKey = recents.courses[0]?.courseKey ?? null

    // Reload when the collection the suggestions are drawn from changes.
    useEffect(() => {
        let active = true
        setLoaded(false)
        void fetchSuggestionPool(recents)
            .then((next) => {
                if (!active) return
                setPool(next)
                setLoaded(true)
            })
            .catch(() => {
                if (!active) return
                setPool(null)
                setLoaded(true)
            })
        return () => {
            active = false
        }
        // Only the identity of the source collection matters, not every recents change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastListNm, lastCourseKey])

    useEffect(() => {
        setSuggestions(pool ? selectSuggestions(pool, mode) : [])
    }, [pool, mode])

    return (
        <HomeWidgetCard
            title="Suggested problems"
            accentClassName="border-t-emerald-500"
            icon={<SparklesIcon className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />}
            action={<ModeMenu mode={mode} onSelect={setMode} disabled={!loaded} />}
        >
            {!loaded ? (
                <HomeWidgetLoading label="Loading suggested problems" />
            ) : pool === null ? (
                <HomeWidgetMessage>Visit a course to get suggestions.</HomeWidgetMessage>
            ) : suggestions.length === 0 ? (
                <HomeWidgetMessage>
                    {mode === 'retry'
                        ? `Nothing to retry in ${pool.sourceLabel}.`
                        : mode === 'continue'
                          ? `You solved everything in ${pool.sourceLabel}.`
                          : `No problems in ${pool.sourceLabel}.`}
                </HomeWidgetMessage>
            ) : (
                <TooltipProvider>
                    {suggestions.map((problem) => (
                        <SuggestedProblemRow
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

function ModeMenu({
    mode,
    onSelect,
    disabled,
}: {
    mode: SuggestionMode
    onSelect: (mode: SuggestionMode) => void
    disabled: boolean
}) {
    return (
        <TooltipProvider>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={disabled}
                                className="-mr-1 h-6 shrink-0 px-1.5 text-xs font-medium text-muted-foreground"
                                aria-label={`Suggestion mode: ${SUGGESTION_MODE_LABELS[mode]}. Change it`}
                            >
                                {SUGGESTION_MODE_LABELS[mode]}
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">{SUGGESTION_MODE_DESCRIPTIONS[mode]}</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                    {SUGGESTION_MODES.map((option) => (
                        <DropdownMenuItem key={option} onSelect={() => onSelect(option)}>
                            <span className="flex flex-col">
                                <span className={option === mode ? 'font-semibold' : undefined}>
                                    {SUGGESTION_MODE_LABELS[option]}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {SUGGESTION_MODE_DESCRIPTIONS[option]}
                                </span>
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    )
}

function SuggestedProblemRow({
    problem,
    preferredLanguageId,
}: {
    problem: SuggestedProblem
    preferredLanguageId: string | null
}) {
    return (
        <ProblemTitleSummaryTooltip
            problem_nm={problem.problemNm}
            title={problem.title}
            preferredLanguageId={preferredLanguageId}
        >
            <Link
                href={`/problems/${problem.problemNm}`}
                style={{ height: `${ROW_HEIGHT_REM}rem` }}
                className="flex items-center gap-2 border-b border-border/50 px-3 text-xs transition-colors last:border-b-0 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
                {problem.iconUrl ? (
                    <ProblemIconImage iconUrl={problem.iconUrl} size="xs" />
                ) : (
                    <span className="size-4 shrink-0" aria-hidden />
                )}
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                    {problem.title || problem.problemNm}
                </span>
            </Link>
        </ProblemTitleSummaryTooltip>
    )
}
