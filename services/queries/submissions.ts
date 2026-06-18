import { cache } from 'react'

import { buildSubmissionRow, type SubmissionRow } from '@/lib/submissions'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

import { fetchAllAbstractProblems } from './problems'

export const fetchSubmissionsData = cache(async (client: JutgeApiClient): Promise<SubmissionRow[]> => {
    const [submissions, tables, problems] = await Promise.all([
        client.student.submissions.getAll(),
        client.tables.get(),
        fetchAllAbstractProblems(),
    ])

    const problemTitles = new Map(problems.map((problem) => [problem.problem_nm, problem.title]))
    return submissions.map((submission) => buildSubmissionRow(submission, tables, problemTitles))
})
