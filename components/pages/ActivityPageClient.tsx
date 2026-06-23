'use client'

import { useEffect, useState } from 'react'

import { AuthedGate } from '@/components/auth/AuthGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { StatisticsDashboard } from '@/components/statistics/StatisticsDashboard'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { fetchStatisticsData, type StatisticsData } from '@/services/queries/statistics'

export function ActivityPageClient() {
    const { authenticated, client, loading: authLoading } = useJutgeAuth()
    const [data, setData] = useState<StatisticsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading || !authenticated) return

        let cancelled = false
        setLoading(true)
        void fetchStatisticsData(client)
            .then((result) => {
                if (!cancelled) {
                    setData(result)
                    setLoading(false)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setData(null)
                    setLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [authLoading, authenticated, client])

    return (
        <AuthedGate>
            {authLoading || loading || !data ? (
                <p className="py-16 text-center text-muted-foreground">Loading…</p>
            ) : (
                <div className="flex flex-col gap-6">
                    <MainBreadcrumbs breadcrumbs={[{ title: 'Activity', url: '/activity' }]} />
                    <PageTitle section="/activity" authenticated hidden={false} />
                    <StatisticsDashboard data={data} />
                </div>
            )}
        </AuthedGate>
    )
}
