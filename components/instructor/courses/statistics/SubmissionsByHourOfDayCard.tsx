'use client'

import { StackedOkKoBarChart } from '@/components/instructor/courses/statistics/StackedOkKoBarChart'
import { CardContent, CardHeader, CardTitle, ResizableCard } from '@/components/ResizableCard'
import type { CourseSubmissionChartData } from '@/lib/instructor/courseSubmissionStatistics'
import type { ColorMapping } from '@/lib/jutge_api_client'

type SubmissionsByHourOfDayCardProps = {
    courseNm: string
    chartData: Pick<CourseSubmissionChartData, 'submissionsByHour'>
    colors: ColorMapping
}

export function SubmissionsByHourOfDayCard({ courseNm, chartData, colors }: SubmissionsByHourOfDayCardProps) {
    return (
        <ResizableCard defaultHeight={340}>
            <CardHeader className="p-4">
                <CardTitle>Submissions by hour of day</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">
                <StackedOkKoBarChart
                    data={chartData.submissionsByHour}
                    colors={colors}
                    exportFileName={`${courseNm}-submissions-by-hour-of-day`}
                />
            </CardContent>
        </ResizableCard>
    )
}
