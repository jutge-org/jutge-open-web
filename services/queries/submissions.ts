import { cache } from 'react'

import { getPreferredLanguageId } from '@/lib/auth'
import {
    buildSubmissionCodeMetricsData,
    parseCodeMetricsResponse,
    shouldShowCodeMetrics,
    type SubmissionCodeMetricsData,
} from '@/lib/codeMetrics'
import { decodeSubmissionCodeBase64, MAKE_PRO2_COMPILER_ID } from '@/lib/makePro2SourceCode'
import { isGraphicProblem, parseProblemKey } from '@/lib/problems'
import {
    buildLastSubmissionsByProblemNm,
    buildProblemSubmissionRow,
    buildSubmissionRow,
    formatSubmissionTime,
    submissionVerdict,
    type LastSubmissionInfo,
    type ProblemSubmissionRow,
    type SubmissionRow,
} from '@/lib/submissions'
import type { JutgeApiClient, Submission, SubmissionAnalysis, TestcaseAnalysis } from '@/lib/jutge_api_client'

import { abstractProblemsToTitleMap } from './problems'
import { fetchAbstractProblem, resolveProblemId } from './problemDetail'

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
    const [submissions, tables, preferredLanguageId] = await Promise.all([
        client.student.submissions.getAll(),
        client.tables.get(),
        getPreferredLanguageId(),
    ])

    const problemNms = submissionProblemNms(submissions)
    let problemTitles = new Map<string, string>()

    if (problemNms.length > 0) {
        try {
            const abstractProblems = await client.problems.getAbstractProblems(problemNms.join(','))
            problemTitles = abstractProblemsToTitleMap(abstractProblems, preferredLanguageId)
        } catch {
            // Titles fall back to the problem id in buildSubmissionRow.
        }
    }

    return submissions.map((submission) => buildSubmissionRow(submission, tables, problemTitles))
})

export const fetchLastSubmissionsByProblemNm = cache(
    async (client: JutgeApiClient): Promise<Map<string, LastSubmissionInfo>> => {
        const submissions = await client.student.submissions.getAll()
        return buildLastSubmissionsByProblemNm(submissions)
    },
)

export const fetchProblemSubmissionsData = cache(
    async (
        client: JutgeApiClient,
        problem_nm: string,
        languageTitles: Map<string, string>,
    ): Promise<ProblemSubmissionRow[]> => {
        const [submissions, tables] = await Promise.all([
            client.student.submissions.getForAbstractProblems(problem_nm),
            client.tables.get(),
        ])

        return submissions.map((submission) => buildProblemSubmissionRow(submission, tables, languageTitles))
    },
)

export type SubmissionAnalysisRow = SubmissionAnalysis & {
    verdictEmoji?: string
}

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
    analysis: SubmissionAnalysisRow[]
    codeMetrics: SubmissionCodeMetricsData | null
}

export type SubmissionCodeData = {
    body: Buffer
    contentType: string
    filename: string
}

export type SubmissionTestcaseAnalysisData = {
    testcase: string
    execution: string
    verdict: string
    verdictEmoji?: string
    input: string
    output: string
    expected: string
    outputImageSrc?: string
    expectedImageSrc?: string
}

function decodeTestcaseAnalysis(
    analysis: TestcaseAnalysis,
    outputAsImage: boolean,
): SubmissionTestcaseAnalysisData {
    const decoded: SubmissionTestcaseAnalysisData = {
        testcase: analysis.testcase,
        execution: analysis.execution,
        verdict: analysis.verdict,
        input: Buffer.from(analysis.input_b64, 'base64').toString('utf-8'),
        output: '',
        expected: '',
    }

    if (outputAsImage) {
        decoded.outputImageSrc = `data:image/png;base64,${analysis.output_b64}`
        decoded.expectedImageSrc = `data:image/png;base64,${analysis.expected_b64}`
        return decoded
    }

    decoded.output = Buffer.from(analysis.output_b64, 'base64').toString('utf-8')
    decoded.expected = Buffer.from(analysis.expected_b64, 'base64').toString('utf-8')
    return decoded
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

        const defaultExtension = tables.compilers[submission.compiler_id]?.extension ?? 'txt'

        return {
            body: Buffer.from(codeB64, 'base64'),
            contentType:
                submission.compiler_id === MAKE_PRO2_COMPILER_ID
                    ? 'application/x-tar'
                    : 'text/plain; charset=utf-8',
            filename: `${submission_id}.${defaultExtension}`,
        }
    },
)

