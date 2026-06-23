'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import { AuthedGate } from '@/components/auth/AuthGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { SubmissionSourceCodeCard } from '@/components/submissions/SubmissionSourceCodeCard'
import { SubmissionTestcaseAnalysisCard } from '@/components/submissions/SubmissionTestcaseAnalysisCard'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { parseProblemKey } from '@/lib/problems'
import { fetchProblemDetail, fetchProblemStatus, resolveProblemId } from '@/services/queries/problemDetail'
import type { ProblemDetailData } from '@/services/queries/problemDetail'
import {
    fetchSubmissionDetail,
    fetchSubmissionTestcaseAnalysis,
    type SubmissionDetailData,
    type SubmissionTestcaseAnalysisData,
} from '@/services/queries/submissions'
import type { AbstractStatus } from '@/lib/jutge_api_client'

type ProblemSubmissionTestcasePageClientProps = {
    pageKey: string
    submissionId: string
    testcase: string
}

export function ProblemSubmissionTestcasePageClient({
    pageKey,
    submissionId,
    testcase,
}: ProblemSubmissionTestcasePageClientProps) {
    const { client, user, loading: authLoading } = useJutgeAuth()
    const [data, setData] = useState<ProblemDetailData | null | undefined>(undefined)
    const [problemNm, setProblemNm] = useState<string | null>(null)
    const [status, setStatus] = useState<AbstractStatus | null>(null)
    const [defaultCompilerId, setDefaultCompilerId] = useState<string | null | undefined>(undefined)
    const [submissionDetail, setSubmissionDetail] = useState<SubmissionDetailData | null | undefined>(undefined)
    const [testcaseAnalysis, setTestcaseAnalysis] = useState<SubmissionTestcaseAnalysisData | null | undefined>(
        undefined,
    )

    useEffect(() => {
        if (authLoading || !user) return

        let cancelled = false

        void (async () => {
            const problemId = await resolveProblemId(client, pageKey)
            if (cancelled) return
            if (!problemId) {
                setData(null)
                return
            }

            const detail = await fetchProblemDetail(client, problemId)
            if (cancelled) return
            if (!detail) {
                setData(null)
                return
            }

            const parsed = parseProblemKey(problemId)
            const nm = parsed.kind === 'problem_id' ? parsed.problem_nm : detail.problem.problem_nm

            const [statusResult, profile, isExamOrContest, analysis] = await Promise.all([
                fetchProblemStatus(client, nm),
                client.student.profile.get(),
                client.student.exam.get().then(
                    () => true,
                    () => false,
                ),
                fetchSubmissionTestcaseAnalysis(client, pageKey, submissionId, testcase),
            ])

            const detailResult = await fetchSubmissionDetail(client, pageKey, submissionId, {
                isAdministrator: user.administrator,
                isExamOrContest,
            })

            if (cancelled) return

            setData(detail)
            setProblemNm(nm)
            setStatus(statusResult)
            setDefaultCompilerId(profile.compiler_id)
            setTestcaseAnalysis(analysis)
            setSubmissionDetail(detailResult)
        })()

        return () => {
            cancelled = true
        }
    }, [authLoading, client, pageKey, submissionId, testcase, user])

    if (authLoading || data === undefined || testcaseAnalysis === undefined || submissionDetail === undefined) {
        return (
            <AuthedGate>
                <p className="py-16 text-center text-muted-foreground">Loading…</p>
            </AuthedGate>
        )
    }

    if (!data || !problemNm || !testcaseAnalysis || !submissionDetail) {
        notFound()
    }

    const submissionHref = `/problems/${pageKey}/submissions/${submissionId}`
    const codeHref = `${submissionHref}/code`
    const diffHref = `${submissionHref}/diffs/${testcase}/diff`

    return (
        <AuthedGate>
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Problems', url: '/problems' },
                        { title: data.problem.problem_nm, url: `/problems/${data.problem.problem_nm}` },
                        { title: data.problem.title, url: `/problems/${pageKey}` },
                        { title: 'Submissions', url: `/problems/${pageKey}/submissions` },
                        { title: submissionId, url: submissionHref },
                        { title: testcase, url: `${submissionHref}/diffs/${testcase}` },
                    ]}
                />
                <ProblemDetail
                    pageKey={pageKey}
                    data={data}
                    status={status ?? undefined}
                    defaultCompilerId={defaultCompilerId}
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
        </AuthedGate>
    )
}
