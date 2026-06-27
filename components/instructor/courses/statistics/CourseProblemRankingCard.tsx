'use client'

import { AgTable } from '@/components/administrator/AgTable'
import { ExternalLink } from '@/components/ExternalLink'
import { CardContent, CardHeader, CardTitle, ResizableCard } from '@/components/ResizableCard'
import { deriveCourseProblemRanking } from '@/lib/instructor/courseProblemRanking'
import type { Dict } from '@/lib/instructor/utils'
import type {
    AbstractProblem,
    CourseSubmission,
    InstructorCourse,
    InstructorList,
} from '@/lib/jutge_api_client'
import type { ICellRendererParams } from 'ag-grid-community'
import { useMemo } from 'react'

type CourseProblemRankingCardProps = {
    course: InstructorCourse
    lists: InstructorList[]
    submissions: CourseSubmission[]
    abstractProblems: Dict<AbstractProblem>
}

export function CourseProblemRankingCard({
    course,
    lists,
    submissions,
    abstractProblems,
}: CourseProblemRankingCardProps) {
    const colDefs = useMemo(
        () => [
            {
                field: 'problem_nm',
                headerName: 'Id',
                width: 120,
                filter: true,
                cellRenderer: (params: ICellRendererParams<{ problem_nm: string }>) => (
                    <ExternalLink
                        href={`https://jutge.org/problems/${params.data!.problem_nm}`}
                        className="text-primary"
                    >
                        {params.data!.problem_nm}
                    </ExternalLink>
                ),
            },
            {
                field: 'title',
                flex: 2,
                filter: true,
            },
            {
                field: 'ok',
                headerName: '#OK',
                width: 120,
                filter: false,
                type: 'rightAligned',
            },
            {
                field: 'ko',
                headerName: '#KO',
                width: 120,
                filter: false,
                type: 'rightAligned',
            },
            {
                field: 'sc',
                headerName: '#SC',
                width: 120,
                filter: false,
                type: 'rightAligned',
            },
            {
                field: 'nt',
                headerName: '#NT',
                width: 120,
                filter: false,
                type: 'rightAligned',
            },
            {
                field: 'totalSubmissions',
                headerName: '#Sub',
                width: 120,
                filter: false,
                type: 'rightAligned',
            },
            {
                field: 'avgSubmissionsPerStudent',
                headerName: 'Avg #Sub/std',
                width: 180,
                filter: false,
                type: 'rightAligned',
                valueFormatter: (params: { value: number }) =>
                    Number.isFinite(params.value) ? params.value.toFixed(1) : '',
            },
        ],
        [],
    )

    const rows = useMemo(
        () => deriveCourseProblemRanking(course, lists, submissions, abstractProblems),
        [course, lists, submissions, abstractProblems],
    )

    return (
        <ResizableCard className="w-full" defaultHeight={480}>
            <CardHeader className="p-4">
                <CardTitle>Problems</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col px-4 pb-4">
                {rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No problems to display.</p>
                ) : (
                    <div className="min-h-0 w-full flex-1">
                        <AgTable
                            rowData={rows}
                            columnDefs={colDefs}
                            rowHeight={36}
                            wrapperBorder={false}
                            themeParams={{
                                backgroundColor: 'var(--card)',
                                oddRowBackgroundColor: 'var(--card)',
                                chromeBackgroundColor: 'var(--card)',
                            }}
                        />
                    </div>
                )}
            </CardContent>
        </ResizableCard>
    )
}
