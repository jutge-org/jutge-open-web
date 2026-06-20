import { ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from 'lucide-react'
import Link from 'next/link'

import { ProblemIdLabel } from '@/components/problems/ProblemIdLabel'
import { SubmissionCodeMetricsCard } from '@/components/submissions/SubmissionCodeMetricsCard'
import { SubmissionSourceCodeCard } from '@/components/submissions/SubmissionSourceCodeCard'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { SubmissionNavLinks } from '@/lib/submissions'
import { cn } from '@/lib/utils'
import type { SubmissionDetailData } from '@/services/queries/submissions'
import type { ReactNode } from 'react'

type SubmissionDetailViewProps = {
    data: SubmissionDetailData
    codeHref: string
    navigation?: SubmissionNavLinks | null
}

function SubmissionNavButton({
    href,
    label,
    children,
}: {
    href: string | null
    label: string
    children: ReactNode
}) {
    if (href) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon-sm" asChild>
                        <Link href={href} aria-label={label}>
                            {children}
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{label}</TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" size="icon-sm" disabled aria-label={label}>
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="top">{label}</TooltipContent>
        </Tooltip>
    )
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-foreground">{label}</dt>
            <dd className="text-sm text-muted-foreground">{children}</dd>
        </div>
    )
}

export function SubmissionDetailView({ data, codeHref, navigation }: SubmissionDetailViewProps) {
    const { submission } = data
    const isPending = submission.state !== 'done'

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-6">
                <Card className="ring-0 border border-border shadow-sm">
                    <CardHeader className="border-b border-border">
                        <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                            {data.verdictEmoji ? (
                                <span
                                    aria-hidden
                                    className={cn('text-2xl', isPending && 'animate-pulse')}
                                >
                                    {data.verdictEmoji}
                                </span>
                            ) : null}
                            <span>{data.submission.submission_id}</span>
                        </CardTitle>
                        {navigation ? (
                            <CardAction>
                                <ButtonGroup>
                                    <SubmissionNavButton href={navigation.previousHref} label="Previous submission">
                                        <ChevronLeftIcon />
                                    </SubmissionNavButton>
                                    <SubmissionNavButton href={navigation.nextHref} label="Next submission">
                                        <ChevronRightIcon />
                                    </SubmissionNavButton>
                                    <SubmissionNavButton href={navigation.lastHref} label="Last submission">
                                        <ChevronsRightIcon />
                                    </SubmissionNavButton>
                                </ButtonGroup>
                            </CardAction>
                        ) : null}
                    </CardHeader>
                    <CardContent className="px-6 py-2">
                        <dl>
                            <DetailRow label="Problem">
                                <Link
                                    href={`/problems/${submission.problem_id}`}
                                    className="text-primary hover:underline"
                                >
                                    <ProblemIdLabel problemId={submission.problem_id} />
                                </Link>
                                <span className="text-muted-foreground"> — {data.problemTitle}</span>
                            </DetailRow>
                            <DetailRow label="Verdict">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className={cn(isPending && 'animate-pulse')}>{data.verdict}</span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">{data.verdictFullName}</TooltipContent>
                                </Tooltip>
                            </DetailRow>
                            <DetailRow label="Compiler">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>{submission.compiler_id}</span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">{data.compilerFullName}</TooltipContent>
                                </Tooltip>
                            </DetailRow>
                            <DetailRow label="Submitted">{data.time_in}</DetailRow>
                            <DetailRow label="State">{submission.state}</DetailRow>
                            {submission.annotation ? (
                                <DetailRow label="Annotation">{submission.annotation}</DetailRow>
                            ) : null}
                            {submission.veredict_info ? (
                                <DetailRow label="Verdict info">{submission.veredict_info}</DetailRow>
                            ) : null}
                            {submission.veredict_publics ? (
                                <DetailRow label="Public testcases">{submission.veredict_publics}</DetailRow>
                            ) : null}
                            {submission.ok_publics_but_wrong > 0 ? (
                                <DetailRow label="Public failures">
                                    {submission.ok_publics_but_wrong} public test case
                                    {submission.ok_publics_but_wrong === 1 ? '' : 's'} failed
                                </DetailRow>
                            ) : null}
                        </dl>
                    </CardContent>
                </Card>

                {data.code && data.codeFilename ? (
                    <>
                        <SubmissionSourceCodeCard
                            code={data.code}
                            codeExtension={data.codeExtension}
                            codeFilename={data.codeFilename}
                            codeHref={codeHref}
                        />
                    </>
                ) : null}

                {data.codeMetrics ? <SubmissionCodeMetricsCard data={data.codeMetrics} /> : null}

                {data.analysis.length > 0 ? (
                    <Card className="ring-0 border border-border shadow-sm">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="text-lg font-semibold">Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Test case</TableHead>
                                        <TableHead>Execution</TableHead>
                                        <TableHead>Verdict</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.analysis.map((row) => (
                                        <TableRow key={row.testcase}>
                                            <TableCell>{row.testcase}</TableCell>
                                            <TableCell>{row.execution}</TableCell>
                                            <TableCell>{row.verdict}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : null}
            </div>
        </TooltipProvider>
    )
}
