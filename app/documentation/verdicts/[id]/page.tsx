import { DocumentationPageShell } from '@/components/documentation/DocumentationPageShell'
import { VerdictDetail } from '@/components/documentation/VerdictDetail'
import { fetchVerdicts } from '@/services/queries/tables'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const verdicts = await fetchVerdicts()
    const verdict = verdicts.find((v) => v.verdict_id === id)
    if (!verdict) return { title: 'Verdict — Documentation — Jutge.org' }
    return { title: `${verdict.verdict_id} — Verdicts — Documentation — Jutge.org` }
}

export default async function DocumentationVerdictDetailPage({ params }: PageProps) {
    const { id } = await params
    const verdicts = await fetchVerdicts()
    const verdict = verdicts.find((v) => v.verdict_id === id)

    if (!verdict) notFound()

    return (
        <DocumentationPageShell
            activeTab="verdicts"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Verdicts', url: '/documentation/verdicts' },
                { title: verdict.verdict_id, url: `/documentation/verdicts/${id}` },
            ]}
        >
            <VerdictDetail verdict={verdict} />
        </DocumentationPageShell>
    )
}
