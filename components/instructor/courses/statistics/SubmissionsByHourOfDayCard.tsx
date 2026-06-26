'use client'

import { StackedOkKoBarChart } from '@/components/instructor/courses/statistics/StackedOkKoBarChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CourseSubmissionChartData } from '@/lib/instructor/courseSubmissionStatistics'
import type { ColorMapping } from '@/lib/jutge_api_client'

type SubmissionsByHourOfDayCardProps = {
    chartData: Pick<CourseSubmissionChartData, 'submissionsByHour'>
    colors: ColorMapping
}

export function SubmissionsByHourOfDayCard({ chartData, colors }: SubmissionsByHourOfDayCardProps) {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle>Submissions by hour of day</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">
                <StackedOkKoBarChart data={chartData.submissionsByHour} colors={colors} />
            </CardContent>
        </Card>
    )
}
