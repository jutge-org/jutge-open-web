'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'

import { AuthedGate } from '@/components/ClientGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { ProblemSolutions } from '@/components/problems/ProblemSolutions'
import { hasInstructorProblemAccess, useProblemShell } from '@/hooks/useProblemShell'
import jutge from '@/lib/jutge'
import { isGameProblem } from '@/lib/problems'
import { problemLoadedBreadcrumbs, problemTrailBreadcrumbs } from '@/lib/problemBreadcrumbs'
import { fetchProblemSolutionProglangs } from '@/lib/data/problemSolutions'

export default function ProblemSolutionsPage() {
    return <AuthedGate>{(user) => <ProblemSolutionsPageContent isAdministrator={user.administrator} />}</AuthedGate>
}

function ProblemSolutionsPageContent({ isAdministrator }: { isAdministrator: boolean }) {
    const params = useParams<{ key: string }>()
    const key = params.key
    const shell = useProblemShell({ key, isAuthenticated: true })
    const [proglangs, setProglangs] = useState<string[] | null>(null)

    const access = hasInstructorProblemAccess(shell.isInstructorOwner, isAdministrator)

    useEffect(() => {
        if (!shell.detail || access !== true) return

        let cancelled = false
        setProglangs(null)

        void fetchProblemSolutionProglangs(jutge, shell.detail.problem.problem_id).then((data) => {
            if (!cancelled) setProglangs(data)
        })

        return () => {
            cancelled = true
        }
    }, [access, shell.detail])

    const shellLoading = shell.detail === undefined || access === undefined
    const solutionsLoading = access === true && shell.detail && proglangs === null

    if (!shellLoading && shell.detail === null) {
        notFound()
    }

    if (!shellLoading && shell.detail && isGameProblem(shell.detail.problem.abstract_problem.driver_id)) {
        notFound()
    }

    if (!shellLoading && access === false) {
        notFound()
    }

    const breadcrumbs =
        shell.detail && shell.problem_nm
            ? problemLoadedBreadcrumbs(key, shell.detail.problem.problem_nm, shell.detail.problem.title, [
                  { title: 'Solutions', url: `/problems/${key}/solutions` },
              ])
            : problemTrailBreadcrumbs(key, [{ title: 'Solutions', url: `/problems/${key}/solutions` }])

    const problem_nm = shell.problem_nm ?? key

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
                    {solutionsLoading ? (
                        <ProblemSolutions loading />
                    ) : (
                        <ProblemSolutions
                            pageKey={key}
                            problemId={shell.detail.problem.problem_id}
                            problem_nm={problem_nm}
                            proglangs={proglangs ?? []}
                        />
                    )}
                </ProblemDetail>
            ) : (
                <ProblemDetail
                    loading
                    pageKey={key}
                    showStatement={false}
                    showTestcases={false}
                    showInformation={false}
                >
                    <ProblemSolutions loading />
                </ProblemDetail>
            )}
        </div>
    )
}
