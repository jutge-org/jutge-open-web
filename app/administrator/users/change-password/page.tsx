import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import ChangePasswordView from '@/components/administrator/users/ChangePasswordView'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Change password — Administrator — Jutge.org' }

export default async function AdministratorUsersChangePasswordPage() {
    return renderAdministrator(() => (
        <AdministratorPageShell
            breadcrumbs={[
                { title: 'Administrator', url: '/administrator' },
                { title: 'Users', url: '/administrator/users' },
                { title: 'Change password', url: '/administrator/users/change-password' },
            ]}
        >
            <ChangePasswordView />
        </AdministratorPageShell>
    ))
}
