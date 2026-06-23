import type { Metadata } from 'next'

import { ProblemSubmissionTestcasePageClient } from '@/components/pages/ProblemSubmissionTestcasePageClient'
import { getAnonymousServerJutgeClient } from '@/lib/server-request-auth'
import { fetchProblemDetail, resolveProblemId } from '@/services/queries/problemDetail'

type PageProps = {
    params: Promise<{ key: string; submission_id: string; testcase: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key, submission_id, testcase } = await params
    const client = await getAnonymousServerJutgeClient()
    const problemId = await resolveProblemId(client, key)
    if (!problemId) {
        return { title: 'Test case analysis — Jutge.org' }
    }

    const data = await fetchProblemDetail(client, problemId)
    if (!data) {
        return { title: 'Test case analysis — Jutge.org' }
    }

    return { title: `${testcase} — ${submission_id} — ${data.problem.title} — Jutge.org` }
}

export default async function ProblemSubmissionTestcaseAnalysisPage({ params }: PageProps) {
    const { key, submission_id, testcase } = await params

    return (
        <ProblemSubmissionTestcasePageClient
            pageKey={key}
            submissionId={submission_id}
            testcase={testcase}
        />
    )
}
