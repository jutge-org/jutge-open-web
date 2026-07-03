'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { fetchProblemSubmissionsRowsAction, fetchSubmissionsRowsAction } from '@/actions/submissions'
import { AgTableFull } from '@/components/administrator/AgTable'
import { ProblemIdLabel } from '@/components/problems/ProblemIdLabel'
import { SubmissionsListToolbar } from '@/components/submissions/SubmissionsListToolbar'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    DEFAULT_SUBMISSIONS_COLUMN_VISIBILITY,
    PENDING_SUBMISSION_REFRESH_INTERVAL_MS,
    PENDING_SUBMISSION_REFRESH_MAX_COUNT,
    type ProblemSubmissionRow,
    type SubmissionRow,
    type SubmissionsColumnField,
    type SubmissionsColumnVisibility,
    type SubmissionsVerdictFilter,
    buildProblemSubmissionSearchHaystack,
    filterSubmissions,
} from '@/lib/submissions'

dayjs.extend(relativeTime)

type SubmissionsListProps =
    | {
          rows: SubmissionRow[]
          variant?: 'default'
          showHelp?: boolean
      }
    | {
          rows: ProblemSubmissionRow[]
          variant: 'problem'
          problemNm: string
          showHelp?: boolean
      }

export function SubmissionsList(props: SubmissionsListProps) {
    const { rows: initialRows, variant = 'default', showHelp = false } = props
    const problemNm = props.variant === 'problem' ? props.problemNm : undefined
    const [rows, setRows] = useState(initialRows)
    const [searchQuery, setSearchQuery] = useState('')
    const [verdictFilter, setVerdictFilter] = useState<SubmissionsVerdictFilter>('all')
    const [columnVisibility, setColumnVisibility] = useState<SubmissionsColumnVisibility>(
        DEFAULT_SUBMISSIONS_COLUMN_VISIBILITY,
    )

    useEffect(() => {
        setRows(initialRows)
    }, [initialRows])

    const hasPending = rows.some((row) => row.verdict === 'Pending')

    useEffect(() => {
        if (!hasPending) return

        let refreshCount = 0
        const intervalId = window.setInterval(async () => {
            refreshCount += 1

            const nextRows =
                problemNm !== undefined
                    ? await fetchProblemSubmissionsRowsAction(problemNm)
                    : await fetchSubmissionsRowsAction()

            setRows(nextRows)

            if (
                refreshCount >= PENDING_SUBMISSION_REFRESH_MAX_COUNT ||
                !nextRows.some((row) => row.verdict === 'Pending')
            ) {
                window.clearInterval(intervalId)
            }
        }, PENDING_SUBMISSION_REFRESH_INTERVAL_MS)

        return () => window.clearInterval(intervalId)
    }, [hasPending, problemNm])

    const visibleRows = useMemo(() => {
        if (variant === 'problem') {
            return filterSubmissions(
                rows as ProblemSubmissionRow[],
                searchQuery,
                verdictFilter,
                buildProblemSubmissionSearchHaystack,
            )
        }

        return filterSubmissions(rows as SubmissionRow[], searchQuery, verdictFilter)
    }, [rows, searchQuery, verdictFilter, variant])

    function handleColumnVisibilityChange(field: SubmissionsColumnField, visible: boolean) {
        setColumnVisibility((current) => ({ ...current, [field]: visible }))
    }

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
            variant === 'problem'
                ? {
                      field: 'language_id',
                      headerName: 'Language',
                      width: 112,
                      sortable: true,
                      filter: true,
                      hide: !columnVisibility.language_id,
                      cellRenderer: (params: { data: ProblemSubmissionRow }) => (
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <Link
                                      href={params.data.languageHref}
                                      className="text-sm hover:text-primary hover:underline"
                                  >
                                      {params.data.language_id}
                                  </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top">{params.data.languageTitle}</TooltipContent>
                          </Tooltip>
                      ),
                      valueGetter: (params: { data: ProblemSubmissionRow }) => params.data.language_id,
                  }
                : {
                      field: 'problem_id',
                      headerName: 'Problem',
                      width: 112,
                      sortable: true,
                      filter: true,
                      hide: !columnVisibility.problem_id,
                      cellRenderer: (params: { data: SubmissionRow }) => (
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <Link
                                      href={params.data.problemHref}
                                      className="text-sm hover:text-primary hover:underline"
                                  >
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
                hide: !columnVisibility.submission_id,
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
                hide: !columnVisibility.verdict,
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
                hide: !columnVisibility.compiler_id,
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
                hide: !columnVisibility.time_inMs,
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
                hide: !columnVisibility.annotation,
                cellRenderer: (params: { data: SubmissionRow }) =>
                    params.data.annotation ? (
                        <span className="text-muted-foreground">{params.data.annotation}</span>
                    ) : null,
                valueGetter: (params: { data: SubmissionRow }) => params.data.annotation ?? '',
            },
        ],
        [columnVisibility, variant],
    )

    if (rows.length === 0) {
        return (
            <p className="w-full border p-12 text-sm text-muted-foreground text-center">
                {variant === 'problem'
                    ? 'You have not submitted any solution to this problem yet.'
                    : 'No submissions yet.'}
            </p>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <SubmissionsListToolbar
                variant={variant}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                verdictFilter={verdictFilter}
                onVerdictFilterChange={setVerdictFilter}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={handleColumnVisibilityChange}
                visibleCount={visibleRows.length}
                totalCount={rows.length}
                showHelp={showHelp}
            />

            {visibleRows.length === 0 ? (
                <Empty className="border border-dashed border-border bg-muted/20 py-12">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <SearchIcon aria-hidden />
                        </EmptyMedia>
                        <EmptyTitle>No matching submissions</EmptyTitle>
                        <EmptyDescription>
                            Try a different search term, adjust filters, or clear the search box.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <TooltipProvider>
                    <AgTableFull rowData={visibleRows} columnDefs={colDefs} />
                </TooltipProvider>
            )}
        </div>
    )
}
