'use client'

import Link from 'next/link'
import { useMemo } from 'react'

import { AgTableAutoHeight } from '@/components/administrator/AgTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buildSubmissionTestcaseHref } from '@/lib/submissions'
import type { SubmissionAnalysisRow } from '@/services/queries/submissions'

type SubmissionAnalysisCardProps = {
    analysis: SubmissionAnalysisRow[]
    problemKey: string
    submissionId: string
}

export function SubmissionAnalysisCard({ analysis, problemKey, submissionId }: SubmissionAnalysisCardProps) {
    const colDefs = useMemo(
        () => [
            {
                field: 'testcase',
                headerName: 'Test case',
                width: 200,
                sortable: true,
                cellRenderer: (params: { data: SubmissionAnalysisRow }) => {
                    const href = buildSubmissionTestcaseHref(problemKey, submissionId, params.data.testcase)
                    return href ? (
                        <Link href={href} className="text-primary hover:underline">
                            {params.data.testcase}
                        </Link>
                    ) : (
                        params.data.testcase
                    )
                },
                valueGetter: (params: { data: SubmissionAnalysisRow }) => params.data.testcase,
            },
            {
                field: 'execution',
                headerName: 'Execution',
                width: 120,
                sortable: true,
                cellRenderer: (params: { data: SubmissionAnalysisRow }) => (
                    <span className="inline-flex items-center gap-2">
                        <span aria-hidden>{params.data.execution === 'OK' ? '✅' : '❌'}</span>
                        {params.data.execution}
                    </span>
                ),
                valueGetter: (params: { data: SubmissionAnalysisRow }) => params.data.execution,
            },
            {
                field: 'verdict',
                headerName: 'Verdict',
                flex: 1,
                sortable: true,
                cellRenderer: (params: { data: SubmissionAnalysisRow }) => (
                    <span className="inline-flex items-center gap-2">
                        {params.data.verdictEmoji ? <span aria-hidden>{params.data.verdictEmoji}</span> : null}
                        {params.data.verdict}
                    </span>
                ),
                valueGetter: (params: { data: SubmissionAnalysisRow }) => params.data.verdict,
            },
        ],
        [problemKey, submissionId],
    )

    return (
        <Card className="gap-0 pt-2 pb-0 ring-0 border border-border shadow-sm">
            <CardHeader className="border-b border-border px-4 py-2">
                <CardTitle className="text-lg font-semibold">Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <AgTableAutoHeight rowData={analysis} columnDefs={colDefs} rowHeight={36} wrapperBorder={false} />
            </CardContent>
        </Card>
    )
}
