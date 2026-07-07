import type { Distribution, HeatmapCalendar } from '@/lib/jutge_api_client'
import type { CourseSubmission, ProblemAnonymousSubmission } from '@/lib/jutge_api_client'
import dayjs from 'dayjs'

/** Normalized submission row for statistics (problem or course scope). */
export type StatisticsSubmission = {
    time: string
    user_id: string
    problem_id: string
    verdict: string
    compiler_id: string
    proglang: string
}

export function toStatisticsSubmissionFromAnonymous(submission: ProblemAnonymousSubmission): StatisticsSubmission {
    return {
        time: submission.time,
        user_id: submission.anonymous_user_id,
        problem_id: submission.problem_id,
        verdict: submission.verdict,
        compiler_id: submission.compiler_id,
        proglang: submission.proglang,
    }
}

export function toStatisticsSubmissionFromCourse(submission: CourseSubmission): StatisticsSubmission {
    return {
        time: submission.time,
        user_id: submission.user_uid,
        problem_id: submission.problem_id,
        verdict: submission.verdict,
        compiler_id: submission.compiler_id,
        proglang: submission.proglang,
    }
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export type OkKoPoint = { label: string; ok: number; ko: number }

export type VolumeOverTimePoint = { year: number; label: string; ok: number; ko: number }

export type SubmissionsByLanguageOverTimePoint = {
    year: number
    label: string
    [language_id: string]: number | string
}

export type TimeToFirstPassPoint = { hours: number; label: string; cumulativePct: number }

export type AttemptsToSolvePoint = {
    attempts: number
    label: string
    passed: number
    neverPassed?: number
}

export type SubmissionChartData = {
    heatmapData: HeatmapCalendar
    heatmapStart: dayjs.Dayjs
    heatmapEnd: dayjs.Dayjs
    maxValue: number
    usersOkKo: Distribution
    submissionsOkKo: Distribution
    verdicts: Distribution
    compilers: Distribution
    proglangs: Distribution
    submissionsByYear: OkKoPoint[]
    submissionsByWeekday: OkKoPoint[]
    submissionsByHour: OkKoPoint[]
    submissionsByMonth: OkKoPoint[]
    timeToFirstPass: {
        curve: TimeToFirstPassPoint[]
        totalSolvers: number
        neverSolved: number
        medianHours: number | null
    }
    attemptsToSolve: {
        histogram: AttemptsToSolvePoint[]
        medianAttempts: number | null
        totalPassed: number
        neverPassedCount: number
    }
    submissionVolumeOverTime: VolumeOverTimePoint[]
}

function computeTimeToFirstPassFunnel(submissions: StatisticsSubmission[]): SubmissionChartData['timeToFirstPass'] {
    const byUser = new Map<string, { firstTime: number; firstAcTime: number | null }>()
    for (const s of submissions) {
        const t = dayjs(s.time).valueOf()
        const existing = byUser.get(s.user_id)
        if (!existing) {
            byUser.set(s.user_id, {
                firstTime: t,
                firstAcTime: s.verdict === 'AC' ? t : null,
            })
        } else {
            if (t < existing.firstTime) existing.firstTime = t
            if (s.verdict === 'AC' && (existing.firstAcTime === null || t < existing.firstAcTime)) {
                existing.firstAcTime = t
            }
        }
    }
    const deltasHours: number[] = []
    let neverSolved = 0
    for (const { firstTime, firstAcTime } of byUser.values()) {
        if (firstAcTime != null) {
            deltasHours.push((firstAcTime - firstTime) / (60 * 60 * 1000))
        } else {
            neverSolved += 1
        }
    }
    deltasHours.sort((a, b) => a - b)
    const totalSolvers = deltasHours.length
    const medianHours = totalSolvers > 0 ? deltasHours[Math.floor(totalSolvers / 2)] : null

    const timeBucketsHours = [0, 0.25, 0.5, 1, 2, 4, 8, 12, 24, 48, 72, 168]
    const curve: TimeToFirstPassPoint[] = timeBucketsHours.map((hours) => {
        const count = totalSolvers === 0 ? 0 : deltasHours.filter((d) => d <= hours).length
        const cumulativePct = totalSolvers === 0 ? 0 : (count / totalSolvers) * 100
        let label: string
        if (hours < 1) label = `${Math.round(hours * 60)}m`
        else if (hours < 24) label = `${hours}h`
        else label = `${hours / 24}d`
        return { hours, label, cumulativePct }
    })
    return { curve, totalSolvers, neverSolved, medianHours }
}

function computeAttemptsToSolve(submissions: StatisticsSubmission[]): SubmissionChartData['attemptsToSolve'] {
    const byUser = new Map<string, { time: string; verdict: string }[]>()
    for (const s of submissions) {
        let list = byUser.get(s.user_id)
        if (!list) {
            list = []
            byUser.set(s.user_id, list)
        }
        list.push({ time: s.time, verdict: s.verdict })
    }
    for (const list of byUser.values()) {
        list.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    }

    const attemptCounts: number[] = []
    let neverPassedCount = 0
    for (const list of byUser.values()) {
        const firstAcIndex = list.findIndex((s) => s.verdict === 'AC')
        if (firstAcIndex >= 0) {
            attemptCounts.push(firstAcIndex + 1)
        } else {
            neverPassedCount += 1
        }
    }

    attemptCounts.sort((a, b) => a - b)
    const totalPassed = attemptCounts.length
    const medianAttempts = totalPassed > 0 ? attemptCounts[Math.floor(totalPassed / 2)] : null

    const maxAttempts = attemptCounts.length > 0 ? Math.max(...attemptCounts) : 0
    const bucketCount: Record<number, number> = {}
    for (let k = 1; k <= maxAttempts; k++) bucketCount[k] = 0
    for (const k of attemptCounts) {
        bucketCount[k] = (bucketCount[k] ?? 0) + 1
    }
    const histogram: AttemptsToSolvePoint[] = []
    for (let k = 1; k <= maxAttempts; k++) {
        histogram.push({
            attempts: k,
            label: String(k),
            passed: bucketCount[k] ?? 0,
        })
    }
    if (neverPassedCount > 0) {
        histogram.push({
            attempts: maxAttempts + 1,
            label: 'No AC',
            passed: 0,
            neverPassed: neverPassedCount,
        })
    }
    return { histogram, medianAttempts, totalPassed, neverPassedCount }
}

/** All chart/table data derived from a submissions list (e.g. filtered by date range). */
export function deriveSubmissionChartData(submissions: StatisticsSubmission[]): SubmissionChartData {
    const isOk = (verdict: string) => verdict === 'AC'

    const byDay: Record<string, number> = {}
    for (const s of submissions) {
        const key = dayjs(s.time).format('YYYY-MM-DD')
        byDay[key] = (byDay[key] ?? 0) + 1
    }
    const heatmapData: HeatmapCalendar = Object.entries(byDay).map(([key, value]) => ({
        date: dayjs(key).startOf('day').unix(),
        value,
    }))
    const maxValue = heatmapData.length ? Math.max(...heatmapData.map((d) => d.value)) : 0
    const heatmapEnd = dayjs().add(1, 'day').startOf('day')
    const heatmapStart = submissions.length > 0 ? dayjs(submissions[0].time).startOf('day') : dayjs().startOf('day')

    const userStatus = new Map<string, boolean>()
    for (const s of submissions) {
        const hasAc = userStatus.get(s.user_id)
        if (!hasAc) userStatus.set(s.user_id, s.verdict === 'AC')
        else if (s.verdict === 'AC') userStatus.set(s.user_id, true)
    }
    let usersOk = 0
    let usersKo = 0
    for (const ok of userStatus.values()) {
        if (ok) usersOk += 1
        else usersKo += 1
    }
    const usersOkKo: Distribution = { OK: usersOk, KO: usersKo }

    const acCount = submissions.filter((s) => s.verdict === 'AC').length
    const submissionsTotal = submissions.length
    const submissionsOkKo: Distribution = {
        OK: acCount,
        KO: submissionsTotal - acCount,
    }

    const verdicts: Distribution = {}
    const compilers: Distribution = {}
    const proglangs: Distribution = {}
    for (const s of submissions) {
        verdicts[s.verdict] = (verdicts[s.verdict] ?? 0) + 1
        compilers[s.compiler_id] = (compilers[s.compiler_id] ?? 0) + 1
        proglangs[s.proglang] = (proglangs[s.proglang] ?? 0) + 1
    }

    const byYear: Record<string, { ok: number; ko: number }> = {}
    for (const s of submissions) {
        const y = dayjs(s.time).year().toString()
        if (!byYear[y]) byYear[y] = { ok: 0, ko: 0 }
        if (isOk(s.verdict)) byYear[y].ok += 1
        else byYear[y].ko += 1
    }
    const submissionsByYear: OkKoPoint[] = Object.entries(byYear)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([label, counts]) => ({ label, ok: counts.ok, ko: counts.ko }))

    const byDow: Record<number, { ok: number; ko: number }> = {}
    for (let i = 0; i < 7; i++) byDow[i] = { ok: 0, ko: 0 }
    for (const s of submissions) {
        const d = dayjs(s.time).day()
        const idx = (d + 6) % 7
        if (isOk(s.verdict)) byDow[idx].ok += 1
        else byDow[idx].ko += 1
    }
    const submissionsByWeekday: OkKoPoint[] = WEEKDAYS.map((label, i) => ({
        label,
        ok: byDow[i].ok,
        ko: byDow[i].ko,
    }))

    const byHour: Record<number, { ok: number; ko: number }> = {}
    for (let h = 0; h < 24; h++) byHour[h] = { ok: 0, ko: 0 }
    for (const s of submissions) {
        const h = dayjs(s.time).hour()
        if (isOk(s.verdict)) byHour[h].ok += 1
        else byHour[h].ko += 1
    }
    const submissionsByHour: OkKoPoint[] = Array.from({ length: 24 }, (_, h) => ({
        label: h.toString(),
        ok: byHour[h].ok,
        ko: byHour[h].ko,
    }))

    const byMonth: Record<number, { ok: number; ko: number }> = {}
    for (let m = 0; m < 12; m++) byMonth[m] = { ok: 0, ko: 0 }
    for (const s of submissions) {
        const m = dayjs(s.time).month()
        if (isOk(s.verdict)) byMonth[m].ok += 1
        else byMonth[m].ko += 1
    }
    const submissionsByMonth: OkKoPoint[] = MONTHS.map((label, i) => ({
        label,
        ok: byMonth[i].ok,
        ko: byMonth[i].ko,
    }))

    const timeToFirstPass = computeTimeToFirstPassFunnel(submissions)
    const attemptsToSolve = computeAttemptsToSolve(submissions)

    const submissionVolumeOverTime: VolumeOverTimePoint[] = (() => {
        if (submissions.length === 0) return []
        const byYearMap = new Map<number, { ok: number; ko: number }>()
        for (const s of submissions) {
            const year = dayjs(s.time).year()
            const existing = byYearMap.get(year) ?? { ok: 0, ko: 0 }
            if (isOk(s.verdict)) existing.ok += 1
            else existing.ko += 1
            byYearMap.set(year, existing)
        }
        const years = Array.from(byYearMap.keys()).sort((a, b) => a - b)
        return years.map((year) => {
            const { ok = 0, ko = 0 } = byYearMap.get(year) ?? {}
            return { year, label: String(year), ok, ko }
        })
    })()

    return {
        heatmapData,
        heatmapStart,
        heatmapEnd,
        maxValue,
        usersOkKo,
        submissionsOkKo,
        verdicts,
        compilers,
        proglangs,
        submissionsByYear,
        submissionsByWeekday,
        submissionsByHour,
        submissionsByMonth,
        timeToFirstPass,
        attemptsToSolve,
        submissionVolumeOverTime,
    }
}

