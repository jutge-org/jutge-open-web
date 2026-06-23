'use client'

import { useEffect, useState } from 'react'

import { AuthedGate } from '@/components/auth/AuthGates'
import { ExamsList } from '@/components/exams/ExamsList'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { fetchExamsData } from '@/services/queries/exams'
import type { ExamRow } from '@/lib/exams'

export function ExamsPageClient() {
    const { client, loading: authLoading } = useJutgeAuth()
    const [rows, setRows] = useState<ExamRow[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        setLoading(true)
        void fetchExamsData(client).then((data) => {
            if (!cancelled) {
                setRows(data)
                setLoading(false)
            }
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client])

    return (
        <AuthedGate>
            {authLoading || loading ? (
                <p className="py-16 text-center text-muted-foreground">Loading…</p>
            ) : (
                <div className="flex flex-col gap-6">
                    <MainBreadcrumbs breadcrumbs={[{ title: 'Exams', url: '/exams' }]} />
                    <PageTitle section="/exams" authenticated />
                    <ExamsList rows={rows} />
                </div>
            )}
        </AuthedGate>
    )
}
