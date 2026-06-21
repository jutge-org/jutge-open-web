'use client'

import { useMemo, useState } from 'react'
import { GaugeIcon, SearchIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import Link from 'next/link'

import { AgTableFull } from '@/components/administrator/AgTable'
import { ProblemTypeIcon } from '@/components/problems/ProblemTypeIcon'
import { ProblemsListToolbar } from '@/components/problems/ProblemsListToolbar'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    DEFAULT_PROBLEMS_COLUMN_VISIBILITY,
    filterProblems,
    type ProblemsColumnField,
    type ProblemsColumnVisibility,
} from '@/lib/problems'
import type { AbstractStatus, Language } from '@/lib/jutge_api_client'
import type { ProblemRow } from '@/services/queries/problems'

type ProblemsListProps = {
    problems: ProblemRow[]
    languages: Record<string, Language>
    statuses?: Record<string, AbstractStatus>
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

export function ProblemsList({ problems, languages, statuses }: ProblemsListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [columnVisibility, setColumnVisibility] = useState<ProblemsColumnVisibility>(
        DEFAULT_PROBLEMS_COLUMN_VISIBILITY,
    )

    const visibleProblems = useMemo(() => filterProblems(problems, searchQuery), [problems, searchQuery])

    function handleColumnVisibilityChange(field: ProblemsColumnField, visible: boolean) {
        setColumnVisibility((current) => ({ ...current, [field]: visible }))
    }

    const colDefs = useMemo(
        () => [
            ...(statuses
                ? [
                      {
                          field: 'status',
                          headerName: 'Status',
                          width: 100,
                          sortable: true,
                          filter: true,
                          hide: !columnVisibility.status,
                          cellRenderer: (params: { data: ProblemRow }) => {
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
                          valueGetter: (params: { data: ProblemRow }) => statuses[params.data.problem_nm]?.status ?? '',
                      },
                  ]
                : []),
            {
                field: 'problem_nm',
                headerName: 'Problem',
                width: 112,
                sortable: true,
                filter: true,
                hide: !columnVisibility.problem_nm,
                cellRenderer: (params: { data: ProblemRow }) => (
                    <Link href={`/problems/${params.data.problem_nm}`} className="tabular-nums text-sm">
                        {params.data.problem_nm}
                    </Link>
                ),
                valueGetter: (params: { data: ProblemRow }) => params.data.problem_nm,
            },
            {
                field: 'title',
                flex: 1,
                sortable: true,
                filter: true,
                hide: !columnVisibility.title,
            },
            {
                field: 'author',
                headerName: 'Author',
                width: 170,
                sortable: true,
                filter: true,
                hide: !columnVisibility.author,
                valueGetter: (params: { data: ProblemRow }) => params.data.author ?? '',
                cellRenderer: (params: { data: ProblemRow }) => params.data.author ?? '—',
            },
            {
                field: 'language_ids',
                headerName: 'Languages',
                width: 200,
                sortable: true,
                filter: true,
                hide: !columnVisibility.language_ids,
                cellRenderer: (params: { data: ProblemRow }) => (
                    <div className="flex flex-wrap gap-1">
                        {params.data.language_ids.map((languageId) => (
                            <Tooltip key={languageId}>
                                <TooltipTrigger asChild>
                                    <Badge className="mt-2.5" variant="outline">
                                        {languageId}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    {languages[languageId]?.eng_name ?? languageId}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                ),
                valueGetter: (params: { data: ProblemRow }) => params.data.language_ids.join(', '),
            },
            {
                field: 'type',
                headerName: 'Type',
                width: 90,
                sortable: true,
                filter: true,
                hide: !columnVisibility.type,
                cellRenderer: (params: { data: ProblemRow }) =>
                    params.data.type ? (
                        <ProblemTypeIcon type={params.data.type} className="text-muted-foreground translate-y-1" />
                    ) : (
                        '—'
                    ),
                valueGetter: (params: { data: ProblemRow }) => params.data.type ?? '',
            },
        ],
        [columnVisibility, languages, statuses],
    )

    return (
        <div className="flex flex-col gap-4">
            <ProblemsListToolbar
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={handleColumnVisibilityChange}
                showStatusColumn={statuses !== undefined}
                visibleCount={visibleProblems.length}
                totalCount={problems.length}
            />

            {visibleProblems.length === 0 ? (
                <Empty className="border border-dashed border-border bg-muted/20 py-12">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <SearchIcon aria-hidden />
                        </EmptyMedia>
                        <EmptyTitle>No matching problems</EmptyTitle>
                        <EmptyDescription>Try a different search term or clear the search box.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <TooltipProvider>
                    <AgTableFull rowData={visibleProblems} columnDefs={colDefs} />
                </TooltipProvider>
            )}
        </div>
    )
}
