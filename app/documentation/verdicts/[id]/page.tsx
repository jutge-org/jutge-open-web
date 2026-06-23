import type { Metadata } from 'next'

import { DocumentationVerdictDetailPageClient } from '@/components/pages/DocumentationCompilersPageClient'
import { getAnonymousServerJutgeClient } from '@/lib/server-request-auth'
import { fetchVerdicts } from '@/services/queries/tables'

type PageProps = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const client = await getAnonymousServerJutgeClient()
    const verdicts = await fetchVerdicts(client)
    const verdict = verdicts.find((v) => v.verdict_id === id)
    if (!verdict) return { title: 'Verdict — Documentation — Jutge.org' }
    return { title: `${verdict.verdict_id} — Verdicts — Documentation — Jutge.org` }
}

export default async function DocumentationVerdictDetailPage({ params }: PageProps) {
    const { id } = await params

    return <DocumentationVerdictDetailPageClient verdictId={id} />
}
