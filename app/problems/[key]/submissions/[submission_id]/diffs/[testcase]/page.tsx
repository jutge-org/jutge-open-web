import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { SubmissionSourceCodeCard } from '@/components/submissions/SubmissionSourceCodeCard'
import { SubmissionTestcaseAnalysisCard } from '@/components/submissions/SubmissionTestcaseAnalysisCard'
import { getCurrentClient } from '@/lib/auth'
import { parseProblemKey } from '@/lib/problems'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchProblemDetail, fetchInstructorOwnsProblem, fetchProblemStatus, resolveProblemId } from '@/services/queries/problemDetail'
import { fetchSubmissionDetail, fetchSubmissionTestcaseAnalysis } from '@/services/queries/submissions'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string; submission_id: string; testcase: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key, submission_id, testcase } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return { title: 'Test case analysis — Jutge.org' }
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        return { title: 'Test case analysis — Jutge.org' }
    }

    return { title: `${testcase} — ${submission_id} — ${data.problem.title} — Jutge.org` }
}

export default async function ProblemSubmissionTestcaseAnalysisPage({ params }: PageProps) {
    const { key, submission_id, testcase } = await params
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
    const diffHref = `${submissionHref}/diffs/${testcase}/diff`

    return renderAuthed(async (user) => {
        const client = await getCurrentClient()
        const [status, profile, isExamOrContest, testcaseAnalysis, isInstructorOwner] = await Promise.all([
            fetchProblemStatus(client, problem_nm),
            client.student.profile.get(),
            client.student.exam.get().then(
                () => true,
                () => false,
            ),
            fetchSubmissionTestcaseAnalysis(client, key, submission_id, testcase),
            fetchInstructorOwnsProblem(problem_nm),
        ])

        const submissionDetail = await fetchSubmissionDetail(client, key, submission_id, {
            isAdministrator: user.administrator,
            isExamOrContest,
        })

        if (!testcaseAnalysis || !submissionDetail) {
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
                        { title: testcase, url: `${submissionHref}/diffs/${testcase}` },
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
                    <div className="flex flex-col gap-6">
                        <SubmissionTestcaseAnalysisCard data={testcaseAnalysis} diffHref={diffHref} />
                        {submissionDetail.code && submissionDetail.codeFilename ? (
                            <SubmissionSourceCodeCard
                                code={submissionDetail.code}
                                codeExtension={submissionDetail.codeExtension}
                                codeFilename={submissionDetail.codeFilename}
                                codeHref={codeHref}
                            />
                        ) : null}
                    </div>
                </ProblemDetail>
            </div>
        )
    })
}
