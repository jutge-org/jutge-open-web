'use client'

import { useEffect, useState } from 'react'

import { AuthedGate } from '@/components/auth/AuthGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { SubmissionsList } from '@/components/submissions/SubmissionsList'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { fetchSubmissionsData } from '@/services/queries/submissions'
import type { SubmissionRow } from '@/lib/submissions'

export function SubmissionsPageClient() {
    const { authenticated, client, languageId, loading: authLoading } = useJutgeAuth()
    const [rows, setRows] = useState<SubmissionRow[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading || !authenticated) return

        let cancelled = false
        setLoading(true)
        void fetchSubmissionsData(client, languageId)
            .then((data) => {
                if (!cancelled) {
                    setRows(data)
                    setLoading(false)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setRows([])
                    setLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [authLoading, authenticated, client, languageId])

    return (
        <AuthedGate>
            {authLoading || loading ? (
                <p className="py-16 text-center text-muted-foreground">Loading…</p>
            ) : (
                <div className="flex flex-col gap-6">
                    <MainBreadcrumbs breadcrumbs={[{ title: 'Submissions', url: '/submissions' }]} />
                    <PageTitle section="/submissions" authenticated />
                    <SubmissionsList rows={rows} />
                </div>
            )}
        </AuthedGate>
    )
}
