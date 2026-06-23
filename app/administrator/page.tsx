import { AdministratorIndex } from '@/components/administrator/AdministratorIndex'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Administrator — Jutge.org' }

export default function AdministratorPage() {
    return (
        <AdministratorPageClient>
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs breadcrumbs={[{ title: 'Administrator', url: '/administrator' }]} />
                <AdministratorIndex />
            </div>
        </AdministratorPageClient>
    )
}
