import { SubmissionTestcaseDiffEditor } from '@/components/submissions/SubmissionTestcaseDiffEditor'
import { getCurrentClient } from '@/lib/auth'
import { renderAuthed } from '@/lib/renderAuthed'
import { resolveProblemId } from '@/services/queries/problemDetail'
import { fetchSubmissionTestcaseAnalysis } from '@/services/queries/submissions'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string; submission_id: string; testcase: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key, submission_id, testcase } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return { title: `${testcase} — ${submission_id} — Jutge.org` }
    }

    return { title: `${testcase} — ${problemId} — ${submission_id} — Jutge.org` }
}

export default async function ProblemSubmissionTestcaseDiffViewPage({ params }: PageProps) {
    const { key, submission_id, testcase } = await params

    return renderAuthed(async () => {
        const client = await getCurrentClient()
        const analysis = await fetchSubmissionTestcaseAnalysis(client, key, submission_id, testcase)

        if (!analysis) {
            notFound()
        }

        return (
            <SubmissionTestcaseDiffEditor
                input={analysis.input}
                output={analysis.output}
                expected={analysis.expected}
                outputImageSrc={analysis.outputImageSrc}
                expectedImageSrc={analysis.expectedImageSrc}
            />
        )
    })
}
