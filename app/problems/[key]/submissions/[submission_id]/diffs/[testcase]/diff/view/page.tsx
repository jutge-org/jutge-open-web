import type { Metadata } from 'next'

import { ProblemSubmissionTestcaseDiffViewPageClient } from '@/components/pages/ProblemSubmissionTestcaseDiffViewPageClient'
import { getAnonymousServerJutgeClient } from '@/lib/server-request-auth'
import { resolveProblemId } from '@/services/queries/problemDetail'

type PageProps = {
    params: Promise<{ key: string; submission_id: string; testcase: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key, submission_id, testcase } = await params
    const client = await getAnonymousServerJutgeClient()
    const problemId = await resolveProblemId(client, key)
    if (!problemId) {
        return { title: `${testcase} — ${submission_id} — Jutge.org` }
    }

    return { title: `${testcase} — ${problemId} — ${submission_id} — Jutge.org` }
}

export default async function ProblemSubmissionTestcaseDiffViewPage({ params }: PageProps) {
    const { key, submission_id, testcase } = await params

    return (
        <ProblemSubmissionTestcaseDiffViewPageClient
            pageKey={key}
            submissionId={submission_id}
            testcase={testcase}
        />
    )
}
