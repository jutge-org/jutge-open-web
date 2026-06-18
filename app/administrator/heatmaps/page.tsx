import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import HeatmapsView from '@/components/administrator/heatmaps/HeatmapsView'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Heatmaps — Administrator — Jutge.org' }

export default async function AdministratorHeatmapsPage() {
    return renderAdministrator(() => (
        <AdministratorPageShell
            breadcrumbs={[
                { title: 'Administrator', url: '/administrator' },
                { title: 'Heatmaps', url: '/administrator/heatmaps' },
            ]}
        >
            <HeatmapsView />
        </AdministratorPageShell>
    ))
}
