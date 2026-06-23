import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import RankingView from '@/components/administrator/ranking/RankingView'
import { AdministratorPageClient } from '@/components/pages/AdministratorPageClient'

export const metadata = { title: 'Ranking — Administrator — Jutge.org' }

export default function AdministratorRankingPage() {
    return (
        <AdministratorPageClient>
            <AdministratorPageShell
                breadcrumbs={[
                    { title: 'Administrator', url: '/administrator' },
                    { title: 'Ranking', url: '/administrator/ranking' },
                ]}
            >
                <RankingView />
            </AdministratorPageShell>
        </AdministratorPageClient>
    )
}
