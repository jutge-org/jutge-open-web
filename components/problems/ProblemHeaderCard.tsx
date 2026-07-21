import Link from 'next/link'
import { LanguagesIcon, SignatureIcon } from 'lucide-react'

import { ProblemIconImage } from '@/components/problems/ProblemIconImage'
import { ProblemStatusIcon } from '@/components/problems/ProblemStatusIcon'
import { ProblemSubmitButton } from '@/components/problems/ProblemSubmitButton'
import { ProblemTypeIcon } from '@/components/problems/ProblemTypeIcon'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { AbstractStatus } from '@/lib/jutge_api_client'
import { problemIconUrl } from '@/lib/problems'
import { supervisionProblemHref, type SupervisionContext } from '@/lib/supervision'
import { cn } from '@/lib/utils'
import type { ProblemDetailData } from '@/lib/data/problemDetail'

type ProblemHeaderCardProps = {
    data: ProblemDetailData
    status?: AbstractStatus | null
    defaultCompilerId?: string | null
    showActions?: boolean
    supervisionContext?: SupervisionContext
    /** Pull the card up into the sticky header, matching PageTitle. */
    overlapHeader?: boolean
}

export function ProblemHeaderCard({
    data,
    status,
    defaultCompilerId,
    showActions = false,
    supervisionContext,
    overlapHeader = true,
}: ProblemHeaderCardProps) {
    const { problem } = data
    const iconUrl = problemIconUrl(problem.abstract_problem.icon)

    return (
        <div
            className={cn(
                'flex min-h-22 items-center gap-5 rounded-2xl border border-border px-6 py-5 text-left shadow-sm',
                overlapHeader && '-mt-6',
            )}
        >
            <TooltipProvider>
                <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-5">
                        {iconUrl ? <ProblemIconImage iconUrl={iconUrl} size="lg" className="shrink-0" /> : null}
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <h1
                                className="mt-0 mb-0 flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
                                data-recent-problem-icon-url={iconUrl ?? undefined}
                            >
                                {showActions && status ? <ProblemStatusIcon status={status} /> : null}
                                {problem.title}
                            </h1>
                            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                {problem.abstract_problem.driver_id ? (
                                    <ProblemTypeIcon
                                        type={problem.abstract_problem.driver_id}
                                        className="size-3 shrink-0"
                                    />
                                ) : null}
                                {problem.problem_nm}
                                {data.languageVariants.map((variant) => {
                                    const isCurrent = variant.problem_id === problem.problem_id
                                    return (
                                        <Tooltip key={variant.problem_id}>
                                            <TooltipTrigger asChild>
                                                <Badge
                                                    variant={isCurrent ? 'default' : 'outline'}
                                                    asChild={!isCurrent}
                                                    className={cn(!isCurrent && 'hover:bg-muted')}
                                                >
                                                    {isCurrent ? (
                                                        <span>{variant.language_id}</span>
                                                    ) : (
                                                        <Link
                                                            href={
                                                                supervisionContext
                                                                    ? supervisionProblemHref(
                                                                          supervisionContext,
                                                                          variant.problem_id,
                                                                      )
                                                                    : `/problems/${variant.problem_id}`
                                                            }
                                                        >
                                                            {variant.language_id}
                                                        </Link>
                                                    )}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">{variant.title}</TooltipContent>
                                        </Tooltip>
                                    )
                                })}
                            </p>
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                <SignatureIcon className="size-3 shrink-0" aria-hidden />
                                {problem.abstract_problem.author}
                            </p>
                            {problem.translator && (
                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <LanguagesIcon className="size-3 shrink-0" aria-hidden />
                                    {problem.translator}
                                </p>
                            )}
                        </div>
                    </div>
                    {showActions ? (
                        <ProblemSubmitButton
                            problemId={problem.problem_id}
                            compilers={data.compilers}
                            defaultCompilerId={defaultCompilerId}
                        />
                    ) : null}
                </div>
            </TooltipProvider>
        </div>
    )
}
