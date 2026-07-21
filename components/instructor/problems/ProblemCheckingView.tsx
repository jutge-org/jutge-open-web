'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { SubmissionsList } from '@/components/submissions/SubmissionsList'
import { fetchProblemSubmissionsRowsAction } from '@/lib/data/submissionsActions'
import type { ProblemSubmissionRow } from '@/lib/submissions'

const PROBLEM_CHECKER_ANNOTATION_PREFIX = 'problem-checker'

function isProblemCheckerSubmission(row: ProblemSubmissionRow): boolean {
    return row.annotation?.startsWith(PROBLEM_CHECKER_ANNOTATION_PREFIX) ?? false
}

async function fetchProblemCheckerSubmissions(problem_nm: string): Promise<ProblemSubmissionRow[]> {
    const rows = await fetchProblemSubmissionsRowsAction(problem_nm)
    return rows.filter(isProblemCheckerSubmission)
}

export function ProblemCheckingView() {
    const { problem_nm } = useParams<{ problem_nm: string }>()
    const [rows, setRows] = useState<ProblemSubmissionRow[] | null>(null)

    useEffect(() => {
        let cancelled = false
        setRows(null)

        void fetchProblemCheckerSubmissions(problem_nm).then((data) => {
            if (!cancelled) setRows(data)
        })

        return () => {
            cancelled = true
        }
    }, [problem_nm])

    if (rows === null) {
        return <SubmissionsList rows={[]} variant="problem" problemNm={problem_nm} loading />
    }

    return (
        <SubmissionsList
            rows={rows}
            variant="problem"
            problemNm={problem_nm}
            onRefreshPending={() => fetchProblemCheckerSubmissions(problem_nm)}
            emptyMessage="No problem-checker submissions for this problem."
        />
    )
}
