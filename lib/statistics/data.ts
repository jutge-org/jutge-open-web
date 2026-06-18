import { parseProblemKey } from '@/lib/problems'
import { compilerColor, proglangColor, verdictColor } from '@/lib/statistics/colors'
import type {
    AllTables,
    ColorMapping,
    Dashboard,
    Distribution,
    HeatmapCalendar,
    Submission,
} from '@/lib/jutge_api_client'

export type DistributionSlice = {
    key: string
    label: string
    count: number
    percent: number
    color: string
    emoji?: string
}

export type ActivityInterval = {
    label: string
    accepted: number
    rejected: number
}

export type TimeSeriesPoint = {
    year: number
    value: number
}

export type SubmissionSeriesPoint = {
    year: number
    accepted: number
    rejected: number
    total: number
}

export type AccuracyPoint = {
    year: number
    accuracy: number
}

export type RecentSubmissionRow = {
    submission_id: string
    problemHref: string
    problemLabel: string
    verdict: string
    verdictEmoji?: string
    verdictColor: string
    ago: string
}

const WEEKDAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

const ACTIVITY_INTERVALS = [
    { key: 'hour', label: 'in the last hour' },
    { key: 'day', label: 'in the last day' },
    { key: 'week', label: 'in the last week' },
    { key: 'month', label: 'in the last month' },
    { key: 'year', label: 'in the last year' },
    { key: 'decade', label: 'in the last decade' },
] as const

function labelForKey(key: string, tables?: AllTables): string {
    if (tables?.compilers[key]) return tables.compilers[key].name
    if (tables?.verdicts[key]) return tables.verdicts[key].name
    return key.replace(/_/g, ' ')
}

export function distributionToSlices(
    dist: Distribution,
    tables: AllTables | undefined,
    hexColors: ColorMapping,
    category: 'verdicts' | 'compilers' | 'proglangs',
): DistributionSlice[] {
    const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1
    const colorMap = hexColors[category] ?? {}

    return Object.entries(dist)
        .map(([key, count], index) => {
            let color: string
            if (category === 'verdicts') color = verdictColor(key, colorMap)
            else if (category === 'compilers') color = compilerColor(key, colorMap)
            else color = proglangColor(key, index)

            return {
                key,
                label: labelForKey(key, tables),
                count,
                percent: Math.round((count / total) * 1000) / 10,
                color,
                emoji: category === 'verdicts' ? tables?.verdicts[key]?.emoji : undefined,
            }
        })
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count)
}

export function hourDistributionToBars(dist: Distribution): { hour: string; count: number }[] {
    return Array.from({ length: 24 }, (_, hour) => {
        const padded = String(hour).padStart(2, '0')
        const count = dist[padded] ?? dist[String(hour)] ?? 0
        return { hour: padded, count }
    })
}

export function weekdayDistributionToBars(dist: Distribution): { day: string; label: string; count: number }[] {
    const labels: Record<string, string> = {
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
        sunday: 'Sun',
    }

    return WEEKDAY_ORDER.map((day) => ({
        day,
        label: labels[day] ?? day,
        count: dist[day] ?? 0,
    }))
}

function parseSubmissionTime(time_in: Submission['time_in']): Date {
    if (typeof time_in === 'number') return new Date(time_in)
    return new Date(time_in)
}

function isAccepted(veredict: string | null): boolean {
    return veredict?.toUpperCase() === 'AC'
}

function msForInterval(interval: (typeof ACTIVITY_INTERVALS)[number]['key']): number {
    const hour = 60 * 60 * 1000
    const map = {
        hour: hour,
        day: 24 * hour,
        week: 7 * 24 * hour,
        month: 30 * 24 * hour,
        year: 365 * 24 * hour,
        decade: 10 * 365 * 24 * hour,
    }
    return map[interval]
}

export function buildActivityIntervals(submissions: Submission[]): ActivityInterval[] {
    const now = Date.now()

    return ACTIVITY_INTERVALS.map(({ key, label }) => {
        const cutoff = now - msForInterval(key)
        const inRange = submissions.filter((s) => parseSubmissionTime(s.time_in).getTime() >= cutoff)
        const accepted = inRange.filter((s) => isAccepted(s.veredict)).length
        return {
            label,
            accepted,
            rejected: inRange.length - accepted,
        }
    })
}

