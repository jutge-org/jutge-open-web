import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { buildSubmissionTestcaseHref } from '@/lib/submissions'
import type { SubmissionAnalysisRow } from '@/services/queries/submissions'

type SubmissionAnalysisCardProps = {
    analysis: SubmissionAnalysisRow[]
    problemKey: string
    submissionId: string
}

export function SubmissionAnalysisCard({ analysis, problemKey, submissionId }: SubmissionAnalysisCardProps) {
    return (
        <Card className="gap-0 pt-2 pb-0 ring-0 border border-border shadow-sm">
            <CardHeader className="border-b border-border px-4 py-2">
                <CardTitle className="text-lg font-semibold">Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="px-4">Test case</TableHead>
                            <TableHead className="px-4">Execution</TableHead>
                            <TableHead className="px-4">Verdict</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {analysis.map((row) => {
                            const href = buildSubmissionTestcaseHref(problemKey, submissionId, row.testcase)

                            return (
                                <TableRow key={row.testcase}>
                                    <TableCell className="px-4">
                                        {href ? (
                                            <Link href={href} className="text-primary hover:underline">
                                                {row.testcase}
                                            </Link>
                                        ) : (
                                            row.testcase
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4">
                                        <span className="inline-flex items-center gap-2">
                                            <span aria-hidden>{row.execution === 'OK' ? '✅' : '❌'}</span>
                                            {row.execution}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center gap-2">
                                                    {row.verdictEmoji ? (
                                                        <span aria-hidden>{row.verdictEmoji}</span>
                                                    ) : null}
                                                    <span>{row.verdict}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">{row.verdictFullName}</TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
