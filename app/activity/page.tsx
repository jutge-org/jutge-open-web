'use client'

import { useEffect, useState } from 'react'

import { AuthedGate } from '@/components/ClientGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { StatisticsDashboard } from '@/components/statistics/StatisticsDashboard'
import { fetchStatisticsData, type StatisticsData } from '@/lib/data/statistics'
import jutge from '@/lib/jutge'

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
