import Link from 'next/link'
import type { ReactNode } from 'react'

import { DevIcon } from '@/components/administrator/DevIcon'
import { ProblemTypeOption } from '@/components/problems/ProblemTypeIcon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { ProblemDetailData } from '@/lib/data/problemDetail'

type ProblemInformationProps = {
    data: ProblemDetailData
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:items-center sm:gap-3">
            <dt className="text-sm font-medium text-foreground sm:text-right">{label}</dt>
            <dd className="text-sm text-muted-foreground">{children}</dd>
        </div>
    )
}

function formatProglangName(proglang: string) {
    return proglang.replace(/_/g, ' ')
}

function ProglangIcons({ proglangs }: { proglangs: string[] }) {
    return (
        <TooltipProvider>
            <div className="flex flex-wrap gap-1.5">
                {proglangs.map((proglang) => (
                    <Tooltip key={proglang}>
                        <TooltipTrigger asChild>
                            <span className="inline-flex cursor-default">
                                <Badge variant="outline" className="border-border bg-white p-1">
                                    <DevIcon proglang={proglang} size={16} />
                                </Badge>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side="top">{formatProglangName(proglang)}</TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    )
}

export function ProblemInformation({ data }: ProblemInformationProps) {
    const { problem } = data

    return (
        <Card size="sm" className="ring-0 border border-border shadow-sm">
            <CardHeader className="border-b pb-2">
                <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
                <dl className="flex flex-col gap-1.5">
                    <InfoRow label="Author">
                        {problem.abstract_problem.author ? (
                            <span className="inline-flex items-center gap-1">{problem.abstract_problem.author}</span>
                        ) : (
                            '—'
                        )}
                    </InfoRow>
                    {problem.translator ? (
                        <InfoRow label="Translator">
                            <span className="inline-flex items-center gap-1">{problem.translator}</span>
                        </InfoRow>
                    ) : null}
                    <InfoRow label="Type">
                        {problem.abstract_problem.driver_id ? (
                            <ProblemTypeOption type={problem.abstract_problem.driver_id} />
                        ) : (
                            '—'
                        )}
                    </InfoRow>
                    <InfoRow label="Languages">
                        <TooltipProvider>
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
                                            <TooltipContent side="left">{variant.title}</TooltipContent>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        </TooltipProvider>
                    </InfoRow>
                    <InfoRow label="Official solutions">
                        {data.officialSolutions.length > 0 ? <ProglangIcons proglangs={data.officialSolutions} /> : '—'}
                    </InfoRow>
                    {data.brokenOfficialSolutions.length > 0 ? (
                        <InfoRow label="Broken official solutions">
                            <ProglangIcons proglangs={data.brokenOfficialSolutions} />
                        </InfoRow>
                    ) : null}
                    <InfoRow label="User solutions">
                        {data.userSolutions.length > 0 ? <ProglangIcons proglangs={data.userSolutions} /> : '—'}
                    </InfoRow>
                </dl>
            </CardContent>
        </Card>
    )
}
