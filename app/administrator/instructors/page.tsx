import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import InstructorsView from '@/components/administrator/instructors/InstructorsView'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Instructors — Administrator — Jutge.org' }

export default function AdministratorInstructorsPage() {
    return (
        <AdministratorPageClient>
            <AdministratorPageShell
                breadcrumbs={[
                    { title: 'Administrator', url: '/administrator' },
                    { title: 'Instructors', url: '/administrator/instructors' },
                ]}
            >
                <InstructorsView />
            </AdministratorPageShell>
        </AdministratorPageClient>
    )
}
