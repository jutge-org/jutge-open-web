import Link from 'next/link'
import { SignatureIcon } from 'lucide-react'

import { GameProblemCompetitionsCard } from '@/components/problems/GameProblemCompetitionsCard'
import { ProblemInformation } from '@/components/problems/ProblemInformation'
import { ProblemStatement } from '@/components/problems/ProblemStatement'
import { ProblemStatus } from '@/components/problems/ProblemStatus'
import { PublicTestcases } from '@/components/problems/PublicTestcases'
import { ProblemTypeIcon } from '@/components/problems/ProblemTypeIcon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { isGameProblem } from '@/lib/problems'
import { cn } from '@/lib/utils'
import type { AbstractStatus } from '@/lib/jutge_api_client'
import type { ProblemDetailData } from '@/services/queries/problemDetail'

import type { ReactNode } from 'react'

type ProblemDetailProps = {
    pageKey: string
    data: ProblemDetailData
    /** Present for authenticated users (may be null if the status request failed). */
    status?: AbstractStatus | null
    defaultCompilerId?: string | null
    showStatement?: boolean
    showTestcases?: boolean
    showInformation?: boolean
    children?: ReactNode
}

export function ProblemDetail({
    pageKey,
    data,
    status,
    defaultCompilerId,
    showStatement = true,
    showTestcases = true,
    showInformation = true,
    children,
}: ProblemDetailProps) {
    const { problem } = data
    const isGame = isGameProblem(problem.abstract_problem.type)
    const showStatus = status !== undefined && !isGame

    return (
        <div className="flex flex-col gap-6">
            {isGame ? <GameProblemCompetitionsCard /> : null}

            <Card className="ring-0 border border-border shadow-sm">
                <CardContent className="w-full flex flex-col gap-0.5">
                    <TooltipProvider>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
                                {problem.title}
                            </h1>
                            <p className="shrink-0 text-lg text-muted-foreground">
                                {problem.abstract_problem.type ? (
                                    <ProblemTypeIcon
                                        type={problem.abstract_problem.type}
                                        className="size-4 text-muted-foreground mr-2"
                                    />
                                ) : null}
                                {problem.problem_nm}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <h2 className="flex gap-1 items-center text-muted-foreground">
                                <SignatureIcon className="size-3 shrink-0" aria-hidden />
                                {problem.abstract_problem.author}
                            </h2>
                            <div className="flex flex-wrap gap-1">
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
                                                        <Link href={`/problems/${variant.problem_id}`}>
                                                            {variant.language_id}
                                                        </Link>
                                                    )}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">{variant.title}</TooltipContent>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        </div>
                    </TooltipProvider>
                </CardContent>
                {showStatus ? (
                    <ProblemStatus
                        status={
                            status ?? {
                                problem_nm: problem.problem_nm,
                                status: '',
                                nb_submissions: 0,
                                nb_pending_submissions: 0,
                                nb_accepted_submissions: 0,
                                nb_rejected_submissions: 0,
                                nb_scored_submissions: 0,
                            }
                        }
                        problemId={problem.problem_id}
                        compilers={data.compilers}
                        defaultCompilerId={defaultCompilerId}
                    />
                ) : null}
            </Card>

            {children}

            {showStatement ? <ProblemStatement pageKey={pageKey} shortHtmlStatement={data.shortHtmlStatement} /> : null}

            {showTestcases && data.publicTestcases.length > 0 ? (
                <PublicTestcases testcases={data.publicTestcases} />
            ) : null}

            {showInformation ? <ProblemInformation data={data} /> : null}
        </div>
    )
}
