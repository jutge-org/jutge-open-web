'use client'

import { useEffect, useState } from 'react'

import { AuthedGate } from '@/components/ClientGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { StatisticsDashboard } from '@/components/statistics/StatisticsDashboard'
import jutge from '@/lib/jutge'
import { fetchStatisticsData, type StatisticsData } from '@/lib/data/statistics'

export default function ActivityPage() {
    return (
        <AuthedGate>
            <ActivityPageContent />
        </AuthedGate>
    )
}

function ActivityPageContent() {
    const [data, setData] = useState<StatisticsData | null>(null)

    useEffect(() => {
        void fetchStatisticsData(jutge).then(setData)
    }, [])

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Activity', url: '/activity' }]} />
            <StatisticsDashboard data={data} />
        </div>
    )
}
