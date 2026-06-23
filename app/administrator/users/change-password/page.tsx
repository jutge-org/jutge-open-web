import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import ChangePasswordView from '@/components/administrator/users/ChangePasswordView'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Change password — Administrator — Jutge.org' }

export default function AdministratorUsersChangePasswordPage() {
    return (
        <AdministratorPageClient>
            <AdministratorPageShell
                breadcrumbs={[
                    { title: 'Administrator', url: '/administrator' },
                    { title: 'Users', url: '/administrator/users' },
                    { title: 'Change password', url: '/administrator/users/change-password' },
                ]}
            >
                <ChangePasswordView />
            </AdministratorPageShell>
        </AdministratorPageClient>
    )
}
