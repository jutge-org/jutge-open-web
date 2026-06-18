import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import GetSpamUsersView from '@/components/administrator/users/GetSpamUsersView'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Spam users — Administrator — Jutge.org' }

export default async function AdministratorUsersSpamPage() {
    return renderAdministrator(() => (
        <AdministratorPageShell
            breadcrumbs={[
                { title: 'Administrator', url: '/administrator' },
                { title: 'Users', url: '/administrator/users' },
                { title: 'Spam users', url: '/administrator/users/spam' },
            ]}
        >
            <GetSpamUsersView />
        </AdministratorPageShell>
    ))
}
