'use client'

import {
    fetchAdminDashboardAll,
    fetchAdminDashboardDatabasesInfo,
    fetchAdminDashboardDockerStatus,
    fetchAdminDashboardFreeDiskSpace,
    fetchAdminDashboardPM2Status,
    fetchAdminDashboardRecentConnectedUsers,
    fetchAdminDashboardRecentLoadAverages,
    fetchAdminDashboardRecentSubmissions,
    fetchAdminDashboardSubmissionsHistograms,
    fetchAdminDashboardUpcomingExams,
    fetchAdminDashboardZombies,
    fetchHomepageStats,
    adminFatalizeIEs,
    adminFatalizePendings,
    adminResubmitIEs,
    adminResubmitPendings,
} from '@/actions/administrator'
import dayjs from 'dayjs'
import { ChartAreaIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { SubmissionsHistograms } from '@/lib/jutge_api_client'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import Loading from '@/components/administrator/dashboard/Loading'
import Widget from '@/components/administrator/dashboard/Widget'

export default function HistogramHourWidget() {
    //

    const [data, setData] = useState<SubmissionsHistograms | null>(null)

    async function fetchData() {
        const data = await fetchAdminDashboardSubmissionsHistograms()
        setData(data)
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 30 * 1000)
        return () => clearInterval(interval)
    }, [])

    let content = <Loading />
    if (data !== null) {
        const info = data.latest_day
            .map((value, index) => ({ hour: index, value: value }))
            .reverse()

        const chartConfig = {
            value: {
                label: 'Submissions',
                color: 'var(--chart-2)',
            },
        } satisfies ChartConfig

        const now = dayjs()

        content = (
            <ChartContainer config={chartConfig} className="aspect-auto h-48 w-full">
                <BarChart accessibilityLayer data={info}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="hour"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => now.subtract(value, 'hour').format('HH:mm')}
                    />
                    <YAxis dataKey="value" tickLine={false} tickMargin={10} axisLine={false} />
                    <Bar dataKey="value" fill="var(--color-value)" radius={2} />
                </BarChart>
            </ChartContainer>
        )
    }

    return (
        <Widget icon=<ChartAreaIcon size={18} /> title="Submissions latest day" content={content} />
    )
}
