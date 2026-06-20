import type { CodeMetrics, Submission } from '@/lib/jutge_api_client'

const HIDDEN_COMPILER_IDS = new Set(['quiz', 'MakePRO2'])
const HIDDEN_VERDICTS = new Set(['CE', 'IE', 'FE', 'Pending'])

const GAUGE_GREEN = '#22c55e'
const GAUGE_YELLOW = '#f59e0b'
const GAUGE_RED = '#ef4444'

export const CCN_GAUGE_INTERVALS = [
    { minimum: 0, maximum: 9, color: GAUGE_GREEN },
    { minimum: 9, maximum: 14, color: GAUGE_YELLOW },
    { minimum: 14, maximum: 18, color: GAUGE_RED },
] as const

export const HALSTEAD_DIFFICULTY_GAUGE_INTERVALS = [
    { minimum: 0, maximum: 10, color: GAUGE_GREEN },
    { minimum: 10, maximum: 20, color: GAUGE_YELLOW },
    { minimum: 20, maximum: 30, color: GAUGE_RED },
] as const

export const MAINTAINABILITY_GAUGE_INTERVALS = [
    { minimum: 0, maximum: 20, color: GAUGE_RED },
    { minimum: 20, maximum: 80, color: GAUGE_YELLOW },
    { minimum: 80, maximum: 100, color: GAUGE_GREEN },
] as const

export const DOCUMENTATION_GAUGE_INTERVALS = [
    { minimum: 0, maximum: 10, color: GAUGE_RED },
    { minimum: 10, maximum: 20, color: GAUGE_YELLOW },
    { minimum: 20, maximum: 40, color: GAUGE_GREEN },
    { minimum: 40, maximum: 100, color: GAUGE_RED },
] as const

export const RATIO_GAUGE_INTERVALS = [
    { minimum: 0, maximum: 1.5, color: GAUGE_GREEN },
    { minimum: 1.5, maximum: 2.25, color: GAUGE_YELLOW },
    { minimum: 2.25, maximum: 3, color: GAUGE_RED },
] as const

type CodeMetricsPayload = {
    metrics?: CodeMetrics
    solmetrics?: CodeMetrics | null
}

export type CodeMetricsTableRow = {
    metric: string
    value: string
    ref: string
    ratio: string
}

export type SubmissionCodeMetricsData = {
    rows: CodeMetricsTableRow[]
    cyclomaticComplexity: number
    halsteadDifficulty: number
    maintainabilityIndex: number
    documentationIndex: number
    ccnRatio: number | null
    difRatio: number | null
}

export function shouldShowCodeMetrics({
    submission,
    verdict,
    isAdministrator,
    isExamOrContest,
}: {
    submission: Submission
    verdict: string
    isAdministrator: boolean
    isExamOrContest: boolean
}): boolean {
    if (isExamOrContest) {
        return false
    }

    if (HIDDEN_COMPILER_IDS.has(submission.compiler_id)) {
        return false
    }

    if (HIDDEN_VERDICTS.has(verdict)) {
        return false
    }

    if (!isAdministrator && verdict !== 'AC') {
        return false
    }

    return submission.state === 'done'
}

function formatDecimal(value: number): string {
    return value.toFixed(1)
}

function formatRatio(numerator: number, denominator: number | undefined | null): string {
    if (denominator === undefined || denominator === null) {
        return '-'
    }

    if (denominator === 0) {
        return 'NaN'
    }

    return (numerator / denominator).toFixed(1)
}

function formatRef(value: number | undefined | null, formatter: (value: number) => string): string {
    if (value === undefined || value === null) {
        return '-'
    }

    return formatter(value)
}

function computeRatio(numerator: number, denominator: number | undefined | null): number | null {
    if (denominator === undefined || denominator === null || denominator === 0) {
        return null
    }

    return numerator / denominator
}

export function parseCodeMetricsResponse(raw: CodeMetrics | null): {
    metrics: CodeMetrics | null
    solmetrics: CodeMetrics | null
} {
    if (!raw) {
        return { metrics: null, solmetrics: null }
    }

    const payload = raw as CodeMetrics & CodeMetricsPayload

    if (payload.metrics) {
        return {
            metrics: payload.metrics,
            solmetrics: payload.solmetrics ?? null,
        }
    }

    if (typeof payload.cyclomatic_complexity === 'number') {
        return { metrics: payload, solmetrics: null }
    }

    return { metrics: null, solmetrics: null }
}

export function buildSubmissionCodeMetricsData(
    metrics: CodeMetrics,
    solmetrics: CodeMetrics | null,
): SubmissionCodeMetricsData {
    const rows: CodeMetricsTableRow[] = [
        {
            metric: 'cyclomatic complexity',
            value: formatDecimal(metrics.cyclomatic_complexity),
            ref: formatRef(solmetrics?.cyclomatic_complexity, formatDecimal),
            ratio: formatRatio(metrics.cyclomatic_complexity, solmetrics?.cyclomatic_complexity),
        },
        {
            metric: 'halstead difficulty',
            value: formatDecimal(metrics.halstead_difficulty),
            ref: formatRef(solmetrics?.halstead_difficulty, formatDecimal),
            ratio: formatRatio(metrics.halstead_difficulty, solmetrics?.halstead_difficulty),
        },
        {
            metric: 'maintainability index',
            value: formatDecimal(metrics.maintainability_index),
            ref: formatRef(solmetrics?.maintainability_index, formatDecimal),
            ratio: formatRatio(metrics.maintainability_index, solmetrics?.maintainability_index),
        },
        {
            metric: 'documentation index',
            value: formatDecimal(metrics.comment_ratio),
            ref: formatRef(solmetrics?.comment_ratio, formatDecimal),
            ratio: formatRatio(metrics.comment_ratio, solmetrics?.comment_ratio),
        },
        {
            metric: 'lines of code',
            value: String(metrics.loc),
            ref: formatRef(solmetrics?.loc, String),
            ratio: formatRatio(metrics.loc, solmetrics?.loc),
        },
    ]

    return {
        rows,
        cyclomaticComplexity: metrics.cyclomatic_complexity,
        halsteadDifficulty: metrics.halstead_difficulty,
        maintainabilityIndex: metrics.maintainability_index,
        documentationIndex: metrics.comment_ratio,
        ccnRatio: computeRatio(metrics.cyclomatic_complexity, solmetrics?.cyclomatic_complexity),
        difRatio: computeRatio(metrics.halstead_difficulty, solmetrics?.halstead_difficulty),
    }
}
