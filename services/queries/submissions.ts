import { cache } from 'react'

import { parseProblemKey } from '@/lib/problems'
import {
    buildProblemSubmissionRow,
    buildSubmissionRow,
    formatSubmissionTime,
    submissionVerdict,
    type ProblemSubmissionRow,
    type SubmissionRow,
} from '@/lib/submissions'
import type { JutgeApiClient, Submission, SubmissionAnalysis } from '@/lib/jutge_api_client'

import { abstractProblemsToTitleMap } from './problems'
import { resolveProblemId } from './problemDetail'

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

export const fetchProblemSubmissionsData = cache(
    async (client: JutgeApiClient, problem_nm: string, languageTitles: Map<string, string>): Promise<ProblemSubmissionRow[]> => {
        const [submissions, tables] = await Promise.all([
            client.student.submissions.getForAbstractProblems(problem_nm),
            client.tables.get(),
        ])

        return submissions.map((submission) => buildProblemSubmissionRow(submission, tables, languageTitles))
    },
)

export type SubmissionDetailData = {
    submission: Submission
    problemTitle: string
    verdict: string
    verdictFullName: string
    verdictEmoji?: string
    compilerFullName: string
    time_in: string
    code: string | null
    codeExtension: string | null
    codeFilename: string | null
    analysis: SubmissionAnalysis[]
}

export type SubmissionCodeData = {
    code: string
    codeExtension: string
}

function submissionProblemNm(submission: Submission): string | null {
    const parsed = parseProblemKey(submission.problem_id)
    if (parsed.kind === 'problem_id' || parsed.kind === 'problem_nm') {
        return parsed.problem_nm
    }
    return null
}

function submissionMatchesProblemKey(submission: Submission, key: string, resolvedProblemId: string): boolean {
    if (submission.problem_id === resolvedProblemId || submission.problem_id === key) {
        return true
    }

    const keyParsed = parseProblemKey(key)
    const keyProblemNm =
        keyParsed.kind === 'problem_id' || keyParsed.kind === 'problem_nm' ? keyParsed.problem_nm : null
    const submissionNm = submissionProblemNm(submission)

    return keyProblemNm !== null && submissionNm === keyProblemNm
}

async function resolveSubmission(
    client: JutgeApiClient,
    key: string,
    resolvedProblemId: string,
    submission_id: string,
): Promise<Submission | null> {
    try {
        return await client.student.submissions.get({ problem_id: resolvedProblemId, submission_id })
    } catch {
        const parsed = parseProblemKey(resolvedProblemId)
        if (parsed.kind !== 'problem_id' && parsed.kind !== 'problem_nm') {
            return null
        }

        const submissions = await client.student.submissions.getForAbstractProblems(parsed.problem_nm)
        return submissions.find((submission) => submission.submission_id === submission_id) ?? null
    }
}

export const fetchSubmissionCode = cache(
    async (client: JutgeApiClient, key: string, submission_id: string): Promise<SubmissionCodeData | null> => {
        const resolvedProblemId = await resolveProblemId(key)
        if (!resolvedProblemId) {
            return null
        }

        const submission = await resolveSubmission(client, key, resolvedProblemId, submission_id)
        if (!submission || !submissionMatchesProblemKey(submission, key, resolvedProblemId)) {
            return null
        }

        if (submission.state !== 'done') {
            return null
        }

        const [tables, codeB64] = await Promise.all([
            client.tables.get(),
            client.student.submissions
                .getCodeAsB64({ problem_id: submission.problem_id, submission_id })
                .catch(() => null),
        ])

        if (!codeB64) {
            return null
        }

        return {
            code: Buffer.from(codeB64, 'base64').toString('utf-8'),
            codeExtension: tables.compilers[submission.compiler_id]?.extension ?? 'txt',
        }
    },
)

export const fetchSubmissionDetail = cache(
    async (client: JutgeApiClient, key: string, submission_id: string): Promise<SubmissionDetailData | null> => {
        const resolvedProblemId = await resolveProblemId(key)
        if (!resolvedProblemId) {
            return null
        }

        const submission = await resolveSubmission(client, key, resolvedProblemId, submission_id)
        if (!submission || !submissionMatchesProblemKey(submission, key, resolvedProblemId)) {
            return null
        }

        const [tables, codeB64, analysis] = await Promise.all([
            client.tables.get(),
            submission.state === 'done'
                ? client.student.submissions
                      .getCodeAsB64({ problem_id: submission.problem_id, submission_id })
                      .catch(() => null)
                : Promise.resolve(null),
            submission.state === 'done'
                ? client.student.submissions
                      .getAnalysis({ problem_id: submission.problem_id, submission_id })
                      .catch(() => [] as SubmissionAnalysis[])
                : Promise.resolve([] as SubmissionAnalysis[]),
        ])

        const parsed = parseProblemKey(submission.problem_id)
        const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : submission.problem_id
        let problemTitle = submission.problem_id

        try {
            const abstractProblems = await client.problems.getAbstractProblems(problem_nm)
            const titles = abstractProblemsToTitleMap(abstractProblems)
            problemTitle = titles.get(submission.problem_id) ?? titles.get(problem_nm) ?? submission.problem_id
        } catch {
            // Title falls back to the problem id.
        }

        const verdict = submissionVerdict(submission)
        const verdictMeta = tables.verdicts[verdict]
        const compilerMeta = tables.compilers[submission.compiler_id]

        const extension = compilerMeta?.extension ?? 'txt'

        return {
            submission,
            problemTitle,
            verdict,
            verdictFullName: verdictMeta?.name ?? verdict,
            verdictEmoji: verdictMeta?.emoji,
            compilerFullName: compilerMeta?.name ?? submission.compiler_id,
            time_in: formatSubmissionTime(submission.time_in),
            code: codeB64 ? Buffer.from(codeB64, 'base64').toString('utf-8') : null,
            codeExtension: codeB64 ? extension : null,
            codeFilename: codeB64 ? `${submission_id}.${extension}` : null,
            analysis,
        }
    },
)
