import Link from 'next/link'
import { FileArchive, FileText, SignatureIcon } from 'lucide-react'

import { DevIcon } from '@/components/administrator/DevIcon'
import { PublicTestcases } from '@/components/problems/PublicTestcases'
import { ProblemTypeOption } from '@/components/problems/ProblemTypeIcon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { ProblemDetailData } from '@/services/queries/problemDetail'
import type { ReactNode } from 'react'

type ProblemDetailProps = {
    pageKey: string
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

function ProglangBadges({ proglangs }: { proglangs: string[] }) {
    return (
        <div className="flex flex-wrap gap-1">
            {proglangs.map((proglang) => (
                <Badge
                    key={proglang}
                    className="gap-1.5 border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                >
                    <DevIcon proglang={proglang} size={14} />
                    {proglang.replace(/_/g, ' ')}
                </Badge>
            ))}
        </div>
    )
}

export function ProblemDetail({ pageKey, data }: ProblemDetailProps) {
    const { problem } = data

    return (
        <div className="flex flex-col gap-6">
            <Card className="ring-0 border border-border shadow-sm">
                <CardContent className="w-full flex flex-col gap-0.5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{problem.title}</h1>
                        <p className="shrink-0 text-lg tabular-nums text-muted-foreground">{problem.problem_nm}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <h2 className="flex gap-1 items-center text-muted-foreground">
                            <SignatureIcon className="size-3 shrink-0" aria-hidden />
                            {problem.abstract_problem.author}
                        </h2>
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
                                            <TooltipContent side="bottom">
                                                {data.languages[variant.language_id]?.eng_name ?? variant.language_id}
                                            </TooltipContent>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        </TooltipProvider>
                    </div>
                </CardContent>
            </Card>

            <Card className="ring-0 border border-border shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle>Statement</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 pt-6">
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={`/problems/${pageKey}/pdf`}
                            className="inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 px-5 py-4 transition-colors hover:bg-muted"
                        >
                            <FileText className="size-10 text-red-600 dark:text-red-400" aria-hidden />
                            <span className="text-sm font-medium text-foreground">PDF</span>
                        </Link>
                        <Link
                            href={`/problems/${pageKey}/zip`}
                            className="inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 px-5 py-4 transition-colors hover:bg-muted"
                        >
                            <FileArchive className="size-10 text-amber-600 dark:text-amber-400" aria-hidden />
                            <span className="text-sm font-medium text-foreground">ZIP</span>
                        </Link>
                    </div>
                    <div
                        className="statement-section text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: data.shortHtmlStatement }}
                    />
                </CardContent>
            </Card>

            {data.publicTestcases.length > 0 ? <PublicTestcases testcases={data.publicTestcases} /> : null}

            <Card size="sm" className="ring-0 border border-border shadow-sm">
                <CardHeader className="border-b pb-2">
                    <CardTitle>Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <dl className="flex flex-col gap-1.5">
                        <InfoRow label="Author">
                            {problem.abstract_problem.author ? (
                                <span className="inline-flex items-center gap-1">
                                    {problem.abstract_problem.author}
                                </span>
                            ) : (
                                '—'
                            )}
                        </InfoRow>
                        <InfoRow label="Type">
                            {problem.abstract_problem.type ? (
                                <ProblemTypeOption type={problem.abstract_problem.type} />
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
                                                <TooltipContent side="left">
                                                    {data.languages[variant.language_id]?.eng_name ??
                                                        variant.language_id}
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    })}
                                </div>
                            </TooltipProvider>
                        </InfoRow>
                        <InfoRow label="Official solutions">
                            {data.officialSolutions.length > 0 ? (
                                <ProglangBadges proglangs={data.officialSolutions} />
                            ) : (
                                '—'
                            )}
                        </InfoRow>
                        <InfoRow label="User solutions">
                            {data.userSolutions.length > 0 ? <ProglangBadges proglangs={data.userSolutions} /> : '—'}
                        </InfoRow>
                    </dl>
                </CardContent>
            </Card>
        </div>
    )
}
