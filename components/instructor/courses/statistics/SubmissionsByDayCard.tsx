'use client'

import { Heatmap } from '@/components/instructor/Heatmap'
import { CardContent, CardHeader, CardTitle, ResizableCard } from '@/components/ResizableCard'
import type { CourseSubmissionChartData } from '@/lib/instructor/courseSubmissionStatistics'

type SubmissionsByDayCardProps = {
    chartData: Pick<CourseSubmissionChartData, 'heatmapData' | 'heatmapStart' | 'heatmapEnd' | 'maxValue'>
}

export function SubmissionsByDayCard({ chartData }: SubmissionsByDayCardProps) {
    return (
        <ResizableCard className="w-full" defaultHeight={340}>
            <CardHeader className="p-4">
                <CardTitle>Submissions by day</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <Heatmap
                    data={chartData.heatmapData}
                    start={chartData.heatmapStart}
                    end={chartData.heatmapEnd}
                    maxValue={chartData.maxValue}
                />
            </CardContent>
        </ResizableCard>
    )
}
