import { GameProblemCompetitionsCard } from '@/components/problems/GameProblemCompetitionsCard'
import { ProblemHeaderCard } from '@/components/problems/ProblemHeaderCard'
import { ProblemHealthCard } from '@/components/problems/ProblemHealthCard'
import { ProblemInformation } from '@/components/problems/ProblemInformation'
import { ProblemNav } from '@/components/problems/ProblemNav'
import { ProblemStatement } from '@/components/problems/ProblemStatement'
import { PublicTestcases } from '@/components/problems/PublicTestcases'
import { isGameProblem } from '@/lib/problems'
import { showInstructorProblemTabs } from '@/lib/problemNav'
import type { AbstractStatus } from '@/lib/jutge_api_client'
import type { ProblemDetailData } from '@/services/queries/problemDetail'

import type { ReactNode } from 'react'

type ProblemDetailProps = {
    pageKey: string
    data: ProblemDetailData
    /** Present for authenticated users (may be null if the status request failed). */
    status?: AbstractStatus | null
    defaultCompilerId?: string | null
    isInstructorOwner?: boolean
    isAdministrator?: boolean
    showStatement?: boolean
    showTestcases?: boolean
    showInformation?: boolean
    showNav?: boolean
    children?: ReactNode
}

export function ProblemDetail({
    pageKey,
    data,
    status,
    defaultCompilerId,
    isInstructorOwner = false,
    isAdministrator = false,
    showStatement = true,
    showTestcases = true,
    showInformation = true,
    showNav = true,
    children,
}: ProblemDetailProps) {
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
