'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useMemo } from 'react'
import Link from 'next/link'

import { AgTableAutoHeight } from '@/components/administrator/AgTable'
import { ProblemIdLabel } from '@/components/problems/ProblemIdLabel'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { SubmissionRow } from '@/lib/submissions'

dayjs.extend(relativeTime)

type ExamSubmissionsTableProps = {
    submissions: SubmissionRow[]
}

const ROW_HEIGHT = 36

export function ExamSubmissionsTable({ submissions }: ExamSubmissionsTableProps) {
    const colDefs = useMemo(
        () => [
            {
                field: 'verdictEmoji',
                headerName: '',
                width: 48,
                sortable: false,
                filter: false,
                cellRenderer: (params: { data: SubmissionRow }) =>
                    params.data.verdictEmoji ? (
                        <span aria-hidden className={params.data.verdict === 'Pending' ? 'animate-pulse' : undefined}>
                            {params.data.verdictEmoji}
                        </span>
                    ) : (
                        '—'
                    ),
            },
            {
                field: 'problem_id',
                headerName: 'Problem',
                width: 112,
                sortable: true,
                filter: true,
                cellRenderer: (params: { data: SubmissionRow }) => (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={params.data.problemHref} className="text-sm hover:text-primary hover:underline">
                                <ProblemIdLabel problemId={params.data.problem_id} />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top">{params.data.problemTitle}</TooltipContent>
                    </Tooltip>
                ),
                valueGetter: (params: { data: SubmissionRow }) => params.data.problem_id,
            },
            {
                field: 'submission_id',
                headerName: 'Submission',
                width: 112,
                sortable: true,
                filter: true,
                cellRenderer: (params: { data: SubmissionRow }) => (
                    <Link href={params.data.submissionHref} className="text-sm hover:text-primary hover:underline">
                        {params.data.submission_id}
                    </Link>
                ),
            },
            {
                field: 'verdict',
                headerName: 'Verdict',
                width: 96,
                sortable: true,
                filter: true,
                cellRenderer: (params: { data: SubmissionRow }) => (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>{params.data.verdict}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top">{params.data.verdictFullName}</TooltipContent>
                    </Tooltip>
                ),
                valueGetter: (params: { data: SubmissionRow }) => params.data.verdict,
            },
            {
                field: 'compiler_id',
                headerName: 'Compiler',
                width: 112,
                sortable: true,
                filter: true,
                cellRenderer: (params: { data: SubmissionRow }) => (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>{params.data.compiler_id}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top">{params.data.compilerFullName}</TooltipContent>
                    </Tooltip>
                ),
                valueGetter: (params: { data: SubmissionRow }) => params.data.compiler_id,
            },
            {
                field: 'time_inMs',
                headerName: 'Time',
                width: 176,
                sortable: true,
                filter: true,
                sort: 'desc',
                cellRenderer: (params: { data: SubmissionRow }) => (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>{dayjs(params.data.time_inMs).fromNow()}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top">{params.data.time_in}</TooltipContent>
                    </Tooltip>
                ),
                valueGetter: (params: { data: SubmissionRow }) => params.data.time_inMs,
            },
            {
                field: 'annotation',
                headerName: 'Annotation',
                flex: 1,
                sortable: true,
                filter: true,
                cellRenderer: (params: { data: SubmissionRow }) =>
                    params.data.annotation ? (
                        <span className="text-muted-foreground">{params.data.annotation}</span>
                    ) : null,
                valueGetter: (params: { data: SubmissionRow }) => params.data.annotation ?? '',
            },
        ],
        [],
    )

    return (
        <TooltipProvider>
            <AgTableAutoHeight
                rowData={submissions}
                columnDefs={colDefs}
                domLayout="autoHeight"
                rowHeight={ROW_HEIGHT}
                headerHeight={ROW_HEIGHT}
                wrapperBorder={false}
                themeParams={{
                    backgroundColor: 'var(--card)',
                    oddRowBackgroundColor: 'var(--card)',
                    chromeBackgroundColor: 'var(--card)',
                }}
            />
        </TooltipProvider>
    )
}
