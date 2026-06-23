import type { Metadata } from 'next'

import { ProblemSubmissionsPageClient } from '@/components/pages/ProblemSubmissionsPageClient'
import { getAnonymousServerJutgeClient } from '@/lib/server-request-auth'
import { fetchProblemDetail, resolveProblemId } from '@/services/queries/problemDetail'

type PageProps = {
    params: Promise<{ key: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key } = await params
    const client = await getAnonymousServerJutgeClient()
    const problemId = await resolveProblemId(client, key)
    if (!problemId) {
        return { title: 'Submissions — Jutge.org' }
    }

    const data = await fetchProblemDetail(client, problemId)
    if (!data) {
        return { title: 'Submissions — Jutge.org' }
    }

    return { title: `Submissions — ${data.problem.title} — Jutge.org` }
}

export default async function ProblemSubmissionsPage({ params }: PageProps) {
    const { key } = await params

    return <ProblemSubmissionsPageClient pageKey={key} />
}
