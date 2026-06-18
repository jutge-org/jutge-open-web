import { AdministratorIndex } from '@/components/administrator/AdministratorIndex'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Administrator — Jutge.org' }

export default async function AdministratorPage() {
    return renderAdministrator(() => (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Administrator', url: '/administrator' }]} />
            <AdministratorIndex />
        </div>
    ))
}
