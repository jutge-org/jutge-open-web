import type { Metadata } from 'next'

import { ProblemSubmissionCodeViewPageClient } from '@/components/pages/ProblemSubmissionCodeViewPageClient'
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
        return { title: `${submission_id} — Jutge.org` }
    }

    const data = await fetchProblemDetail(client, problemId)
    if (!data) {
        return { title: `${submission_id} — Jutge.org` }
    }

    return {
        title: `${data.problem.problem_nm} - ${submission_id} — Jutge.org`,
    }
}

export default async function ProblemSubmissionCodeViewPage({ params }: PageProps) {
    const { key, submission_id } = await params

    return <ProblemSubmissionCodeViewPageClient pageKey={key} submissionId={submission_id} />
}
