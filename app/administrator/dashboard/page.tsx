import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import DashboardView from '@/components/administrator/dashboard'
import { FullWidthBreakout } from '@/components/layout/FullWidthBreakout'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Dashboard — Administrator — Jutge.org' }

export default function AdministratorDashboardPage() {
    return (
        <AdministratorPageClient>
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
        </AdministratorPageClient>
    )
}
