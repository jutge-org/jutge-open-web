import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { AwardDetailCard } from '@/components/awards/AwardDetailCard'
import { getCurrentClient } from '@/lib/auth'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchAwardDetail } from '@/services/queries/awards'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const client = await getCurrentClient()
    const award = await fetchAwardDetail(client, decodeURIComponent(id))
    console.log('award', award)

    if (!award) {
        return { title: 'Award — Jutge.org' }
    }

    return { title: `${award.title} — Awards — Jutge.org` }
}

export default async function AwardDetailPage({ params }: PageProps) {
    return renderAuthed(async () => {
        const { id } = await params
        const client = await getCurrentClient()
        const award = await fetchAwardDetail(client, decodeURIComponent(id))

        if (!award) {
            notFound()
        }

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Awards', url: '/awards' },
                        { title: award.title, url: `/awards/${encodeURIComponent(award.award_id)}` },
                    ]}
                />
                <AwardDetailCard award={award} />
            </div>
        )
    })
}
