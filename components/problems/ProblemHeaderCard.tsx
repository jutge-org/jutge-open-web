import Link from 'next/link'
import { SignatureIcon } from 'lucide-react'

import { ProblemStatusIcon } from '@/components/problems/ProblemStatusIcon'
import { ProblemSubmitButton } from '@/components/problems/ProblemSubmitButton'
import { ProblemTypeIcon } from '@/components/problems/ProblemTypeIcon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { AbstractStatus } from '@/lib/jutge_api_client'
import { cn } from '@/lib/utils'
import type { ProblemDetailData } from '@/lib/data/problemDetail'

type ProblemHeaderCardProps = {
    data: ProblemDetailData
    status?: AbstractStatus | null
    defaultCompilerId?: string | null
    showActions?: boolean
}

export function ProblemHeaderCard({ data, status, defaultCompilerId, showActions = false }: ProblemHeaderCardProps) {
    const { problem } = data

    return (
        <Card className="ring-0 border border-border shadow-sm">
            <CardContent className="w-full">
                <TooltipProvider>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
                                {showActions && status ? <ProblemStatusIcon status={status} /> : null}
                                {problem.title}
                            </h1>
                            <p className="flex flex-wrap items-center gap-2 text-muted-foreground">
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
                            </p>
                            <p className="flex items-center gap-1 text-muted-foreground">
                                <SignatureIcon className="size-3 shrink-0" aria-hidden />
                                {problem.abstract_problem.author}
                            </p>
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
            </CardContent>
        </Card>
    )
}
