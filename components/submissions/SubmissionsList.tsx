'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { useMemo } from 'react'

import { AgTableFull } from '@/components/administrator/AgTable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { SubmissionRow } from '@/lib/submissions'

dayjs.extend(relativeTime)

type SubmissionsListProps = {
    rows: SubmissionRow[]
}

export function SubmissionsList({ rows }: SubmissionsListProps) {
    const colDefs = useMemo(
        () => [
            {
                field: 'verdictEmoji',
                headerName: '',
                width: 48,
                sortable: false,
                filter: false,
                cellRenderer: (params: { data: SubmissionRow }) =>
                    params.data.verdictEmoji ? <span aria-hidden>{params.data.verdictEmoji}</span> : '—',
            },
            {
                field: 'problem_id',
                headerName: 'Problem',
                width: 112,
                sortable: true,
                filter: true,
                cellRenderer: (params: { data: SubmissionRow }) => {
                    const problemId = params.data.problem_id
                    const underscoreIndex = problemId.indexOf('_')
                    const mainPart = underscoreIndex === -1 ? problemId : problemId.slice(0, underscoreIndex)
                    const suffixPart = underscoreIndex === -1 ? null : ' ' + problemId.slice(underscoreIndex + 1)

                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={params.data.problemHref}
                                    className="text-sm hover:text-primary hover:underline"
                                >
                                    {mainPart}
                                    {suffixPart ? (
                                        <span className="text-xs text-muted-foreground">{suffixPart}</span>
                                    ) : null}
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top">{params.data.problemTitle}</TooltipContent>
                        </Tooltip>
                    )
                },
                valueGetter: (params: { data: SubmissionRow }) => params.data.problem_id,
            },
            {
                field: 'submission_id',
                headerName: 'Submission',
                width: 112,
                sortable: true,
                filter: true,
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
                cellRenderer: (params: { data: SubmissionRow }) => (
                    <span className="text-muted-foreground">{params.data.annotation ?? '—'}</span>
                ),
                valueGetter: (params: { data: SubmissionRow }) => params.data.annotation ?? '',
            },
        ],
        [],
    )

    return (
        <TooltipProvider>
            <AgTableFull rowData={rows} columnDefs={colDefs} />
        </TooltipProvider>
    )
}
