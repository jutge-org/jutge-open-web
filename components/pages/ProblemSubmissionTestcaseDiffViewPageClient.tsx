'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import { AuthedGate } from '@/components/auth/AuthGates'
import { SubmissionTestcaseDiffEditor } from '@/components/submissions/SubmissionTestcaseDiffEditor'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { fetchSubmissionTestcaseAnalysis, type SubmissionTestcaseAnalysisData } from '@/services/queries/submissions'

type ProblemSubmissionTestcaseDiffViewPageClientProps = {
    pageKey: string
    submissionId: string
    testcase: string
}

export function ProblemSubmissionTestcaseDiffViewPageClient({
    pageKey,
    submissionId,
    testcase,
}: ProblemSubmissionTestcaseDiffViewPageClientProps) {
    const { client, loading: authLoading } = useJutgeAuth()
    const [analysis, setAnalysis] = useState<SubmissionTestcaseAnalysisData | null | undefined>(undefined)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        void fetchSubmissionTestcaseAnalysis(client, pageKey, submissionId, testcase).then((data) => {
            if (!cancelled) {
                setAnalysis(data)
            }
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client, pageKey, submissionId, testcase])

    if (authLoading || analysis === undefined) {
        return (
            <AuthedGate>
                <p className="py-16 text-center text-muted-foreground">Loading…</p>
            </AuthedGate>
        )
    }

    if (!analysis) {
        notFound()
    }

    return (
        <AuthedGate>
            <SubmissionTestcaseDiffEditor
                input={analysis.input}
                output={analysis.output}
                expected={analysis.expected}
                outputImageSrc={analysis.outputImageSrc}
                expectedImageSrc={analysis.expectedImageSrc}
            />
        </AuthedGate>
    )
}
