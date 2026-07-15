'use client'

import { BookmarkIcon, BotIcon, LanguagesIcon, ScrollIcon, ScrollTextIcon, SignatureIcon, TagsIcon } from 'lucide-react'
import { type ReactNode, useCallback, useRef, useState } from 'react'

import { ProblemIconImage } from '@/components/problems/ProblemIconImage'
import { fetchProblemAbstractProblem } from '@/lib/data/problemsActions'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { problemIconUrl } from '@/lib/problems'
import { getPreferredProblemVariant } from '@/lib/problemVariants'
import type { AbstractProblem, ProblemSummary, SolutionTags } from '@/lib/jutge_api_client'

const abstractProblemCache = new Map<string, AbstractProblem>()

type ProblemTitleSummaryTooltipProps = {
    problem_nm: string
    title: string
    preferredLanguageId: string | null
    children?: ReactNode
}

type ProblemSummaryTooltipBodyProps = {
    problem_nm: string
    title: string
    iconUrl: string | null
    author: string | null
    translator: string | null
    summary: ProblemSummary | null
    solution_tags: SolutionTags | null
}

function ProblemNmWithIcon({ problem_nm, iconUrl }: { problem_nm: string; iconUrl: string | null }) {
    return (
        <span className="flex shrink-0 items-center gap-1 tabular-nums">
            {iconUrl ? <ProblemIconImage iconUrl={iconUrl} size="xs" /> : null}
            {problem_nm}
        </span>
    )
}

function ProblemTitleRow({
    problem_nm,
    title,
    iconUrl,
}: {
    problem_nm: string
    title: string
    iconUrl: string | null
}) {
    return (
        <div className="flex w-full min-w-0 items-center justify-between gap-3 font-bold">
            <ProblemNmWithIcon problem_nm={problem_nm} iconUrl={iconUrl} />
            <span className="min-w-0 truncate">{title || 'Untitled problem'}</span>
        </div>
    )
}

function ProblemSummaryTooltipBody({
    problem_nm,
    title,
    iconUrl,
    author,
    translator,
    summary,
    solution_tags,
}: ProblemSummaryTooltipBodyProps) {
    return (
        <div className="flex w-full flex-col gap-1 text-sm p-2">
            <ProblemTitleRow problem_nm={problem_nm} title={title} iconUrl={iconUrl} />
            {author ? (
                <div className="flex w-full flex-row">
                    <div className="w-8 shrink-0">
                        <SignatureIcon className="mb-1 mr-1 inline-block" size={16} aria-hidden />
                    </div>
                    <div className="w-full">{author}</div>
                </div>
            ) : null}
            {translator ? (
                <div className="flex w-full flex-row">
                    <div className="w-8 shrink-0">
                        <LanguagesIcon className="mb-1 mr-1 inline-block" size={16} aria-hidden />
                    </div>
                    <div className="w-full">{translator}</div>
                </div>
            ) : null}
            {summary?.keywords ? (
                <div className="flex w-full flex-row">
                    <div className="w-8 shrink-0">
                        <TagsIcon className="mb-1 mr-1 inline-block" size={16} aria-hidden />
                    </div>
                    <div className="w-full">{summary.keywords.replaceAll(',', ', ')}</div>
                </div>
            ) : null}
            {summary?.summary_1s ? (
                <div className="flex w-full flex-row">
                    <div className="w-8 shrink-0">
                        <ScrollIcon className="mb-1 mr-1 inline-block" size={16} aria-hidden />
                    </div>
                    <div className="w-full">{summary.summary_1s}</div>
                </div>
            ) : null}
            {summary?.summary_1p ? (
                <div className="flex w-full flex-row">
                    <div className="w-8 shrink-0">
                        <ScrollTextIcon className="mb-1 mr-1 inline-block" size={16} aria-hidden />
                    </div>
                    <div className="w-full">{summary.summary_1p}</div>
                </div>
            ) : null}
            {solution_tags?.tags.trim() ? (
                <div className="flex w-full flex-row">
                    <div className="w-8 shrink-0">
                        <BookmarkIcon className="mb-1 mr-1 inline-block" size={16} aria-hidden />
                    </div>
                    <div className="w-full">{solution_tags.tags.replaceAll(',', ', ')}</div>
                </div>
            ) : null}
            <div className="mt-4 flex w-full flex-row items-center">
                <div className="flex-1"></div>
                <div className="text-xs">Keywords and summaries by JutgeAI</div>
                <BotIcon className="mb-0.5 ml-1 inline-block" size={14} aria-hidden />
            </div>
        </div>
    )
}

export function ProblemTitleSummaryTooltip({
    problem_nm,
    title,
    preferredLanguageId,
    children,
}: ProblemTitleSummaryTooltipProps) {
    const [abstractProblem, setAbstractProblem] = useState<AbstractProblem | null>(
        () => abstractProblemCache.get(problem_nm) ?? null,
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const fetchingRef = useRef(false)

    const loadProblem = useCallback(async () => {
        const cached = abstractProblemCache.get(problem_nm)
        if (cached) {
            setAbstractProblem(cached)
            return
        }
        if (fetchingRef.current) return

        fetchingRef.current = true
        setLoading(true)
        setError(false)
        try {
            const problem = await fetchProblemAbstractProblem(problem_nm)
            abstractProblemCache.set(problem_nm, problem)
            setAbstractProblem(problem)
        } catch {
            setError(true)
        } finally {
            setLoading(false)
            fetchingRef.current = false
        }
    }, [problem_nm])

    function handleOpenChange(open: boolean) {
        if (open) {
            void loadProblem()
        }
    }

    const variant = abstractProblem ? getPreferredProblemVariant(abstractProblem, preferredLanguageId) : null
    const iconUrl = abstractProblem ? problemIconUrl(abstractProblem.icon) : null

    return (
        <Tooltip onOpenChange={handleOpenChange}>
            <TooltipTrigger asChild>
                {children ?? <span className="cursor-default truncate">{title}</span>}
            </TooltipTrigger>
            <TooltipContent side="right" className="flex w-96 max-w-sm flex-col items-start px-3 py-2 text-left">
                {loading && !abstractProblem ? (
                    <span className="text-background/70">Loading…</span>
                ) : error ? (
                    <span className="text-background/70">Could not load problem details</span>
                ) : abstractProblem && variant ? (
                    <ProblemSummaryTooltipBody
                        problem_nm={problem_nm}
                        title={variant.title}
                        iconUrl={iconUrl}
                        author={abstractProblem.author}
                        translator={variant.translator}
                        summary={variant.summary}
                        solution_tags={abstractProblem.solution_tags}
                    />
                ) : (
                    <ProblemTitleRow problem_nm={problem_nm} title={title} iconUrl={iconUrl} />
                )}
            </TooltipContent>
        </Tooltip>
    )
}
