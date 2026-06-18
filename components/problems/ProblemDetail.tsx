import Link from 'next/link'
import { FileArchive, FileText } from 'lucide-react'

import { ProblemTypeOption } from '@/components/problems/ProblemTypeIcon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

function languageName(languageId: string, data: ProblemDetailData): string {
    const language = data.languages[languageId]
    return language?.own_name ?? language?.eng_name ?? languageId
}

export function ProblemDetail({ pageKey, data }: ProblemDetailProps) {
    const { problem } = data

    return (
        <div className="flex flex-col gap-6">
            <Card className="ring-0 border border-border shadow-sm">
                <CardContent className="flex flex-col gap-2 pt-6 sm:flex-row sm:items-start sm:justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">{problem.title}</h1>
                    <p className="shrink-0 text-lg tabular-nums text-muted-foreground">{problem.problem_nm}</p>
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

            {data.publicTestcases.length > 0 ? (
                <Card className="ring-0 border border-border shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle>Public test cases</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 pt-6">
                        {data.publicTestcases.map((testcase) => (
                            <div key={testcase.name} className="grid gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm font-medium text-foreground">Input</p>
                                    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm text-foreground">
                                        {testcase.input}
                                    </pre>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm font-medium text-foreground">Output</p>
                                    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm text-foreground">
                                        {testcase.output}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ) : null}

            <Card size="sm" className="ring-0 border border-border shadow-sm">
                <CardHeader className="border-b pb-2">
                    <CardTitle>Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <dl className="flex flex-col gap-1.5">
                        <InfoRow label="Author">{problem.abstract_problem.author ?? '—'}</InfoRow>
                        <InfoRow label="Type">
                            {problem.abstract_problem.type ? (
                                <ProblemTypeOption type={problem.abstract_problem.type} />
                            ) : (
                                '—'
                            )}
                        </InfoRow>
                        <InfoRow label="Languages">
                            <div className="flex flex-wrap gap-1">
                                {data.languageVariants.map((variant) => {
                                    const isCurrent = variant.problem_id === problem.problem_id
                                    return (
                                        <Badge
                                            key={variant.problem_id}
                                            variant={isCurrent ? 'default' : 'outline'}
                                            asChild={!isCurrent}
                                            className={cn(!isCurrent && 'hover:bg-muted')}
                                        >
                                            {isCurrent ? (
                                                <span>{languageName(variant.language_id, data)}</span>
                                            ) : (
                                                <Link href={`/problems/${variant.problem_id}`}>
                                                    {languageName(variant.language_id, data)}
                                                </Link>
                                            )}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </InfoRow>
                        <InfoRow label="Official solutions">
                            {data.officialSolutions.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {data.officialSolutions.map((proglang) => (
                                        <Badge
                                            key={proglang}
                                            className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                        >
                                            {proglang}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                '—'
                            )}
                        </InfoRow>
                        <InfoRow label="User solutions">
                            {data.userSolutions.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {data.userSolutions.map((proglang) => (
                                        <Badge
                                            key={proglang}
                                            className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                        >
                                            {proglang}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                '—'
                            )}
                        </InfoRow>
                    </dl>
                </CardContent>
            </Card>
        </div>
    )
}
