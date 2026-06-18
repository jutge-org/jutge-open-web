import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Administrator — Jutge.org' }

export default async function AdministratorPage() {
    return renderAdministrator(() => (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Administrator', url: '/administrator' }]} />
            <PageTitle section="/administrator" authenticated />
            <p className="text-muted-foreground">Coming soon.</p>
        </div>
    ))
}
