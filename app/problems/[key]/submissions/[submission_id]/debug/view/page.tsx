import { DebugInformationEditor } from '@/components/submissions/DebugInformationEditor'
import { getCurrentClient } from '@/lib/auth'
import { getDebugInformationFields, hasDebugInformation } from '@/lib/debugInformation'
import { parseProblemKey } from '@/lib/problems'
import { renderAuthed } from '@/lib/renderAuthed'
import { buildSubmissionNavLinks } from '@/lib/submissions'
import { fetchProblemDetail, resolveProblemId } from '@/services/queries/problemDetail'
import { fetchSubmissionDetail } from '@/services/queries/submissions'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string; submission_id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key, submission_id } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return { title: `${submission_id} — Jutge.org` }
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        return { title: `${submission_id} — Jutge.org` }
    }

    return {
        title: `Debug — ${data.problem.problem_nm} - ${submission_id} — Jutge.org`,
    }
}

export default async function ProblemSubmissionDebugViewPage({ params }: PageProps) {
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

    return renderAuthed(async (user) => {
        const client = await getCurrentClient()
        const isExamOrContest = await client.student.exam.get().then(
            () => true,
            () => false,
        )

        const [submissionDetail, problemSubmissions] = await Promise.all([
            fetchSubmissionDetail(client, key, submission_id, {
                isAdministrator: user.administrator,
                isExamOrContest,
            }),
            client.student.submissions.getForAbstractProblems(problem_nm),
        ])

        if (!submissionDetail || !hasDebugInformation(submissionDetail.debugInformation)) {
            notFound()
        }

        const fields = getDebugInformationFields(submissionDetail.debugInformation!)
        if (fields.length === 0) {
            notFound()
        }

        const doneSubmissions = problemSubmissions.filter((submission) => submission.state === 'done')
        const navigation = buildSubmissionNavLinks(doneSubmissions, submission_id, key, '/debug/view')

        const { submission } = submissionDetail

        return (
            <DebugInformationEditor
                fields={fields}
                problemId={submission.problem_id}
                submissionId={submission.submission_id}
                verdict={submissionDetail.verdict}
                verdictEmoji={submissionDetail.verdictEmoji}
                verdictFullName={submissionDetail.verdictFullName}
                isPending={submissionDetail.verdict === 'Pending'}
                navigation={navigation}
            />
        )
    })
}
