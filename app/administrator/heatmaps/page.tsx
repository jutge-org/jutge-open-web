import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import HeatmapsView from '@/components/administrator/heatmaps/HeatmapsView'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Heatmaps — Administrator — Jutge.org' }

export default function AdministratorHeatmapsPage() {
    return (
        <AdministratorPageClient>
            <AdministratorPageShell
                breadcrumbs={[
                    { title: 'Administrator', url: '/administrator' },
                    { title: 'Heatmaps', url: '/administrator/heatmaps' },
                ]}
            >
                <HeatmapsView />
            </AdministratorPageShell>
        </AdministratorPageClient>
    )
}
