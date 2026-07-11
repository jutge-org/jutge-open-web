import { GameProblemCompetitionsCard } from '@/components/problems/GameProblemCompetitionsCard'
import { ProblemHeaderCard } from '@/components/problems/ProblemHeaderCard'
import { ProblemHealthCard } from '@/components/problems/ProblemHealthCard'
import { ProblemInformation } from '@/components/problems/ProblemInformation'
import { ProblemNav } from '@/components/problems/ProblemNav'
import { ProblemStatement } from '@/components/problems/ProblemStatement'
import { ProblemWidgetCard } from '@/components/problems/ProblemWidgetCard'
import { PublicTestcases } from '@/components/problems/PublicTestcases'
import { WidgetSpinner } from '@/components/general/WidgetSpinner'
import { Card, CardContent } from '@/components/ui/card'
import { isGameProblem } from '@/lib/problems'
import { showInstructorProblemTabs } from '@/lib/problemNav'
import type { AbstractStatus } from '@/lib/jutge_api_client'
import type { ProblemDetailData } from '@/lib/data/problemDetail'

import type { ReactNode } from 'react'

type ProblemDetailBaseProps = {
    pageKey: string
    showStatement?: boolean
    showTestcases?: boolean
    showInformation?: boolean
    showNav?: boolean
    children?: ReactNode
}

type ProblemDetailLoadingProps = ProblemDetailBaseProps & {
    loading: true
}

type ProblemDetailLoadedProps = ProblemDetailBaseProps & {
    loading?: false
    data: ProblemDetailData
    status?: AbstractStatus | null
    defaultCompilerId?: string | null
    isInstructorOwner?: boolean
    isAdministrator?: boolean
}

type ProblemDetailProps = ProblemDetailLoadingProps | ProblemDetailLoadedProps

function ProblemHeaderCardLoading() {
    return (
        <Card className="ring-0 border border-border shadow-sm">
            <CardContent className="w-full py-6">
                <WidgetSpinner label="Loading problem" />
            </CardContent>
        </Card>
    )
}

export function ProblemDetail(props: ProblemDetailProps) {
    const {
        pageKey,
        showStatement = true,
        showTestcases = true,
        showInformation = true,
        showNav = true,
        children,
    } = props

    if (props.loading) {
        return (
            <div className="flex flex-col gap-6">
                <ProblemHeaderCardLoading />
                {showNav ? <ProblemNav pageKey={pageKey} showInstructorTabs={false} /> : null}
                {children}
                {showStatement ? <ProblemWidgetCard title="Statement" /> : null}
                {showTestcases ? <ProblemWidgetCard title="Public test cases" /> : null}
                {showInformation ? <ProblemWidgetCard title="Information" /> : null}
            </div>
        )
    }

    const { data, status, defaultCompilerId, isInstructorOwner = false, isAdministrator = false } = props
    const { problem } = data
    const isGame = isGameProblem(problem.abstract_problem.driver_id)
    const showActions = status !== undefined && !isGame
    const showInstructorTabs = showInstructorProblemTabs(isInstructorOwner, isAdministrator)

    return (
        <div className="flex flex-col gap-6">
            {isGame ? <GameProblemCompetitionsCard /> : null}

            <ProblemHeaderCard
                data={data}
                status={status}
                defaultCompilerId={defaultCompilerId}
                showActions={showActions}
            />

            {showNav ? <ProblemNav pageKey={pageKey} showInstructorTabs={showInstructorTabs} /> : null}

            {children}

            <ProblemHealthCard problem={problem} />

            {showStatement ? (
                <ProblemStatement
                    pageKey={pageKey}
                    problemId={problem.problem_id}
                    shortHtmlStatement={data.shortHtmlStatement}
                    templates={data.templates}
                />
            ) : null}

            {showTestcases && data.publicTestcases.length > 0 ? (
                <PublicTestcases testcases={data.publicTestcases} />
            ) : null}

            {showInformation ? <ProblemInformation data={data} /> : null}
        </div>
    )
}
