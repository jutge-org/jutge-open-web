import type { Metadata } from 'next'

import { ProblemDetailPageClient } from '@/components/pages/ProblemDetailPageClient'
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
        return { title: 'Problem — Jutge.org' }
    }

    const data = await fetchProblemDetail(client, problemId)
    if (!data) {
        return { title: 'Problem — Jutge.org' }
    }

    return { title: `${data.problem.title} — Problems — Jutge.org` }
}

export default async function ProblemPage({ params }: PageProps) {
    const { key } = await params

    return <ProblemDetailPageClient pageKey={key} />
}
