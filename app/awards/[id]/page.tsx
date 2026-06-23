import type { Metadata } from 'next'

import { AwardDetailPageClient } from '@/components/pages/AwardDetailPageClient'
import { getServerJutgeClient } from '@/lib/server-request-auth'
import { fetchAwardDetail } from '@/services/queries/awards'

type PageProps = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params

    try {
        const client = await getServerJutgeClient()
        if (!client) {
            return { title: 'Award — Jutge.org' }
        }

        const award = await fetchAwardDetail(client, decodeURIComponent(id))
        if (!award) {
            return { title: 'Award — Jutge.org' }
        }

        return { title: `${award.title} — Awards — Jutge.org` }
    } catch {
        return { title: 'Award — Jutge.org' }
    }
}

export default async function AwardDetailPage({ params }: PageProps) {
    const { id } = await params

    return <AwardDetailPageClient awardId={decodeURIComponent(id)} />
}
