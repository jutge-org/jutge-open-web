'use client'

import { CourseProblemStatisticsContextCard } from '@/components/instructor/courses/CourseProblemStatisticsContextCard'
import { ProblemStatisticsPanel } from '@/components/instructor/problems/ProblemStatisticsView'
import type { CourseProblemStatisticsPageData } from '@/lib/instructor/loadCourseProblemStatisticsData'
import { toStatisticsSubmissionFromCourse } from '@/lib/instructor/submissionStatistics'
import { useMemo } from 'react'

type CourseProblemStatisticsViewProps = {
    data: CourseProblemStatisticsPageData
}

export function CourseProblemStatisticsView({ data }: CourseProblemStatisticsViewProps) {
    const submissions = useMemo(() => data.submissions.map(toStatisticsSubmissionFromCourse), [data.submissions])

    return (
        <div className="flex w-full flex-col gap-4">
            <CourseProblemStatisticsContextCard data={data} />
            <ProblemStatisticsPanel
                problem_nm={data.problem_nm}
                submissions={submissions}
                colors={data.colors}
                abstractProblem={data.abstractProblem}
                languagesTable={data.languagesTable}
            />
        </div>
    )
}
