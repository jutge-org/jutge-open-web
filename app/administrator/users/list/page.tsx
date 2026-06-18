import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import UsersListView from '@/components/administrator/users/UsersListView'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'List users — Administrator — Jutge.org' }

export default async function AdministratorUsersListPage() {
    return renderAdministrator(() => (
        <AdministratorPageShell
            breadcrumbs={[
                { title: 'Administrator', url: '/administrator' },
                { title: 'Users', url: '/administrator/users' },
                { title: 'List users', url: '/administrator/users/list' },
            ]}
        >
            <UsersListView />
        </AdministratorPageShell>
    ))
}
