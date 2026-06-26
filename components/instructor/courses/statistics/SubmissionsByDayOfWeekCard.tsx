'use client'

import { StackedOkKoBarChart } from '@/components/instructor/courses/statistics/StackedOkKoBarChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CourseSubmissionChartData } from '@/lib/instructor/courseSubmissionStatistics'
import type { ColorMapping } from '@/lib/jutge_api_client'

type SubmissionsByDayOfWeekCardProps = {
    chartData: Pick<CourseSubmissionChartData, 'submissionsByWeekday'>
    colors: ColorMapping
}

export function SubmissionsByDayOfWeekCard({ chartData, colors }: SubmissionsByDayOfWeekCardProps) {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle>Submissions by day of week</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">
                <StackedOkKoBarChart data={chartData.submissionsByWeekday} colors={colors} />
            </CardContent>
        </Card>
    )
}
