'use client'

import { useMemo } from 'react'

import { AgTableFull } from '@/components/administrator/AgTable'
import { ProblemTypeIcon } from '@/components/problems/ProblemTypeIcon'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Language } from '@/lib/jutge_api_client'
import type { ProblemRow } from '@/services/queries/problems'
import Link from 'next/link'

type ProblemsListProps = {
    problems: ProblemRow[]
    languages: Record<string, Language>
}

export function ProblemsList({ problems, languages }: ProblemsListProps) {
    const colDefs = useMemo(
        () => [
            {
                field: 'problem_nm',
                headerName: 'Problem',
                width: 112,
                sortable: true,
                filter: true,
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
            },
            {
                field: 'language_ids',
                headerName: 'Languages',
                width: 192,
                sortable: true,
                filter: true,
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
                width: 96,
                sortable: true,
                filter: true,
                cellRenderer: (params: { data: ProblemRow }) =>
                    params.data.type ? (
                        <ProblemTypeIcon type={params.data.type} className="text-muted-foreground translate-y-1" />
                    ) : (
                        '—'
                    ),
                valueGetter: (params: { data: ProblemRow }) => params.data.type ?? '',
            },
        ],
        [languages],
    )

    return (
        <TooltipProvider>
            <AgTableFull rowData={problems} columnDefs={colDefs} />
        </TooltipProvider>
    )
}
