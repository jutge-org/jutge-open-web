'use client'

import { StackedOkKoBarChart } from '@/components/instructor/courses/statistics/StackedOkKoBarChart'
import { CardContent, CardHeader, CardTitle, ResizableCard } from '@/components/ResizableCard'
import type { CourseSubmissionChartData } from '@/lib/instructor/courseSubmissionStatistics'
import type { ColorMapping } from '@/lib/jutge_api_client'

type SubmissionsByMonthOfYearCardProps = {
    chartData: Pick<CourseSubmissionChartData, 'submissionsByMonth'>
    colors: ColorMapping
}

export function SubmissionsByMonthOfYearCard({ chartData, colors }: SubmissionsByMonthOfYearCardProps) {
    return (
        <ResizableCard defaultHeight={340}>
            <CardHeader className="p-4">
                <CardTitle>Submissions by month of year</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">
                <StackedOkKoBarChart data={chartData.submissionsByMonth} colors={colors} />
            </CardContent>
        </ResizableCard>
    )
}
