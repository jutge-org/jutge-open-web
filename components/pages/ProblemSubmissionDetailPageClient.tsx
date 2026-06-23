'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import { AuthedGate } from '@/components/auth/AuthGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { SubmissionDetailView } from '@/components/submissions/SubmissionDetailView'
import { SubmissionPendingRefresh } from '@/components/submissions/SubmissionPendingRefresh'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { parseProblemKey } from '@/lib/problems'
import { buildSubmissionNavLinks, type SubmissionNavLinks } from '@/lib/submissions'
import { fetchProblemDetail, fetchProblemStatus, resolveProblemId } from '@/services/queries/problemDetail'
import type { ProblemDetailData } from '@/services/queries/problemDetail'
import { fetchSubmissionDetail } from '@/services/queries/submissions'
import type { SubmissionDetailData } from '@/services/queries/submissions'
import type { AbstractStatus } from '@/lib/jutge_api_client'

type ProblemSubmissionDetailPageClientProps = {
    pageKey: string
    submissionId: string
}

export function ProblemSubmissionDetailPageClient({
    pageKey,
    submissionId,
}: ProblemSubmissionDetailPageClientProps) {
    const { client, user, loading: authLoading } = useJutgeAuth()
    const [data, setData] = useState<ProblemDetailData | null | undefined>(undefined)
    const [problemNm, setProblemNm] = useState<string | null>(null)
    const [status, setStatus] = useState<AbstractStatus | null>(null)
    const [defaultCompilerId, setDefaultCompilerId] = useState<string | null | undefined>(undefined)
    const [submissionDetail, setSubmissionDetail] = useState<SubmissionDetailData | null | undefined>(undefined)
    const [navigation, setNavigation] = useState<SubmissionNavLinks | null>(null)

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

            const [statusResult, profile, isExamOrContest, problemSubmissions] = await Promise.all([
                fetchProblemStatus(client, nm),
                client.student.profile.get(),
                client.student.exam.get().then(
                    () => true,
                    () => false,
                ),
                client.student.submissions.getForAbstractProblems(nm),
            ])

            const detailResult = await fetchSubmissionDetail(client, pageKey, submissionId, {
                isAdministrator: user.administrator,
                isExamOrContest,
            })

            if (cancelled) return

            if (!detailResult) {
                setSubmissionDetail(null)
                setData(detail)
                setProblemNm(nm)
                return
            }

            setData(detail)
            setProblemNm(nm)
            setStatus(statusResult)
            setDefaultCompilerId(profile.compiler_id)
            setSubmissionDetail(detailResult)
            setNavigation(buildSubmissionNavLinks(problemSubmissions, submissionId, pageKey))
        })()

        return () => {
            cancelled = true
        }
    }, [authLoading, client, pageKey, submissionId, user])

    if (authLoading || data === undefined || submissionDetail === undefined) {
        return (
            <AuthedGate>
                <p className="py-16 text-center text-muted-foreground">Loading…</p>
            </AuthedGate>
        )
    }

    if (!data || !problemNm || !submissionDetail) {
        notFound()
    }

    const submissionHref = `/problems/${pageKey}/submissions/${submissionId}`
    const codeHref = `${submissionHref}/code`

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
                    <SubmissionPendingRefresh isPending={submissionDetail.verdict === 'Pending'} />
                    <SubmissionDetailView
                        data={submissionDetail}
                        codeHref={codeHref}
                        problemKey={pageKey}
                        navigation={navigation}
                    />
                </ProblemDetail>
            </div>
        </AuthedGate>
    )
}
