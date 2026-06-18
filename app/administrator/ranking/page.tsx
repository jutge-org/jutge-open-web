import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import RankingView from '@/components/administrator/ranking/RankingView'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Ranking — Administrator — Jutge.org' }

export default async function AdministratorRankingPage() {
    return renderAdministrator(() => (
        <AdministratorPageShell
            breadcrumbs={[
                { title: 'Administrator', url: '/administrator' },
                { title: 'Ranking', url: '/administrator/ranking' },
            ]}
        >
            <RankingView />
        </AdministratorPageShell>
    ))
}
