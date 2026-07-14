import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { AwardsList } from '@/components/awards/AwardsList'
import { getCurrentClient } from '@/lib/auth'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchAwardsByType } from '@/services/queries/awards'

export const metadata = { title: 'Awards — Jutge.org' }

export default async function AwardsPage() {
    return renderAuthed(async () => {
        const client = await getCurrentClient()
        const awards = await fetchAwardsByType(client)

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs breadcrumbs={[{ title: 'Awards', url: '/awards' }]} />
                <PageTitle section="/awards" authenticated />
                <AwardsList awards={awards} />
            </div>
        )
    })
}
