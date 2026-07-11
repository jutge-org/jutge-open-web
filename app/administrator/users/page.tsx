'use client'

import { AdministratorGate } from '@/components/ClientGates'
import { AdministratorUsersIndex } from '@/components/administrator/AdministratorUsersIndex'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'

export default function AdministratorUsersPage() {
    return (
        <AdministratorGate>
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Administrator', url: '/administrator' },
                        { title: 'Users', url: '/administrator/users' },
                    ]}
                />
                <AdministratorUsersIndex />
            </div>
        </AdministratorGate>
    )
}
