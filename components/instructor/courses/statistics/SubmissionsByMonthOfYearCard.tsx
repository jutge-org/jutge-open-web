'use client'

import { StackedOkKoBarChart } from '@/components/instructor/courses/statistics/StackedOkKoBarChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CourseSubmissionChartData } from '@/lib/instructor/courseSubmissionStatistics'
import type { ColorMapping } from '@/lib/jutge_api_client'

type SubmissionsByMonthOfYearCardProps = {
    chartData: Pick<CourseSubmissionChartData, 'submissionsByMonth'>
    colors: ColorMapping
}

export function SubmissionsByMonthOfYearCard({ chartData, colors }: SubmissionsByMonthOfYearCardProps) {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle>Submissions by month of year</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">
                <StackedOkKoBarChart data={chartData.submissionsByMonth} colors={colors} />
            </CardContent>
        </Card>
    )
}
