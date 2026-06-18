import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import StatisticsView from '@/components/administrator/statistics/StatisticsView'
import { FullWidthBreakout } from '@/components/layout/FullWidthBreakout'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Statistics — Administrator — Jutge.org' }

export default async function AdministratorStatisticsPage() {
    return renderAdministrator(() => (
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
    ))
}
