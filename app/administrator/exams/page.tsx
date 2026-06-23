import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import ExamsView from '@/components/administrator/exams/ExamsView'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Exams — Administrator — Jutge.org' }

export default function AdministratorExamsPage() {
    return (
        <AdministratorPageClient>
            <AdministratorPageShell
                breadcrumbs={[
                    { title: 'Administrator', url: '/administrator' },
                    { title: 'Exams', url: '/administrator/exams' },
                ]}
            >
                <ExamsView />
            </AdministratorPageShell>
        </AdministratorPageClient>
    )
}
