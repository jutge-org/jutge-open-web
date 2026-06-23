'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import { AuthedGate } from '@/components/auth/AuthGates'
import { SubmissionCodeEditor } from '@/components/submissions/SubmissionCodeEditor'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { parseProblemKey } from '@/lib/problems'
import { buildSubmissionNavLinks, type SubmissionNavLinks } from '@/lib/submissions'
import { fetchProblemDetail, resolveProblemId } from '@/services/queries/problemDetail'
import { fetchSubmissionDetail } from '@/services/queries/submissions'
import type { SubmissionDetailData } from '@/services/queries/submissions'

type ProblemSubmissionCodeViewPageClientProps = {
    pageKey: string
    submissionId: string
}

export function ProblemSubmissionCodeViewPageClient({
    pageKey,
    submissionId,
}: ProblemSubmissionCodeViewPageClientProps) {
    const { client, user, loading: authLoading } = useJutgeAuth()
    const [title, setTitle] = useState<string | null>(null)
    const [submissionDetail, setSubmissionDetail] = useState<SubmissionDetailData | null | undefined>(undefined)
    const [navigation, setNavigation] = useState<SubmissionNavLinks | null>(null)

    useEffect(() => {
        if (authLoading || !user) return

        let cancelled = false

        void (async () => {
            const problemId = await resolveProblemId(client, pageKey)
            if (cancelled) return
            if (!problemId) {
                setSubmissionDetail(null)
                return
            }

            const data = await fetchProblemDetail(client, problemId)
            if (cancelled) return
            if (!data) {
                setSubmissionDetail(null)
                return
            }

            const parsed = parseProblemKey(problemId)
            const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : data.problem.problem_nm
            const pageTitle = `${data.problem.problem_nm} — ${data.problem.title}`

            const isExamOrContest = await client.student.exam.get().then(
                () => true,
                () => false,
            )

            const [detailResult, problemSubmissions] = await Promise.all([
                fetchSubmissionDetail(client, pageKey, submissionId, {
                    isAdministrator: user.administrator,
                    isExamOrContest,
                }),
                client.student.submissions.getForAbstractProblems(problem_nm),
            ])

            if (cancelled) return

            if (!detailResult?.code || !detailResult.codeFilename) {
                setSubmissionDetail(null)
                return
            }

            const doneSubmissions = problemSubmissions.filter((s) => s.state === 'done')
            setTitle(pageTitle)
            setSubmissionDetail(detailResult)
            setNavigation(buildSubmissionNavLinks(doneSubmissions, submissionId, pageKey, '/code'))
        })()

        return () => {
            cancelled = true
        }
    }, [authLoading, client, pageKey, submissionId, user])

    if (authLoading || submissionDetail === undefined) {
        return (
            <AuthedGate>
                <p className="py-16 text-center text-muted-foreground">Loading…</p>
            </AuthedGate>
        )
    }

    if (!submissionDetail?.code || !submissionDetail.codeFilename || !title) {
        notFound()
    }

    const { code, codeExtension, codeFilename } = submissionDetail
    const submissionHref = `/problems/${pageKey}/submissions/${submissionId}`
    const codeHref = `${submissionHref}/code`

    return (
        <AuthedGate>
            <SubmissionCodeEditor
                code={code}
                codeExtension={codeExtension}
                codeFilename={codeFilename}
                codeHref={codeHref}
                title={title}
                submissionId={submissionId}
                verdict={submissionDetail.verdict}
                verdictEmoji={submissionDetail.verdictEmoji}
                verdictFullName={submissionDetail.verdictFullName}
                navigation={navigation}
                isPending={submissionDetail.verdict === 'Pending'}
            />
        </AuthedGate>
    )
}
