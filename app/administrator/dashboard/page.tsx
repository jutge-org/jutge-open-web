import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import DashboardView from '@/components/administrator/dashboard'
import { FullWidthBreakout } from '@/components/layout/FullWidthBreakout'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Dashboard — Administrator — Jutge.org' }

export default async function AdministratorDashboardPage() {
    return renderAdministrator(() => (
        <AdministratorPageShell
            breadcrumbs={[
                { title: 'Administrator', url: '/administrator' },
                { title: 'Dashboard', url: '/administrator/dashboard' },
            ]}
        >
            <FullWidthBreakout className="px-2">
                <DashboardView />
            </FullWidthBreakout>
        </AdministratorPageShell>
    ))
}
