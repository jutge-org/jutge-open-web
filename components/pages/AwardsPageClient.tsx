'use client'

import { useEffect, useState } from 'react'

import { AwardsList } from '@/components/awards/AwardsList'
import { AuthedGate } from '@/components/auth/AuthGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { fetchAwardsByType } from '@/services/queries/awards'
import type { AwardTypeSummary } from '@/lib/awards'

export function AwardsPageClient() {
    const { client, loading: authLoading } = useJutgeAuth()
    const [awards, setAwards] = useState<AwardTypeSummary[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        setLoading(true)
        void fetchAwardsByType(client).then((data) => {
            if (!cancelled) {
                setAwards(data)
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
                    <MainBreadcrumbs breadcrumbs={[{ title: 'Awards', url: '/awards' }]} />
                    <PageTitle section="/awards" authenticated />
                    <AwardsList awards={awards} />
                </div>
            )}
        </AuthedGate>
    )
}
