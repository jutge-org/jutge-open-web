import { AdministratorUsersIndex } from '@/components/administrator/AdministratorUsersIndex'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Users — Administrator — Jutge.org' }

export default function AdministratorUsersPage() {
    return (
        <AdministratorPageClient>
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Administrator', url: '/administrator' },
                        { title: 'Users', url: '/administrator/users' },
                    ]}
                />
                <AdministratorUsersIndex />
            </div>
        </AdministratorPageClient>
    )
}
