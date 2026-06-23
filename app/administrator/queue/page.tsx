import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import QueueView from '@/components/administrator/queue/QueueView'
import { FullWidthBreakout } from '@/components/layout/FullWidthBreakout'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Queue — Administrator — Jutge.org' }

export default function AdministratorQueuePage() {
    return (
        <AdministratorPageClient>
            <AdministratorPageShell
                breadcrumbs={[
                    { title: 'Administrator', url: '/administrator' },
                    { title: 'Queue', url: '/administrator/queue' },
                ]}
            >
                <FullWidthBreakout className="px-2">
                    <QueueView />
                </FullWidthBreakout>
            </AdministratorPageShell>
        </AdministratorPageClient>
    )
}
