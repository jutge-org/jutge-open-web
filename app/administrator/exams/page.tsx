import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import ExamsView from '@/components/administrator/exams/ExamsView'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Exams — Administrator — Jutge.org' }

export default async function AdministratorExamsPage() {
    return renderAdministrator(() => (
        <AdministratorPageShell
            breadcrumbs={[
                { title: 'Administrator', url: '/administrator' },
                { title: 'Exams', url: '/administrator/exams' },
            ]}
        >
            <ExamsView />
        </AdministratorPageShell>
    ))
}
