'use client'

import { array2csv } from '@/actions/instructor/csv'
import { AgTable } from '@/components/administrator/AgTable'
import { SaveFileIconButton } from '@/components/instructor/statistics/SaveFileIconButton'
import { CardAction, CardContent, CardHeader, CardTitle, ResizableCard } from '@/components/ResizableCard'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { emailRenderer } from '@/lib/administrator/grid-renderers'
import { deriveCourseStudentRanking } from '@/lib/instructor/courseStudentRanking'
import type { Dict } from '@/lib/instructor/utils'
import { saveFileWithDialog } from '@/lib/saveFileWithDialog'
import type { CourseSubmission, InstructorCourse, InstructorList, StudentProfile } from '@/lib/jutge_api_client'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

type CourseStudentRankingCardProps = {
    course: InstructorCourse
    profiles: Dict<StudentProfile>
    lists: InstructorList[]
    submissions: CourseSubmission[]
}

const PRIVACY_CELL_STYLE = { filter: 'blur(4px)', userSelect: 'none' } as const
const CLEAR_PRIVACY_CELL_STYLE = { filter: 'none', userSelect: 'text' } as const

export function CourseStudentRankingCard({ course, profiles, lists, submissions }: CourseStudentRankingCardProps) {
    const [blurPersonalData, setBlurPersonalData] = useState(false)

    const colDefs = useMemo(
        () => [
            {
                field: 'name',
                flex: 2,
                filter: true,
                cellStyle: blurPersonalData ? PRIVACY_CELL_STYLE : CLEAR_PRIVACY_CELL_STYLE,
            },
            {
                field: 'email',
                flex: 2,
                filter: true,
                cellRenderer: emailRenderer('email'),
                cellStyle: blurPersonalData ? PRIVACY_CELL_STYLE : CLEAR_PRIVACY_CELL_STYLE,
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
                field: 'avgSubmissionsPerProblem',
                headerName: 'Avg #Sub/pbm',
                width: 180,
                filter: false,
                type: 'rightAligned',
                valueFormatter: (params: { value: number }) =>
                    Number.isFinite(params.value) ? params.value.toFixed(1) : '',
            },
        ],
        [blurPersonalData],
    )

    const rows = useMemo(
        () => deriveCourseStudentRanking(course, profiles, lists, submissions),
        [course, profiles, lists, submissions],
    )

    async function saveCsvHandle() {
        const data = rows.map((row) => ({
            name: row.name,
            email: row.email,
            '#OK': row.ok,
            '#KO': row.ko,
            '#SC': row.sc,
            '#NT': row.nt,
            '#Sub': row.totalSubmissions,
            'Avg #Sub/pbm': Number.isFinite(row.avgSubmissionsPerProblem)
                ? row.avgSubmissionsPerProblem.toFixed(1)
                : '',
        }))
        const csv = await array2csv(data)
        if (!csv) {
            toast.error('Error preparing CSV data')
            return
        }
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
        await saveFileWithDialog({
            blob,
            suggestedName: `${course.course_nm}-students.csv`,
            types: [{ description: 'CSV file', accept: { 'text/csv': ['.csv'] } }],
        })
    }

    return (
        <ResizableCard className="w-full" defaultHeight={480}>
            <CardHeader className="p-4">
                <CardTitle>Students</CardTitle>
                <CardAction>
                    <TooltipProvider>
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Toggle
                                        variant="outline"
                                        className="size-8"
                                        pressed={blurPersonalData}
                                        onPressedChange={setBlurPersonalData}
                                        aria-label={blurPersonalData ? 'Show names and emails' : 'Blur names and emails'}
                                    >
                                        {blurPersonalData ? (
                                            <EyeOffIcon className="size-4" aria-hidden />
                                        ) : (
                                            <EyeIcon className="size-4" aria-hidden />
                                        )}
                                    </Toggle>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {blurPersonalData ? 'Show names and emails' : 'Blur names and emails'}
                                </TooltipContent>
                            </Tooltip>
                            <SaveFileIconButton
                                onClick={saveCsvHandle}
                                disabled={rows.length === 0}
                                tooltip="Save table as CSV"
                                aria-label="Save table as CSV"
                            />
                        </div>
                    </TooltipProvider>
                </CardAction>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col px-4 pb-4">
                {rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No students to display.</p>
                ) : (
                    <div className="min-h-0 w-full flex-1">
                        <AgTable
                            key={blurPersonalData ? 'blurred' : 'clear'}
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
