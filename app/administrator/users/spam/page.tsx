import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import GetSpamUsersView from '@/components/administrator/users/GetSpamUsersView'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Spam users — Administrator — Jutge.org' }

export default function AdministratorUsersSpamPage() {
    return (
        <AdministratorPageClient>
            <AdministratorPageShell
                breadcrumbs={[
                    { title: 'Administrator', url: '/administrator' },
                    { title: 'Users', url: '/administrator/users' },
                    { title: 'Spam users', url: '/administrator/users/spam' },
                ]}
            >
                <GetSpamUsersView />
            </AdministratorPageShell>
        </AdministratorPageClient>
    )
}
