'use client'

import {
    ArrowRightIcon,
    ChevronDownIcon,
    RefreshCwIcon,
    ShuffleIcon,
    SparklesIcon,
    ThumbsDownIcon,
    type LucideIcon,
} from 'lucide-react'
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
import { useOpenWebDashboardSuggestionMode, useOpenWebSettingsStore } from '@/store/openWebSettings'

const ROW_HEIGHT_REM = 2.66

const SUGGESTION_MODE_ICONS: Record<SuggestionMode, LucideIcon> = {
    continue: ArrowRightIcon,
    retry: ThumbsDownIcon,
    random: ShuffleIcon,
}

export function HomeSuggestedProblems() {
    const { recents } = useRecents()
    const { profile } = useAuth()
    const preferredLanguageId = profile?.language_id ?? null
    // The chosen mode is remembered in the synced user settings.
    const mode = useOpenWebDashboardSuggestionMode()
    const setMode = useOpenWebSettingsStore((state) => state.setDashboardSuggestionMode)
    const [pool, setPool] = useState<SuggestionPool | null>(null)
    const [loaded, setLoaded] = useState(false)
    const [suggestions, setSuggestions] = useState<SuggestedProblem[]>([])

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
        // Only the identity of the source course matters, not every recents change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastCourseKey])

    useEffect(() => {
        setSuggestions(pool ? selectSuggestions(pool, mode) : [])
    }, [pool, mode])

    function reshuffle() {
        if (pool) {
            setSuggestions(selectSuggestions(pool, 'random'))
        }
    }

    return (
        <HomeWidgetCard
            title="Suggested problems"
            subtitle={pool ? `from ${pool.sourceLabel}` : undefined}
            accentClassName="border-t-emerald-500"
            icon={<SparklesIcon className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />}
            action={
                <div className="flex shrink-0 items-center gap-0.5">
                    {mode === 'random' ? (
                        <ReshuffleButton onReshuffle={reshuffle} disabled={!loaded || pool === null} />
                    ) : null}
                    <ModeMenu mode={mode} onSelect={setMode} disabled={!loaded} />
                </div>
            }
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
                          ? `You tried every problem in ${pool.sourceLabel}.`
                          : pool.problemNms.length === 0
                            ? `No problems in ${pool.sourceLabel}.`
                            : `You solved every problem in ${pool.sourceLabel}.`}
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
    const ModeIcon = SUGGESTION_MODE_ICONS[mode]

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
                                <span className="inline-flex items-center gap-1">
                                    <ModeIcon className="size-3.5" aria-hidden />
                                    {SUGGESTION_MODE_LABELS[mode]}
                                    <ChevronDownIcon aria-hidden />
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">{SUGGESTION_MODE_DESCRIPTIONS[mode]}</TooltipContent>
                </Tooltip>
                {/* The default content width tracks the tiny trigger button; give the descriptions room. */}
                <DropdownMenuContent align="end" className="w-72">
                    {SUGGESTION_MODES.map((option) => {
                        const OptionIcon = SUGGESTION_MODE_ICONS[option]
                        return (
                            <DropdownMenuItem key={option} onSelect={() => onSelect(option)}>
                                <OptionIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                                <span className="flex flex-col">
                                    <span className={option === mode ? 'font-semibold' : undefined}>
                                        {SUGGESTION_MODE_LABELS[option]}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {SUGGESTION_MODE_DESCRIPTIONS[option]}
                                    </span>
                                </span>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    )
}

/** Redraws the random picks, for when the shown ones do not appeal. */
function ReshuffleButton({ onReshuffle, disabled }: { onReshuffle: () => void; disabled: boolean }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={disabled}
                        onClick={onReshuffle}
                        aria-label="Show other random problems"
                        className="size-6 shrink-0 text-muted-foreground"
                    >
                        <RefreshCwIcon className="size-3.5" aria-hidden />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Show other random problems</TooltipContent>
            </Tooltip>
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
