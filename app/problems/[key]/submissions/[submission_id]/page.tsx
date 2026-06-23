import type { Metadata } from 'next'

import { ProblemSubmissionDetailPageClient } from '@/components/pages/ProblemSubmissionDetailPageClient'
import { getAnonymousServerJutgeClient } from '@/lib/server-request-auth'
import { fetchProblemDetail, resolveProblemId } from '@/services/queries/problemDetail'

type PageProps = {
    params: Promise<{ key: string; submission_id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key, submission_id } = await params
    const client = await getAnonymousServerJutgeClient()
    const problemId = await resolveProblemId(client, key)
    if (!problemId) {
        return { title: 'Submission — Jutge.org' }
    }

    const data = await fetchProblemDetail(client, problemId)
    if (!data) {
        return { title: 'Submission — Jutge.org' }
    }

    return { title: `${submission_id} — ${data.problem.title} — Jutge.org` }
}

export default async function ProblemSubmissionDetailPage({ params }: PageProps) {
    const { key, submission_id } = await params

    return <ProblemSubmissionDetailPageClient pageKey={key} submissionId={submission_id} />
}
