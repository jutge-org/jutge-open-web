'use client'

import { SubmissionVolumeAreaChart } from '@/components/instructor/courses/statistics/SubmissionVolumeAreaChart'
import { CardAction, CardContent, CardHeader, CardTitle, ResizableCard } from '@/components/ResizableCard'
import { Slider } from '@/components/ui/slider'
import {
    deriveSubmissionVolumeOverTime,
    SUBMISSION_VOLUME_BUCKET_SIZE_DEFAULT,
    SUBMISSION_VOLUME_BUCKET_SIZE_MAX,
    SUBMISSION_VOLUME_BUCKET_SIZE_MIN,
} from '@/lib/instructor/courseSubmissionStatistics'
import type { CourseSubmission, ColorMapping } from '@/lib/jutge_api_client'
import { useMemo, useState } from 'react'

type SubmissionsOverTimeCardProps = {
    courseNm: string
    submissions: CourseSubmission[]
    startDate: Date
    endDate: Date
    colors: ColorMapping
}

export function SubmissionsOverTimeCard({
    courseNm,
    submissions,
    startDate,
    endDate,
    colors,
}: SubmissionsOverTimeCardProps) {
    const [bucketSize, setBucketSize] = useState(SUBMISSION_VOLUME_BUCKET_SIZE_DEFAULT)

    const chartData = useMemo(
        () => deriveSubmissionVolumeOverTime(submissions, startDate, endDate, bucketSize),
        [submissions, startDate, endDate, bucketSize],
    )

    return (
        <ResizableCard className="w-full" defaultHeight={340}>
            <CardHeader className="p-4">
                <CardTitle>Submissions over time</CardTitle>
                <CardAction>
                    <div className="flex items-center gap-2">
                        <span className="shrink-0 text-xs text-muted-foreground">Bucket size</span>
                        <Slider
                            min={SUBMISSION_VOLUME_BUCKET_SIZE_MIN}
                            max={SUBMISSION_VOLUME_BUCKET_SIZE_MAX}
                            step={1}
                            value={[bucketSize]}
                            onValueChange={(value) =>
                                setBucketSize(value[0] ?? SUBMISSION_VOLUME_BUCKET_SIZE_DEFAULT)
                            }
                            aria-label="Bucket size"
                            className="w-18"
                        />
                        <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                            {bucketSize}
                        </span>
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <SubmissionVolumeAreaChart
                    data={chartData}
                    colors={colors}
                    exportFileName={`${courseNm}-submissions-over-time`}
                />
            </CardContent>
        </ResizableCard>
    )
}
