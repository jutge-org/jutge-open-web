import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { ProblemSolutions } from '@/components/problems/ProblemSolutions'
import { getCurrentClient } from '@/lib/auth'
import { isGameProblem, parseProblemKey } from '@/lib/problems'
import { renderAuthed } from '@/lib/renderAuthed'
import {
    fetchInstructorOwnsProblem,
    fetchProblemDetail,
    fetchProblemStatus,
    resolveProblemId,
} from '@/services/queries/problemDetail'
import { fetchProblemSolutionProglangs } from '@/services/queries/problemSolutions'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return { title: 'Solutions — Jutge.org' }
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        return { title: 'Solutions — Jutge.org' }
    }

    return { title: `Solutions — ${data.problem.title} — Jutge.org` }
}

export default async function ProblemSolutionsPage({ params }: PageProps) {
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
        const [status, profile, proglangs] = await Promise.all([
            fetchProblemStatus(client, problem_nm),
            client.student.profile.get(),
            fetchProblemSolutionProglangs(client, problemId),
        ])

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Problems', url: '/problems' },
                        { title: data.problem.problem_nm, url: `/problems/${data.problem.problem_nm}` },
                        { title: data.problem.title, url: `/problems/${key}` },
                        { title: 'Solutions', url: `/problems/${key}/solutions` },
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
                    <ProblemSolutions
                        pageKey={key}
                        problemId={problemId}
                        problem_nm={problem_nm}
                        proglangs={proglangs}
                    />
                </ProblemDetail>
            </div>
        )
    })
}
