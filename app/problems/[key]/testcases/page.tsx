import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { ProblemTestcases } from '@/components/problems/ProblemTestcases'
import { getCurrentClient } from '@/lib/auth'
import { isGameProblem, parseProblemKey } from '@/lib/problems'
import { renderAuthed } from '@/lib/renderAuthed'
import {
    fetchInstructorOwnsProblem,
    fetchProblemDetail,
    fetchProblemStatus,
    resolveProblemId,
} from '@/services/queries/problemDetail'
import { fetchAllProblemTestcases } from '@/services/queries/problemTestcases'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return { title: 'Test cases — Jutge.org' }
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        return { title: 'Test cases — Jutge.org' }
    }

    return { title: `Test cases — ${data.problem.title} — Jutge.org` }
}

export default async function ProblemTestcasesPage({ params }: PageProps) {
    const { key } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        notFound()
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        notFound()
    }

    if (isGameProblem(data.problem.abstract_problem.driver_id)) {
        notFound()
    }

    const parsed = parseProblemKey(problemId)
    const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : data.problem.problem_nm

    return renderAuthed(async (user) => {
        const isInstructorOwner = await fetchInstructorOwnsProblem(problem_nm)
        if (!isInstructorOwner && !user.administrator) {
            notFound()
        }

        const client = await getCurrentClient()
        const [status, profile, testcases] = await Promise.all([
            fetchProblemStatus(client, problem_nm),
            client.student.profile.get(),
            fetchAllProblemTestcases(client, problemId, problem_nm, data.problem.abstract_problem.driver_id),
        ])

        if (!testcases) {
            notFound()
        }

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Problems', url: '/problems' },
                        { title: data.problem.problem_nm, url: `/problems/${data.problem.problem_nm}` },
                        { title: data.problem.title, url: `/problems/${key}` },
                        { title: 'Test cases', url: `/problems/${key}/testcases` },
                    ]}
                />
                <ProblemDetail
                    pageKey={key}
                    data={data}
                    status={status}
                    defaultCompilerId={profile.compiler_id}
                    isInstructorOwner={isInstructorOwner}
                    isAdministrator={user.administrator}
                    showStatement={false}
                    showTestcases={false}
                    showInformation={false}
                >
                    <ProblemTestcases testcases={testcases} />
                </ProblemDetail>
            </div>
        )
    })
}
