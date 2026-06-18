import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import InstructorsView from '@/components/administrator/instructors/InstructorsView'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Instructors — Administrator — Jutge.org' }

export default async function AdministratorInstructorsPage() {
    return renderAdministrator(() => (
        <AdministratorPageShell
            breadcrumbs={[
                { title: 'Administrator', url: '/administrator' },
                { title: 'Instructors', url: '/administrator/instructors' },
            ]}
        >
            <InstructorsView />
        </AdministratorPageShell>
    ))
}
