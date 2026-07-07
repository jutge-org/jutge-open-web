import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { SubmissionsList } from '@/components/submissions/SubmissionsList'
import { getCurrentClient } from '@/lib/auth'
import { isGameProblem, parseProblemKey } from '@/lib/problems'
import { renderAuthed } from '@/lib/renderAuthed'
import {
    fetchProblemDetail,
    fetchInstructorOwnsProblem,
    fetchProblemStatus,
    resolveProblemId,
} from '@/services/queries/problemDetail'
import { fetchProblemSubmissionsData } from '@/services/queries/submissions'
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
        return { title: 'Submissions — Jutge.org' }
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        return { title: 'Submissions — Jutge.org' }
    }

    return { title: `Submissions — ${data.problem.title} — Jutge.org` }
}

export default async function ProblemSubmissionsPage({ params }: PageProps) {
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
        const client = await getCurrentClient()
        const languageTitles = new Map(data.languageVariants.map((variant) => [variant.problem_id, variant.title]))
        const [status, profile, rows, isInstructorOwner] = await Promise.all([
            fetchProblemStatus(client, problem_nm),
            client.student.profile.get(),
            fetchProblemSubmissionsData(client, problem_nm, languageTitles),
            fetchInstructorOwnsProblem(problem_nm),
        ])

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Problems', url: '/problems' },
                        { title: data.problem.problem_nm, url: `/problems/${data.problem.problem_nm}` },
                        { title: data.problem.title, url: `/problems/${key}` },
                        { title: 'Submissions', url: `/problems/${key}/submissions` },
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
                    <SubmissionsList rows={rows} variant="problem" problemNm={problem_nm} />
                </ProblemDetail>
            </div>
        )
    })
}
