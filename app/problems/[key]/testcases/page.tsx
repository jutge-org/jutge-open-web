'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'

import { AuthedGate } from '@/components/ClientGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { ProblemTestcases } from '@/components/problems/ProblemTestcases'
import { hasInstructorProblemAccess, useProblemShell } from '@/hooks/useProblemShell'
import jutge from '@/lib/jutge'
import { isGameProblem } from '@/lib/problems'
import { problemLoadedBreadcrumbs, problemTrailBreadcrumbs } from '@/lib/problemBreadcrumbs'
import { fetchAllProblemTestcases } from '@/lib/data/problemTestcases'
import type { DecodedTestcase } from '@/lib/data/problemDetail'

export default function ProblemTestcasesPage() {
    return <AuthedGate>{(user) => <ProblemTestcasesPageContent isAdministrator={user.administrator} />}</AuthedGate>
}

function ProblemTestcasesPageContent({ isAdministrator }: { isAdministrator: boolean }) {
    const params = useParams<{ key: string }>()
    const key = params.key
    const shell = useProblemShell({ key, isAuthenticated: true })
    const [testcases, setTestcases] = useState<DecodedTestcase[] | null | undefined>(undefined)

    const access = hasInstructorProblemAccess(shell.isInstructorOwner, isAdministrator)

    useEffect(() => {
        if (!shell.detail || !shell.problem_nm || access !== true) return

        let cancelled = false
        setTestcases(undefined)

        void fetchAllProblemTestcases(
            jutge,
            shell.detail.problem.problem_id,
            shell.problem_nm,
            shell.detail.problem.abstract_problem.driver_id,
        ).then((data) => {
            if (!cancelled) setTestcases(data)
        })

        return () => {
            cancelled = true
        }
    }, [access, shell.detail, shell.problem_nm])

    const shellLoading = shell.detail === undefined || access === undefined
    const testcasesLoading = access === true && shell.detail && testcases === undefined

    if (!shellLoading && shell.detail === null) {
        notFound()
    }

    if (!shellLoading && shell.detail && isGameProblem(shell.detail.problem.abstract_problem.driver_id)) {
        notFound()
    }

    if (!shellLoading && access === false) {
        notFound()
    }

    if (!shellLoading && access === true && testcases === null) {
        notFound()
    }

    const breadcrumbs =
        shell.detail && shell.problem_nm
            ? problemLoadedBreadcrumbs(key, shell.detail.problem.problem_nm, shell.detail.problem.title, [
                  { title: 'Test cases', url: `/problems/${key}/testcases` },
              ])
            : problemTrailBreadcrumbs(key, [{ title: 'Test cases', url: `/problems/${key}/testcases` }])

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            {shell.detail ? (
                <ProblemDetail
                    pageKey={key}
                    data={shell.detail}
                    status={shell.status}
                    defaultCompilerId={shell.defaultCompilerId}
                    isInstructorOwner={shell.isInstructorOwner ?? false}
                    isAdministrator={isAdministrator}
                    showStatement={false}
                    showTestcases={false}
                    showInformation={false}
                >
                    {testcasesLoading ? <ProblemTestcases loading /> : <ProblemTestcases testcases={testcases ?? []} />}
                </ProblemDetail>
            ) : (
                <ProblemDetail
                    loading
                    pageKey={key}
                    showStatement={false}
                    showTestcases={false}
                    showInformation={false}
                >
                    <ProblemTestcases loading />
                </ProblemDetail>
            )}
        </div>
    )
}
