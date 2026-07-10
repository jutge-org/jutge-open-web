import { parseProblemKey } from '@/lib/problems'
import type { AbstractStatus, CourseSubmission } from '@/lib/jutge_api_client'

export function problemNmFromCourseSubmission(submission: CourseSubmission): string | null {
    const parsed = parseProblemKey(submission.problem_id)
    if (parsed.kind === 'problem_id' || parsed.kind === 'problem_nm') {
        return parsed.problem_nm
    }
    return null
}

function buildAbstractStatus(problem_nm: string, submissions: CourseSubmission[]): AbstractStatus {
    const nb_accepted_submissions = submissions.filter((submission) => submission.verdict === 'AC').length
    const nb_scored_submissions = submissions.filter((submission) => submission.verdict === 'SC').length
    const nb_pending_submissions = submissions.filter((submission) => submission.verdict === 'Pending').length
    const nb_rejected_submissions =
        submissions.length - nb_accepted_submissions - nb_scored_submissions - nb_pending_submissions

    let status: string
    if (submissions.length === 0) {
        status = 'not_tried'
    } else if (nb_accepted_submissions > 0) {
        status = 'accepted'
    } else if (nb_scored_submissions > 0) {
        status = 'scored'
    } else {
        status = 'rejected'
    }

    return {
        problem_nm,
        nb_submissions: submissions.length,
        nb_pending_submissions,
        nb_accepted_submissions,
        nb_rejected_submissions,
        nb_scored_submissions,
        status,
    }
}

export function deriveAbstractStatusesFromCourseSubmissions(
    submissions: CourseSubmission[],
): Record<string, AbstractStatus> {
    const byProblem = new Map<string, CourseSubmission[]>()

    for (const submission of submissions) {
        const problem_nm = problemNmFromCourseSubmission(submission)
        if (!problem_nm) {
            continue
        }

        const list = byProblem.get(problem_nm) ?? []
        list.push(submission)
        byProblem.set(problem_nm, list)
    }

    const result: Record<string, AbstractStatus> = {}
    for (const [problem_nm, problemSubmissions] of byProblem) {
        result[problem_nm] = buildAbstractStatus(problem_nm, problemSubmissions)
    }

    return result
}