function formatRelativeTime(date: Date): string {
    const diffMs = Date.now() - date.getTime()
    const minutes = Math.floor(diffMs / 60_000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
    const years = Math.floor(months / 12)
    return `${years} year${years === 1 ? '' : 's'} ago`
}

export function buildRecentSubmissions(
    submissions: Submission[],
    tables: AllTables | undefined,
    hexColors: ColorMapping,
    limit = 6,
): RecentSubmissionRow[] {
    const sorted = [...submissions].sort(
        (a, b) => parseSubmissionTime(b.time_in).getTime() - parseSubmissionTime(a.time_in).getTime(),
    )

    return sorted.slice(0, limit).map((submission) => {
        const parsed = parseProblemKey(submission.problem_id)
        const problemLabel = parsed.kind === 'problem_id' ? parsed.problem_nm : submission.problem_id
        const problemHref =
            parsed.kind === 'problem_id'
                ? `/problems/${parsed.problem_nm}`
                : `/problems/${submission.problem_id}`
        const verdict = submission.veredict ?? (submission.state === 'done' ? '—' : 'Pending')
        const verdictMeta = tables?.verdicts[verdict]

        return {
            submission_id: submission.submission_id,
            problemHref,
            problemLabel,
            verdict,
            verdictEmoji: verdictMeta?.emoji,
            verdictColor: verdictColor(verdict, hexColors.verdicts),
            ago: formatRelativeTime(parseSubmissionTime(submission.time_in)),
        }
    })
}

function yearFromSubmission(submission: Submission): number {
    return parseSubmissionTime(submission.time_in).getFullYear()
}

export function buildAcceptedProblemsSeries(submissions: Submission[]): TimeSeriesPoint[] {
    const accepted = submissions
        .filter((s) => isAccepted(s.veredict))
        .sort((a, b) => parseSubmissionTime(a.time_in).getTime() - parseSubmissionTime(b.time_in).getTime())

    const seen = new Set<string>()
    const byYear = new Map<number, number>()
    let cumulative = 0

    for (const submission of accepted) {
        const parsed = parseProblemKey(submission.problem_id)
        const problemKey = parsed.kind === 'problem_id' ? parsed.problem_nm : submission.problem_id
        if (seen.has(problemKey)) continue
        seen.add(problemKey)
        cumulative += 1
        const year = yearFromSubmission(submission)
        byYear.set(year, cumulative)
    }

    return [...byYear.entries()]
        .sort(([a], [b]) => a - b)
        .map(([year, value]) => ({ year, value }))
}

export function buildSubmissionSeries(submissions: Submission[]): SubmissionSeriesPoint[] {
    const sorted = [...submissions].sort(
        (a, b) => parseSubmissionTime(a.time_in).getTime() - parseSubmissionTime(b.time_in).getTime(),
    )

    const byYear = new Map<number, SubmissionSeriesPoint>()
    let accepted = 0
    let rejected = 0

    for (const submission of sorted) {
        const year = yearFromSubmission(submission)
        if (isAccepted(submission.veredict)) accepted += 1
        else rejected += 1
        byYear.set(year, { year, accepted, rejected, total: accepted + rejected })
    }

    return [...byYear.values()].sort((a, b) => a.year - b.year)
}

export function buildAccuracySeries(submissions: Submission[]): AccuracyPoint[] {
    const byYear = new Map<number, { accepted: number; total: number }>()

    for (const submission of submissions) {
        const year = yearFromSubmission(submission)
        const current = byYear.get(year) ?? { accepted: 0, total: 0 }
        current.total += 1
        if (isAccepted(submission.veredict)) current.accepted += 1
        byYear.set(year, current)
    }

    return [...byYear.entries()]
        .sort(([a], [b]) => a - b)
        .map(([year, { accepted, total }]) => ({
            year,
            accuracy: total === 0 ? 0 : Math.round((accepted / total) * 1000) / 10,
        }))
}

export function cumulativeHeatmapSeries(heatmap: HeatmapCalendar): { date: string; total: number }[] {
    const sorted = [...heatmap].sort((a, b) => a.date - b.date)
    let cumulative = 0
    return sorted.map((entry) => {
        cumulative += entry.value
        const date = new Date(entry.date * 1000).toISOString().slice(0, 10)
        return { date, total: cumulative }
    })
}

export function dashboardSummary(dashboard: Dashboard, level: string) {
    const stats = dashboard.stats
    return {
        acceptedProblems: stats.number_of_accepted_problems ?? 0,
        rejectedProblems: stats.number_of_rejected_problems ?? 0,
        submissions: stats.number_of_submissions ?? 0,
        level,
    }
}
