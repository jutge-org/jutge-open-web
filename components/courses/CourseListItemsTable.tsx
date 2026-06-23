'use client'

import { useMemo } from 'react'
import { GaugeIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import Link from 'next/link'

import { AgTableAutoHeight } from '@/components/administrator/AgTable'
import { ProblemTypeIcon } from '@/components/problems/ProblemTypeIcon'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { LastSubmissionInfo } from '@/lib/submissions'
import type { AbstractStatus, Language } from '@/lib/jutge_api_client'
import type { CourseListItemRow } from '@/services/queries/lists'

type CourseListItemsTableProps = {
    items: CourseListItemRow[]
    languages: Record<string, Language>
    statuses?: Record<string, AbstractStatus>
    lastSubmissions?: Record<string, LastSubmissionInfo>
}

const statusTooltipFields = [
    { key: 'status' as const, label: 'Status', always: true },
    { key: 'nb_submissions' as const, label: 'Submissions' },
    { key: 'nb_pending_submissions' as const, label: 'Pending submissions' },
    { key: 'nb_accepted_submissions' as const, label: 'Accepted submissions' },
    { key: 'nb_rejected_submissions' as const, label: 'Rejected submissions' },
    { key: 'nb_scored_submissions' as const, label: 'Scored submissions' },
]

function formatStatusTooltipValue(key: (typeof statusTooltipFields)[number]['key'], value: string | number): string {
    if (key === 'status' && typeof value === 'string') {
        return value.charAt(0).toUpperCase() + value.slice(1)
    }

    return String(value)
}

function ProblemStatusTooltipContent({ data }: { data: AbstractStatus }) {
    const entries = statusTooltipFields.filter(({ key, always }) => {
        if (always) return true
        return data[key] !== 0
    })

    return (
        <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-left">
            {entries.map(({ key, label }) => (
                <div key={key} className="contents">
                    <dt className="text-background/70">{label}</dt>
                    <dd className="font-medium tabular-nums">{formatStatusTooltipValue(key, data[key])}</dd>
                </div>
            ))}
        </dl>
    )
}

function ProblemStatusIcon({ data }: { data: AbstractStatus }) {
    const { status } = data
    let Icon = ThumbsDownIcon
    let iconClassName = 'text-red-600 dark:text-red-400'

    if (status === 'accepted') {
        Icon = ThumbsUpIcon
        iconClassName = 'text-emerald-600 dark:text-emerald-400'
    } else if (status === 'scored') {
        Icon = GaugeIcon
        iconClassName = 'text-orange-600 dark:text-orange-400'
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex cursor-default items-center">
                    <Icon className={`size-4 shrink-0 translate-y-1 ${iconClassName}`} />
                </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col items-start px-3 py-2">
                <ProblemStatusTooltipContent data={data} />
            </TooltipContent>
        </Tooltip>
    )
}

function isProblemRow(row: CourseListItemRow): row is Extract<CourseListItemRow, { kind: 'problem' }> {
    return row.kind === 'problem'
}

const ROW_HEIGHT = 36

export function CourseListItemsTable({ items, languages, statuses, lastSubmissions }: CourseListItemsTableProps) {
    const colDefs = useMemo(
        () => [
            ...(statuses
                ? [
                      {
                          field: 'status',
                          headerName: 'Status',
                          width: 100,
                          sortable: false,
                          filter: false,
                          cellRenderer: (params: { data: CourseListItemRow }) => {
                              if (!isProblemRow(params.data)) return ''
                              const data = statuses[params.data.problem_nm]
                              if (
                                  data?.status === 'accepted' ||
                                  data?.status === 'rejected' ||
                                  data?.status === 'scored'
                              ) {
                                  return <ProblemStatusIcon data={data} />
                              }
                              return ''
                          },
                      },
                  ]
                : []),
            {
                field: 'problem_nm',
                headerName: 'Problem',
                width: 112,
                sortable: false,
                filter: false,
                cellRenderer: (params: { data: CourseListItemRow }) => {
                    if (!isProblemRow(params.data)) return ''
                    return (
                        <Link href={`/problems/${params.data.problem_nm}`} className="tabular-nums text-sm">
                            {params.data.problem_nm}
                        </Link>
                    )
                },
            },
            {
                field: 'title',
                flex: 1,
                sortable: false,
                filter: false,
                cellRenderer: (params: { data: CourseListItemRow }) => {
                    if (!isProblemRow(params.data)) {
                        return <span className="text-muted-foreground">{params.data.description}</span>
                    }
                    return params.data.title
                },
            },
            ...(lastSubmissions
                ? [
                      {
                          field: 'last_submission_id',
                          headerName: 'Last sub',
                          width: 112,
                          sortable: false,
                          filter: false,
                          cellRenderer: (params: { data: CourseListItemRow }) => {
                              if (!isProblemRow(params.data)) return ''
                              const submission = lastSubmissions[params.data.problem_nm]
                              if (!submission) return ''
                              return (
                                  <Link
                                      href={submission.submissionHref}
                                      className="text-sm hover:text-primary hover:underline"
                                  >
                                      {submission.submission_id}
                                  </Link>
                              )
                          },
                      },
                  ]
                : []),
            {
                field: 'language_ids',
                headerName: 'Languages',
                width: 200,
                sortable: false,
                filter: false,
                cellStyle: { display: 'flex', alignItems: 'center' },
                cellRenderer: (params: { data: CourseListItemRow }) => {
                    if (!isProblemRow(params.data)) return ''
                    return (
                        <div className="flex flex-wrap items-center gap-1">
                            {params.data.language_ids.map((languageId) => (
                                <Tooltip key={languageId}>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline">{languageId}</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        {languages[languageId]?.eng_name ?? languageId}
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    )
                },
                valueGetter: (params: { data: CourseListItemRow }) =>
                    isProblemRow(params.data) ? params.data.language_ids.join(', ') : '',
            },
            {
                field: 'type',
                headerName: 'Type',
                width: 90,
                sortable: false,
                filter: false,
                cellRenderer: (params: { data: CourseListItemRow }) => {
                    if (!isProblemRow(params.data)) return ''
                    return params.data.type ? (
                        <ProblemTypeIcon type={params.data.type} className="translate-y-1 text-muted-foreground" />
                    ) : (
                        '—'
                    )
                },
            },
        ],
        [languages, lastSubmissions, statuses],
    )

    return (
        <TooltipProvider>
            <AgTableAutoHeight
                rowData={items}
                columnDefs={colDefs}
                rowHeight={ROW_HEIGHT}
                wrapperBorder={false}
                themeParams={{
                    backgroundColor: 'var(--card)',
                    oddRowBackgroundColor: 'var(--card)',
                    chromeBackgroundColor: 'var(--card)',
                }}
                getRowClass={(params: { data?: CourseListItemRow }) =>
                    params.data?.kind === 'separator' ? 'bg-muted/30' : undefined
                }
            />
        </TooltipProvider>
    )
}
