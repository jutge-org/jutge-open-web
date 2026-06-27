'use client'

import { StackedOkKoBarChart } from '@/components/instructor/courses/statistics/StackedOkKoBarChart'
import { CardContent, CardHeader, CardTitle, ResizableCard } from '@/components/ResizableCard'
import type { CourseSubmissionChartData } from '@/lib/instructor/courseSubmissionStatistics'
import type { ColorMapping } from '@/lib/jutge_api_client'

type SubmissionsByDayOfWeekCardProps = {
    chartData: Pick<CourseSubmissionChartData, 'submissionsByWeekday'>
    colors: ColorMapping
}

export function SubmissionsByDayOfWeekCard({ chartData, colors }: SubmissionsByDayOfWeekCardProps) {
    return (
        <ResizableCard defaultHeight={340}>
            <CardHeader className="p-4">
                <CardTitle>Submissions by day of week</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">
                <StackedOkKoBarChart data={chartData.submissionsByWeekday} colors={colors} />
            </CardContent>
        </ResizableCard>
    )
}
