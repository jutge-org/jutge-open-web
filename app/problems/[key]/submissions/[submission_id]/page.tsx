import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { SubmissionDetailView } from '@/components/submissions/SubmissionDetailView'
import { getCurrentClient } from '@/lib/auth'
import { parseProblemKey } from '@/lib/problems'
import { renderAuthed } from '@/lib/renderAuthed'
import { buildSubmissionNavLinks } from '@/lib/submissions'
import { fetchProblemDetail, fetchProblemStatus, resolveProblemId } from '@/services/queries/problemDetail'
import { fetchSubmissionDetail } from '@/services/queries/submissions'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string; submission_id: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key, submission_id } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return { title: 'Submission — Jutge.org' }
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        return { title: 'Submission — Jutge.org' }
    }

    return { title: `${submission_id} — ${data.problem.title} — Jutge.org` }
}

export default async function ProblemSubmissionDetailPage({ params }: PageProps) {
    const { key, submission_id } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        notFound()
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        notFound()
    }

    const parsed = parseProblemKey(problemId)
    const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : data.problem.problem_nm
    const submissionHref = `/problems/${key}/submissions/${submission_id}`
    const codeHref = `${submissionHref}/code`

    return renderAuthed(async (user) => {
        const client = await getCurrentClient()
        const [status, profile, isExamOrContest, problemSubmissions] = await Promise.all([
            fetchProblemStatus(client, problem_nm),
            client.student.profile.get(),
            client.student.exam.get().then(
                () => true,
                () => false,
            ),
            client.student.submissions.getForAbstractProblems(problem_nm),
        ])

        const submissionDetail = await fetchSubmissionDetail(client, key, submission_id, {
            isAdministrator: user.administrator,
            isExamOrContest,
        })

        if (!submissionDetail) {
            notFound()
        }

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Problems', url: '/problems' },
                        { title: data.problem.problem_nm, url: `/problems/${data.problem.problem_nm}` },
                        { title: data.problem.title, url: `/problems/${key}` },
                        { title: 'Submissions', url: `/problems/${key}/submissions` },
                        { title: submission_id, url: submissionHref },
                    ]}
                />
                <ProblemDetail
                    pageKey={key}
                    data={data}
                    status={status}
                    defaultCompilerId={profile.compiler_id}
                    showStatement={false}
                    showTestcases={false}
                    showInformation={false}
                >
                    <SubmissionDetailView
                        data={submissionDetail}
                        codeHref={codeHref}
                        navigation={buildSubmissionNavLinks(problemSubmissions, submission_id, key)}
                    />
                </ProblemDetail>
            </div>
        )
    })
}
