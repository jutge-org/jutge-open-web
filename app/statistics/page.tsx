import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { StatisticsDashboard } from '@/components/statistics/StatisticsDashboard'
import { getCurrentClient } from '@/lib/auth'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchStatisticsData } from '@/services/queries/statistics'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Statistics — Jutge.org' }

export default async function StatisticsPage() {
    return renderAuthed(async () => {
        const client = await getCurrentClient()
        const data = await fetchStatisticsData(client)

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs breadcrumbs={[{ title: 'Statistics', url: '/statistics' }]} />
                <PageTitle section="/statistics" authenticated />
                <StatisticsDashboard data={data} />
            </div>
        )
    })
}
