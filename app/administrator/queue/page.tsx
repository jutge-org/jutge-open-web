import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import QueueView from '@/components/administrator/queue/QueueView'
import { FullWidthBreakout } from '@/components/layout/FullWidthBreakout'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Queue — Administrator — Jutge.org' }

export default async function AdministratorQueuePage() {
    return renderAdministrator(() => (
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
    ))
}
