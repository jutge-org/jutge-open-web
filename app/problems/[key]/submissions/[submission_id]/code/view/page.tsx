import { SubmissionCodeEditor } from '@/components/submissions/SubmissionCodeEditor'
import { getCurrentClient } from '@/lib/auth'
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

export const dynamic = 'force-dynamic'

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
        title: `${data.problem.problem_nm} - ${submission_id} — Jutge.org`,
    }
}

export default async function ProblemSubmissionCodeViewPage({ params }: PageProps) {
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
    const title = `${data.problem.problem_nm} — ${data.problem.title}`

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

        if (!submissionDetail?.code || !submissionDetail.codeFilename) {
            notFound()
        }

        const doneSubmissions = problemSubmissions.filter((submission) => submission.state === 'done')
        const navigation = buildSubmissionNavLinks(doneSubmissions, submission_id, key, '/code')

        return (
            <SubmissionCodeEditor
                code={submissionDetail.code}
                codeExtension={submissionDetail.codeExtension}
                codeFilename={submissionDetail.codeFilename}
                title={title}
                submissionId={submission_id}
                verdict={submissionDetail.verdict}
                verdictEmoji={submissionDetail.verdictEmoji}
                verdictFullName={submissionDetail.verdictFullName}
                navigation={navigation}
                isPending={submissionDetail.verdict === 'Pending'}
            />
        )
    })
}
