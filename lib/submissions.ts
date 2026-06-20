import { parseProblemKey } from '@/lib/problems'
import type { AllTables, Submission } from '@/lib/jutge_api_client'

export function parseSubmissionTime(time_in: Submission['time_in']): Date {
    if (typeof time_in === 'number') return new Date(time_in)
    return new Date(time_in)
}

export function formatSubmissionTime(time_in: Submission['time_in']): string {
    return parseSubmissionTime(time_in).toLocaleString()
}

export function submissionVerdict(submission: Submission): string {
    return submission.veredict ?? (submission.state === 'done' ? '—' : 'Pending')
}

export function buildSubmissionHref(problem_id: string, submission_id: string): string {
    return `/problems/${problem_id}/submissions/${submission_id}`
}

export type SubmissionNavLinks = {
    previousHref: string | null
    nextHref: string | null
    lastHref: string | null
}

export function buildSubmissionNavLinks(
    submissions: Submission[],
    currentSubmissionId: string,
    pageKey: string,
): SubmissionNavLinks | null {
    const sorted = [...submissions].sort(
        (a, b) => parseSubmissionTime(b.time_in).getTime() - parseSubmissionTime(a.time_in).getTime(),
    )
    const index = sorted.findIndex((submission) => submission.submission_id === currentSubmissionId)
    if (index === -1) {
        return null
    }

    const href = (submissionId: string) => `/problems/${pageKey}/submissions/${submissionId}`

    return {
        previousHref: index < sorted.length - 1 ? href(sorted[index + 1].submission_id) : null,
        nextHref: index > 0 ? href(sorted[index - 1].submission_id) : null,
        lastHref: index > 0 ? href(sorted[0].submission_id) : null,
    }
}

export type SubmissionRow = {
    submission_id: string
    submissionHref: string
    problem_id: string
    problemTitle: string
    problemHref: string
    verdict: string
    verdictFullName: string
    verdictEmoji?: string
    compiler_id: string
    compilerFullName: string
    time_in: string
    time_inMs: number
    annotation: string | null
}

export type ProblemSubmissionRow = SubmissionRow & {
    language_id: string
    languageTitle: string
    languageHref: string
}

export function buildSubmissionRow(
    submission: Submission,
    tables: AllTables,
    problemTitles: Map<string, string>,
): SubmissionRow {
    const parsed = parseProblemKey(submission.problem_id)
    const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : submission.problem_id
    const problemTitle =
        problemTitles.get(submission.problem_id) ?? problemTitles.get(problem_nm) ?? submission.problem_id
    const problemHref =
        parsed.kind === 'problem_id' ? `/problems/${parsed.problem_nm}` : `/problems/${submission.problem_id}`

    const verdict = submissionVerdict(submission)
    const verdictMeta = tables.verdicts[verdict]
    const compilerMeta = tables.compilers[submission.compiler_id]

    return {
        submission_id: submission.submission_id,
        submissionHref: buildSubmissionHref(submission.problem_id, submission.submission_id),
        problem_id: submission.problem_id,
        problemTitle,
        problemHref,
        verdict,
        verdictFullName: verdictMeta?.name ?? verdict,
        verdictEmoji: verdictMeta?.emoji,
        compiler_id: submission.compiler_id,
        compilerFullName: compilerMeta?.name ?? submission.compiler_id,
        time_in: formatSubmissionTime(submission.time_in),
        time_inMs: parseSubmissionTime(submission.time_in).getTime(),
        annotation: submission.annotation,
    }
}

export function buildProblemSubmissionRow(
    submission: Submission,
    tables: AllTables,
    languageTitles: Map<string, string>,
): ProblemSubmissionRow {
    const row = buildSubmissionRow(submission, tables, languageTitles)
    const parsed = parseProblemKey(submission.problem_id)
    const language_id = parsed.kind === 'problem_id' ? parsed.language_id : submission.problem_id

    return {
        ...row,
        language_id,
        languageTitle: languageTitles.get(submission.problem_id) ?? language_id,
        languageHref: `/problems/${submission.problem_id}`,
    }
}
