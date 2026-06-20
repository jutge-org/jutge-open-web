import { SubmissionCodeEditor } from '@/components/submissions/SubmissionCodeEditor'
import { getCurrentClient } from '@/lib/auth'
import { renderAuthed } from '@/lib/renderAuthed'
import { resolveProblemId } from '@/services/queries/problemDetail'
import { fetchSubmissionCode } from '@/services/queries/submissions'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string; submission_id: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key, submission_id } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return { title: `${submission_id} — Jutge.org` }
    }

    return { title: `${problemId} — ${submission_id} — Jutge.org` }
}

export default async function ProblemSubmissionCodeViewPage({ params }: PageProps) {
    const { key, submission_id } = await params

    return renderAuthed(async () => {
        const client = await getCurrentClient()
        const codeData = await fetchSubmissionCode(client, key, submission_id)

        if (!codeData) {
            notFound()
        }

        return <SubmissionCodeEditor code={codeData.code} codeExtension={codeData.codeExtension} />
    })
}
