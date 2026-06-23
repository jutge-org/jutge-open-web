'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import { AuthedGate } from '@/components/auth/AuthGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { SubmissionsList } from '@/components/submissions/SubmissionsList'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { parseProblemKey } from '@/lib/problems'
import type { ProblemSubmissionRow } from '@/lib/submissions'
import { fetchProblemDetail, fetchProblemStatus, resolveProblemId } from '@/services/queries/problemDetail'
import type { ProblemDetailData } from '@/services/queries/problemDetail'
import { fetchProblemSubmissionsData } from '@/services/queries/submissions'
import type { AbstractStatus } from '@/lib/jutge_api_client'

type ProblemSubmissionsPageClientProps = {
    pageKey: string
}

export function ProblemSubmissionsPageClient({ pageKey }: ProblemSubmissionsPageClientProps) {
    const { client, loading: authLoading } = useJutgeAuth()
    const [data, setData] = useState<ProblemDetailData | null | undefined>(undefined)
    const [problemNm, setProblemNm] = useState<string | null>(null)
    const [status, setStatus] = useState<AbstractStatus | null>(null)
    const [defaultCompilerId, setDefaultCompilerId] = useState<string | null | undefined>(undefined)
    const [rows, setRows] = useState<ProblemSubmissionRow[]>([])

    useEffect(() => {
        if (authLoading) return

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
            const languageTitles = new Map(detail.languageVariants.map((v) => [v.problem_id, v.title]))

            const [statusResult, profile, submissionRows] = await Promise.all([
                fetchProblemStatus(client, nm),
                client.student.profile.get(),
                fetchProblemSubmissionsData(client, nm, languageTitles),
            ])

            if (cancelled) return

            setData(detail)
            setProblemNm(nm)
            setStatus(statusResult)
            setDefaultCompilerId(profile.compiler_id)
            setRows(submissionRows)
        })()

        return () => {
            cancelled = true
        }
    }, [authLoading, client, pageKey])

    if (authLoading || data === undefined) {
        return (
            <AuthedGate>
                <p className="py-16 text-center text-muted-foreground">Loading…</p>
            </AuthedGate>
        )
    }

    if (!data || !problemNm) {
        notFound()
    }

    return (
        <AuthedGate>
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Problems', url: '/problems' },
                        { title: data.problem.problem_nm, url: `/problems/${data.problem.problem_nm}` },
                        { title: data.problem.title, url: `/problems/${pageKey}` },
                        { title: 'Submissions', url: `/problems/${pageKey}/submissions` },
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
                    <SubmissionsList rows={rows} variant="problem" problemNm={problemNm} />
                </ProblemDetail>
            </div>
        </AuthedGate>
    )
}
