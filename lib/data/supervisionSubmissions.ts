import { getPreferredLanguageId } from '@/lib/data/auth'
import { resolveProblemId } from '@/lib/data/problemDetail'
import { abstractProblemsToTitleMap } from '@/lib/data/problems'
import {
    buildSubmissionCodeMetricsData,
    parseCodeMetricsResponse,
    shouldShowCodeMetrics,
    type SubmissionCodeMetricsData,
} from '@/lib/codeMetrics'
import { decodeSubmissionCodeBase64, MAKE_PRO2_COMPILER_ID } from '@/lib/makePro2SourceCode'
import { isGraphicProblem, parseProblemKey } from '@/lib/problems'
import {
    buildProblemSubmissionRow,
    formatSubmissionTime,
    submissionVerdict,
    type ProblemSubmissionRow,
} from '@/lib/submissions'
import {
    supervisionProblemHref,
    supervisionSubmissionHref,
    type SupervisionContext,
} from '@/lib/supervision'
import { withSupervisorClient } from '@/lib/supervisor/client'
import jutge from '@/lib/jutge'
import type {
    CompilationErrors,
    JutgeApiClient,
    Scoring,
    ScoringPart,
    Submission,
    SubmissionAnalysis,
    TestcaseAnalysis,
    TutorSubmission,
} from '@/lib/jutge_api_client'

import { fetchAbstractProblem } from './problemDetail'
import type { SubmissionDetailData, SubmissionTestcaseAnalysisData } from './submissions'

