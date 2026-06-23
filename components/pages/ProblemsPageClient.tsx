'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AuthedGate } from '@/components/auth/AuthGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { ProblemsList } from '@/components/problems/ProblemsList'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import {
    fetchAllAbstractProblems,
    fetchLanguages,
    fetchStudentProblemStatuses,
    type ProblemRow,
} from '@/services/queries/problems'
import type { AbstractStatus, Language } from '@/lib/jutge_api_client'

export function ProblemsPageClient() {
    const router = useRouter()
    const { authenticated, client, languageId, loading: authLoading } = useJutgeAuth()
    const [problems, setProblems] = useState<ProblemRow[]>([])
    const [languages, setLanguages] = useState<Record<string, Language>>({})
    const [statuses, setStatuses] = useState<Record<string, AbstractStatus>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return
        if (!authenticated) {
            router.replace('/problems/public')
            return
        }

        let cancelled = false
        setLoading(true)

        void Promise.all([
            fetchLanguages(client),
            fetchStudentProblemStatuses(client),
            fetchAllAbstractProblems(client, languageId),
        ]).then(([langs, sts, probs]) => {
            if (!cancelled) {
                setLanguages(langs)
                setStatuses(sts)
                setProblems(probs)
                setLoading(false)
            }
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, authenticated, client, languageId, router])

    if (authLoading || !authenticated || loading) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return (
        <AuthedGate>
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs breadcrumbs={[{ title: 'Problems', url: '/problems' }]} />
                <PageTitle section="/problems" authenticated />
                {problems.length === 0 ? (
                    <p className="text-muted-foreground">Could not load problems. Please try again later.</p>
                ) : (
                    <ProblemsList problems={problems} languages={languages} statuses={statuses} />
                )}
            </div>
        </AuthedGate>
    )
}
