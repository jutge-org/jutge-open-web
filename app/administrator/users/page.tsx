import { AdministratorUsersIndex } from '@/components/administrator/AdministratorUsersIndex'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Users — Administrator — Jutge.org' }

export default async function AdministratorUsersPage() {
    return renderAdministrator(() => (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs
                breadcrumbs={[
                    { title: 'Administrator', url: '/administrator' },
                    { title: 'Users', url: '/administrator/users' },
                ]}
            />
            <AdministratorUsersIndex />
        </div>
    ))
}