function tutorSubmissionParams(ctx: SupervisionContext, problem_id: string, submission_id: string) {
    return {
        course_key: ctx.courseKey,
        email: ctx.email,
        problem_id,
        submission_id,
    }
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

async function resolveSupervisionSubmission(
    ctx: SupervisionContext,
    key: string,
    resolvedProblemId: string,
    submission_id: string,
): Promise<TutorSubmission | null> {
    return withSupervisorClient(async (client) => {
        try {
            return await client.tutor.submissions.get(
                tutorSubmissionParams(ctx, resolvedProblemId, submission_id),
            )
        } catch {
            const parsed = parseProblemKey(resolvedProblemId)
            if (parsed.kind !== 'problem_id' && parsed.kind !== 'problem_nm') {
                return null
            }

            const submissions = await client.tutor.submissions.getForAbstractProblems({
                course_key: ctx.courseKey,
                email: ctx.email,
                problem_nms: parsed.problem_nm,
            })
            return submissions.find((submission) => submission.submission_id === submission_id) ?? null
        }
    })
}

function withSupervisionHrefs(row: ProblemSubmissionRow, ctx: SupervisionContext): ProblemSubmissionRow {
    return {
        ...row,
        submissionHref: supervisionSubmissionHref(ctx, row.problem_id, row.submission_id),
        languageHref: supervisionProblemHref(ctx, row.problem_id),
        problemHref: supervisionProblemHref(ctx, row.problem_id),
    }
}

export async function fetchSupervisionProblemSubmissionsData(
    ctx: SupervisionContext,
    problem_nm: string,
    languageTitles: Map<string, string>,
): Promise<ProblemSubmissionRow[]> {
    return withSupervisorClient(async (client) => {
        const [submissions, tables] = await Promise.all([
            client.tutor.submissions.getForAbstractProblems({
                course_key: ctx.courseKey,
                email: ctx.email,
                problem_nms: problem_nm,
            }),
            client.tables.get(),
        ])

        return submissions.map((submission) =>
            withSupervisionHrefs(
                buildProblemSubmissionRow(submission as Submission, tables, languageTitles),
                ctx,
            ),
        )
    })
}

export type SupervisionSubmissionAnalysisRow = SubmissionAnalysis & {
    verdictEmoji?: string
    verdictFullName: string
}

export type SupervisionScoringRow = ScoringPart & {
    verdictEmoji?: string
    verdictFullName: string
}

function decodeTestcaseAnalysis(analysis: TestcaseAnalysis, outputAsImage: boolean): SubmissionTestcaseAnalysisData {
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

async function fetchSupervisionSubmissionCodeMetrics(
    ctx: SupervisionContext,
    submission: TutorSubmission,
): Promise<SubmissionCodeMetricsData | null> {
    return withSupervisorClient(async (client) => {
        const raw = await client.tutor.submissions
            .getCodeMetrics(tutorSubmissionParams(ctx, submission.problem_id, submission.submission_id))
            .catch(() => null)

        const { metrics, solmetrics } = parseCodeMetricsResponse(raw)
        if (!metrics) {
            return null
        }

        return buildSubmissionCodeMetricsData(metrics, solmetrics)
    })
}

export async function fetchSupervisionSubmissionDetail(
    ctx: SupervisionContext,
    key: string,
    submission_id: string,
): Promise<SubmissionDetailData | null> {
    const resolvedProblemId = await resolveProblemId(key)
    if (!resolvedProblemId) {
        return null
    }

    const submission = await resolveSupervisionSubmission(ctx, key, resolvedProblemId, submission_id)
    if (!submission || !submissionMatchesProblemKey(submission, key, resolvedProblemId)) {
        return null
    }

    const params = tutorSubmissionParams(ctx, submission.problem_id, submission_id)

    const [tables, codeB64, analysis, scoring, compilationErrorsResult] = await withSupervisorClient(
        async (client) => {
            const verdict = submissionVerdict(submission)
            const [tablesResult, code, analysisResult, scoringResult, compilationErrors] = await Promise.all([
                client.tables.get(),
                submission.state === 'done'
                    ? client.tutor.submissions.getCodeAsB64(params).catch(() => null)
                    : Promise.resolve(null),
                submission.state === 'done'
                    ? client.tutor.submissions.getAnalysis(params).catch(() => [] as SubmissionAnalysis[])
                    : Promise.resolve([] as SubmissionAnalysis[]),
                submission.state === 'done'
                    ? client.tutor.submissions.getScoring(params).catch(() => null)
                    : Promise.resolve(null as Scoring),
                verdict === 'CE' && submission.state === 'done'
                    ? client.tutor.submissions.getCompilationErrors(params).catch(() => null)
                    : Promise.resolve(null as CompilationErrors | null),
            ])

            return [tablesResult, code, analysisResult, scoringResult, compilationErrors] as const
        },
    )

    const parsed = parseProblemKey(submission.problem_id)
    const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : submission.problem_id
    let problemTitle = submission.problem_id

    try {
        const [abstractProblems, preferredLanguageId] = await Promise.all([
            jutge.problems.getAbstractProblems(problem_nm),
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
    const decodedCode = codeB64 ? decodeSubmissionCodeBase64(codeB64, submission.compiler_id, defaultExtension) : null

    const showMetrics = shouldShowCodeMetrics({
        submission,
        verdict,
        isAdministrator: false,
        isExamOrContest: false,
    })
    const codeMetrics = showMetrics ? await fetchSupervisionSubmissionCodeMetrics(ctx, submission) : null

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
            verdictFullName: tables.verdicts[row.verdict]?.name ?? row.verdict,
        })),
        scoring: scoring
            ? scoring.map((row) => ({
                  ...row,
                  verdictEmoji: tables.verdicts[row.verdict]?.emoji,
                  verdictFullName: tables.verdicts[row.verdict]?.name ?? row.verdict,
              }))
            : null,
        codeMetrics,
        compilationErrors: compilationErrorsResult,
        awards: [],
        debugInformation: null,
    }
}

export async function fetchSupervisionSubmissionTestcaseAnalysis(
    ctx: SupervisionContext,
    key: string,
    submission_id: string,
    testcase: string,
): Promise<SubmissionTestcaseAnalysisData | null> {
    try {
        const resolvedProblemId = await resolveProblemId(key)
        if (!resolvedProblemId) {
            return null
        }

        const submission = await resolveSupervisionSubmission(ctx, key, resolvedProblemId, submission_id)
        if (!submission || !submissionMatchesProblemKey(submission, key, resolvedProblemId)) {
            return null
        }

        if (submission.state !== 'done') {
            return null
        }

        const parsed = parseProblemKey(submission.problem_id)
        const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : submission.problem_id

        const [analysis, tables, abstractProblem] = await withSupervisorClient(async (client) =>
            Promise.all([
                client.tutor.submissions.getTestcaseAnalysis({
                    ...tutorSubmissionParams(ctx, submission.problem_id, submission_id),
                    testcase,
                }),
                client.tables.get(),
                fetchAbstractProblem(problem_nm),
            ]),
        )

        const decoded = decodeTestcaseAnalysis(analysis, isGraphicProblem(abstractProblem?.driver_id))
        return {
            ...decoded,
            verdictEmoji: tables.verdicts[decoded.verdict]?.emoji,
        }
    } catch {
        return null
    }
}

export async function fetchSupervisionSubmissionsForProblem(
    ctx: SupervisionContext,
    problem_nm: string,
): Promise<TutorSubmission[]> {
    return withSupervisorClient((client) =>
        client.tutor.submissions.getForAbstractProblems({
            course_key: ctx.courseKey,
            email: ctx.email,
            problem_nms: problem_nm,
        }),
    )
}

export async function fetchSupervisionProblemStatus(
    ctx: SupervisionContext,
    problem_nm: string,
): Promise<Awaited<ReturnType<JutgeApiClient['tutor']['statuses']['getForAbstractProblem']>> | null> {
    try {
        return await withSupervisorClient((client) =>
            client.tutor.statuses.getForAbstractProblem({
                course_key: ctx.courseKey,
                email: ctx.email,
                problem_nm,
            }),
        )
    } catch {
        return null
    }
}
