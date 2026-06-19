import { cache } from 'react'

import { parseProblemKey } from '@/lib/problems'
import { buildSubmissionRow, type SubmissionRow } from '@/lib/submissions'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

import { abstractProblemsToTitleMap } from './problems'

function submissionProblemNms(submissions: { problem_id: string }[]): string[] {
    const nms = new Set<string>()

    for (const submission of submissions) {
        const parsed = parseProblemKey(submission.problem_id)
        if (parsed.kind === 'problem_id' || parsed.kind === 'problem_nm') {
            nms.add(parsed.problem_nm)
        }
    }

    return [...nms].sort()
}

export const fetchSubmissionsData = cache(async (client: JutgeApiClient): Promise<SubmissionRow[]> => {
    const [submissions, tables] = await Promise.all([client.student.submissions.getAll(), client.tables.get()])

    const problemNms = submissionProblemNms(submissions)
    let problemTitles = new Map<string, string>()

    if (problemNms.length > 0) {
        try {
            const abstractProblems = await client.problems.getAbstractProblems(problemNms.join(','))
            problemTitles = abstractProblemsToTitleMap(abstractProblems)
        } catch {
            // Titles fall back to the problem id in buildSubmissionRow.
        }
    }

    return submissions.map((submission) => buildSubmissionRow(submission, tables, problemTitles))
})