export function deriveSubmissionsByLanguageOverTime(
    problem_nm: string,
    submissions: StatisticsSubmission[],
    languagesTable: Record<string, { eng_name: string }>,
): {
    data: SubmissionsByLanguageOverTimePoint[]
    languageIds: string[]
    languageNames: Record<string, string>
} {
    const prefix = problem_nm + '_'
    const byYearAndLang = new Map<number, Record<string, number>>()
    const langIdSet = new Set<string>()
    for (const s of submissions) {
        if (!s.problem_id.startsWith(prefix)) continue
        const language_id = s.problem_id.slice(prefix.length)
        const year = dayjs(s.time).year()
        langIdSet.add(language_id)
        const row = byYearAndLang.get(year) ?? {}
        row[language_id] = (row[language_id] ?? 0) + 1
        byYearAndLang.set(year, row)
    }
    const years = Array.from(byYearAndLang.keys()).sort((a, b) => a - b)
    const languageIds = Array.from(langIdSet).sort((a, b) => {
        const na = languagesTable[a]?.eng_name ?? a
        const nb = languagesTable[b]?.eng_name ?? b
        return na.localeCompare(nb)
    })
    const languageNames: Record<string, string> = {}
    for (const lid of languageIds) {
        languageNames[lid] = languagesTable[lid]?.eng_name ?? lid
    }
    const data: SubmissionsByLanguageOverTimePoint[] = years.map((year) => {
        const row = byYearAndLang.get(year) ?? {}
        const point: SubmissionsByLanguageOverTimePoint = { year, label: String(year) }
        for (const lid of languageIds) {
            point[lid] = row[lid] ?? 0
        }
        return point
    })
    return { data, languageIds, languageNames }
}
