import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import StatisticsView from '@/components/administrator/statistics/StatisticsView'
import { FullWidthBreakout } from '@/components/layout/FullWidthBreakout'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Statistics — Administrator — Jutge.org' }

export default function AdministratorStatisticsPage() {
    return (
        <AdministratorPageClient>
            <AdministratorPageShell
                breadcrumbs={[
                    { title: 'Administrator', url: '/administrator' },
                    { title: 'Statistics', url: '/administrator/statistics' },
                ]}
            >
                <FullWidthBreakout className="px-2">
                    <StatisticsView />
                </FullWidthBreakout>
            </AdministratorPageShell>
        </AdministratorPageClient>
    )
}
