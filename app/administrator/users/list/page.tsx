import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import UsersListView from '@/components/administrator/users/UsersListView'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'List users — Administrator — Jutge.org' }

export default function AdministratorUsersListPage() {
    return (
        <AdministratorPageClient>
            <AdministratorPageShell
                breadcrumbs={[
                    { title: 'Administrator', url: '/administrator' },
                    { title: 'Users', url: '/administrator/users' },
                    { title: 'List users', url: '/administrator/users/list' },
                ]}
            >
                <UsersListView />
            </AdministratorPageShell>
        </AdministratorPageClient>
    )
}
