'use client'

import { AdministratorIndex } from '@/components/administrator/AdministratorIndex'
import { AdministratorGate } from '@/components/ClientGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'

export default function AdministratorPage() {
    return (
        <AdministratorGate>
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs breadcrumbs={[{ title: 'Administrator', url: '/administrator' }]} />
                <AdministratorIndex />
            </div>
        </AdministratorGate>
    )
}
