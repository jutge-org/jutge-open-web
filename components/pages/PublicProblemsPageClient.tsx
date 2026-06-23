'use client'

import { useEffect, useState } from 'react'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { ProblemsList } from '@/components/problems/ProblemsList'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { fetchAllAbstractProblems, fetchLanguages, type ProblemRow } from '@/services/queries/problems'
import type { Language } from '@/lib/jutge_api_client'

export function PublicProblemsPageClient() {
    const { authenticated, client, languageId, loading: authLoading } = useJutgeAuth()
    const [problems, setProblems] = useState<ProblemRow[]>([])
    const [languages, setLanguages] = useState<Record<string, Language>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        setLoading(true)

        void Promise.all([fetchLanguages(client), fetchAllAbstractProblems(client, languageId)]).then(
            ([langs, probs]) => {
                if (!cancelled) {
                    setLanguages(langs)
                    setProblems(probs)
                    setLoading(false)
                }
            },
        )

        return () => {
            cancelled = true
        }
    }, [authLoading, client, languageId])

    if (authLoading || loading) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Problems', url: '/problems/public' }]} />
            <PageTitle
                section="/problems"
                authenticated={authenticated}
                hidden={false}
                description={authenticated ? 'Browse public problems available' : undefined}
            />
            {problems.length === 0 ? (
                <p className="text-muted-foreground">Could not load problems. Please try again later.</p>
            ) : (
                <ProblemsList problems={problems} languages={languages} />
            )}
        </div>
    )
}
