'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { fetchProblemDetail, fetchProblemStatus, resolveProblemId } from '@/services/queries/problemDetail'
import type { ProblemDetailData } from '@/services/queries/problemDetail'
import type { AbstractStatus } from '@/lib/jutge_api_client'

type ProblemDetailPageClientProps = {
    pageKey: string
}

export function ProblemDetailPageClient({ pageKey }: ProblemDetailPageClientProps) {
    const { authenticated, client, loading: authLoading } = useJutgeAuth()
    const [data, setData] = useState<ProblemDetailData | null | undefined>(undefined)
    const [status, setStatus] = useState<AbstractStatus | null | undefined>(undefined)
    const [defaultCompilerId, setDefaultCompilerId] = useState<string | null | undefined>(undefined)

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

            setData(detail)

            if (authenticated) {
                const [statusResult, profile] = await Promise.all([
                    fetchProblemStatus(client, detail.problem.problem_nm),
                    client.student.profile.get(),
                ])
                if (!cancelled) {
                    setStatus(statusResult)
                    setDefaultCompilerId(profile.compiler_id)
                }
            } else {
                setStatus(undefined)
                setDefaultCompilerId(undefined)
            }
        })()

        return () => {
            cancelled = true
        }
    }, [authLoading, authenticated, client, pageKey])

    if (authLoading || data === undefined) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    if (!data) {
        notFound()
    }

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs
                breadcrumbs={[
                    { title: 'Problems', url: '/problems' },
                    { title: data.problem.problem_nm, url: `/problems/${data.problem.problem_nm}` },
                    { title: data.problem.title, url: `/problems/${pageKey}` },
                ]}
            />
            <ProblemDetail
                pageKey={pageKey}
                data={data}
                status={status ?? undefined}
                defaultCompilerId={defaultCompilerId}
            />
        </div>
    )
}
