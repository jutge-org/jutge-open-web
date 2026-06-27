'use client'

import { DistributionPieChart } from '@/components/instructor/statistics/DistributionPieChart'
import { StatisticsStatCard } from '@/components/instructor/statistics/StatisticsStatCard'
import type { SubmissionChartData } from '@/lib/instructor/submissionStatistics'
import type { ColorMapping } from '@/lib/jutge_api_client'

type CourseSubmissionDistributionCardsProps = {
    derived: Pick<SubmissionChartData, 'usersOkKo' | 'submissionsOkKo' | 'verdicts' | 'compilers' | 'proglangs'>
    colors: ColorMapping
}

export function CourseSubmissionDistributionCards({ derived, colors }: CourseSubmissionDistributionCardsProps) {
    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                <StatisticsStatCard title="User statuses">
                    <DistributionPieChart data={derived.usersOkKo} category="statuses" colors={colors} />
                </StatisticsStatCard>
                <StatisticsStatCard title="Submission statuses">
                    <DistributionPieChart data={derived.submissionsOkKo} category="statuses" colors={colors} />
                </StatisticsStatCard>
                <StatisticsStatCard title="Submissions by verdict">
                    <DistributionPieChart data={derived.verdicts} category="verdicts" colors={colors} />
                </StatisticsStatCard>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                <StatisticsStatCard title="Compilers">
                    <DistributionPieChart data={derived.compilers} category="compilers" colors={colors} />
                </StatisticsStatCard>
                <StatisticsStatCard title="Programming languages">
                    <DistributionPieChart data={derived.proglangs} category="proglangs" colors={colors} />
                </StatisticsStatCard>
            </div>
        </>
    )
}