async function fetchSubmissionCodeMetrics(
    client: JutgeApiClient,
    submission: Submission,
): Promise<SubmissionCodeMetricsData | null> {
    const raw = await client.student.submissions
        .getCodeMetrics({ problem_id: submission.problem_id, submission_id: submission.submission_id })
        .catch(() => null)

    const { metrics, solmetrics } = parseCodeMetricsResponse(raw)
    if (!metrics) {
        return null
    }

    return buildSubmissionCodeMetricsData(metrics, solmetrics)
}

export const fetchSubmissionDetail = cache(
    async (
        client: JutgeApiClient,
        key: string,
        submission_id: string,
        options?: { isAdministrator?: boolean; isExamOrContest?: boolean },
    ): Promise<SubmissionDetailData | null> => {
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
            const [abstractProblems, preferredLanguageId] = await Promise.all([
                client.problems.getAbstractProblems(problem_nm),
                getPreferredLanguageId(),
            ])
            const titles = abstractProblemsToTitleMap(abstractProblems, preferredLanguageId)
            problemTitle = titles.get(submission.problem_id) ?? titles.get(problem_nm) ?? submission.problem_id
        } catch {
            // Title falls back to the problem id.
        }

        const verdict = submissionVerdict(submission)
        const verdictMeta = tables.verdicts[verdict]
        const compilerMeta = tables.compilers[submission.compiler_id]

        const defaultExtension = compilerMeta?.extension ?? 'txt'
        const decodedCode = codeB64
            ? decodeSubmissionCodeBase64(codeB64, submission.compiler_id, defaultExtension)
            : null

        const codeMetrics = shouldShowCodeMetrics({
            submission,
            verdict,
            isAdministrator: options?.isAdministrator ?? false,
            isExamOrContest: options?.isExamOrContest ?? false,
        })
            ? await fetchSubmissionCodeMetrics(client, submission)
            : null

        return {
            submission,
            problemTitle,
            verdict,
            verdictFullName: verdictMeta?.name ?? verdict,
            verdictEmoji: verdictMeta?.emoji,
            compilerFullName: compilerMeta?.name ?? submission.compiler_id,
            time_in: formatSubmissionTime(submission.time_in),
            code: decodedCode?.code ?? null,
            codeExtension: decodedCode?.extension ?? null,
            codeFilename: codeB64 ? `${submission_id}.${defaultExtension}` : null,
            analysis: analysis.map((row) => ({
                ...row,
                verdictEmoji: tables.verdicts[row.verdict]?.emoji,
            })),
            codeMetrics,
        }
    },
)

export const fetchSubmissionTestcaseAnalysis = cache(
    async (
        client: JutgeApiClient,
        key: string,
        submission_id: string,
        testcase: string,
    ): Promise<SubmissionTestcaseAnalysisData | null> => {
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

        try {
            const parsed = parseProblemKey(submission.problem_id)
            const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : submission.problem_id

            const [analysis, tables, abstractProblem] = await Promise.all([
                client.student.submissions.getTestcaseAnalysis({
                    problem_id: submission.problem_id,
                    submission_id,
                    testcase,
                }),
                client.tables.get(),
                fetchAbstractProblem(problem_nm),
            ])
            const decoded = decodeTestcaseAnalysis(analysis, isGraphicProblem(abstractProblem?.driver_id))
            return {
                ...decoded,
                verdictEmoji: tables.verdicts[decoded.verdict]?.emoji,
            }
        } catch {
            return null
        }
    },
)
