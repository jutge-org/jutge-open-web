'use client'

/**
 * Problem statistics page: pie charts (users, submissions, verdicts, compilers, languages),
 * submission heatmap by day, time-to-first-pass funnel, and stacked OK/KO bar charts.
 */

import { Heatmap } from '@/components/instructor/Heatmap'

import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import FloatingToolbar from '@/components/instructor/FloatingToolbar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
    fetchAbstractProblem,
    fetchInstructorAnonymousSubmissions,
    fetchInstructorProblemPopularityBuckets,
    fetchMiscHexColors,
    fetchTablesLanguages,
} from '@/actions/instructor'
import {
    AbstractProblem,
    ColorMapping,
    Distribution,
    HeatmapCalendar,
    Language,
    ProblemAnonymousSubmission,
    ProblemPopularityBucketEntry,
} from '@/lib/jutge_api_client'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import {
    CalendarIcon,
    ChartPieIcon,
    CheckIcon,
    RotateCcwIcon,
    SettingsIcon,
    TableIcon,
    XIcon,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Line,
    LineChart,
    Pie,
    PieChart,
    ReferenceLine,
    XAxis,
    YAxis,
} from 'recharts'

/** Single submission entry, used for date filtering and derived stats. */
type SubmissionEntry = ProblemAnonymousSubmission

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
] as const
/** Pie chart: slices below this percentage are grouped into "Others". */
const MIN_PERCENT_FOR_PIE_LABEL = 5

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getCategoryColor(key: string, category: string, colors: ColorMapping): string {
    if (!(category in colors) || !(key in colors[category])) {
        return 'hsl(var(--chart-1))'
    }
    return colors[category][key]
}

type OkKoPoint = { label: string; ok: number; ko: number }

/** Submission volume over time: one point per year, ok/ko counts. */
type VolumeOverTimePoint = { year: number; label: string; ok: number; ko: number }

/** Submissions by (human) language over time: one point per year, one series per language. */
type SubmissionsByLanguageOverTimePoint = {
    year: number
    label: string
    [language_id: string]: number | string
}

/** Time-to-first-pass funnel: at each hour threshold T, cumulative % of solvers who passed by T. */
type TimeToFirstPassPoint = { hours: number; label: string; cumulativePct: number }

/** Compute per-student Δt (first AC − first submission in hours), then build cumulative curve. */
function computeTimeToFirstPassFunnel(submissions: SubmissionEntry[]): {
    curve: TimeToFirstPassPoint[]
    totalSolvers: number
    neverSolved: number
    medianHours: number | null
} {
    const byUser = new Map<string, { firstTime: number; firstAcTime: number | null }>()
    for (const s of submissions) {
        const t = dayjs(s.time).valueOf()
        const existing = byUser.get(s.anonymous_user_id)
        if (!existing) {
            byUser.set(s.anonymous_user_id, {
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

/** Attempts-to-solve: per-student count of submissions up to (and including) first AC. */
type AttemptsToSolvePoint = {
    attempts: number
    label: string
    passed: number
    neverPassed?: number
}

function computeAttemptsToSolve(submissions: SubmissionEntry[]): {
    histogram: AttemptsToSolvePoint[]
    medianAttempts: number | null
    totalPassed: number
    neverPassedCount: number
} {
    // Group by user and sort each user's submissions by time
    const byUser = new Map<string, { time: string; verdict: string }[]>()
    for (const s of submissions) {
        let list = byUser.get(s.anonymous_user_id)
        if (!list) {
            list = []
            byUser.set(s.anonymous_user_id, list)
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
            attemptCounts.push(firstAcIndex + 1) // 1-based attempts
        } else {
            neverPassedCount += 1
        }
    }

    attemptCounts.sort((a, b) => a - b)
    const totalPassed = attemptCounts.length
    const medianAttempts = totalPassed > 0 ? attemptCounts[Math.floor(totalPassed / 2)] : null

    // Build histogram buckets: 1, 2, 3, ... maxAttempts, then optionally "Never passed"
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
function deriveChartData(submissions: SubmissionEntry[]) {
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
    const heatmapStart =
        submissions.length > 0 ? dayjs(submissions[0].time).startOf('day') : dayjs().startOf('day')

    // Users: unique users with at least one AC = OK, others = KO (derived from submissions only)
    const userStatus = new Map<string, boolean>()
    for (const s of submissions) {
        const hasAc = userStatus.get(s.anonymous_user_id)
        if (!hasAc) userStatus.set(s.anonymous_user_id, s.verdict === 'AC')
        else if (s.verdict === 'AC') userStatus.set(s.anonymous_user_id, true)
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

    // Verdicts, compilers, proglangs derived from submissions only
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
        const idx = (d + 6) % 7 // Sunday=0 → index 6 (last); Monday=0 (first)
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

    // Submission volume over time: one point per year (ok = green base, ko = red stacked)
    const submissionVolumeOverTime: VolumeOverTimePoint[] = (() => {
        if (submissions.length === 0) return []
        const byYear = new Map<number, { ok: number; ko: number }>()
        for (const s of submissions) {
            const year = dayjs(s.time).year()
            const existing = byYear.get(year) ?? { ok: 0, ko: 0 }
            if (isOk(s.verdict)) existing.ok += 1
            else existing.ko += 1
            byYear.set(year, existing)
        }
        const years = Array.from(byYear.keys()).sort((a, b) => a - b)
        return years.map((year) => {
            const { ok = 0, ko = 0 } = byYear.get(year) ?? {}
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

// -----------------------------------------------------------------------------
// Statistics dashboard card (top summary)
// -----------------------------------------------------------------------------

type DashboardStats = {
    totalSubmissions: number
    totalUsers: number
    passRatePct: number
    passedCount: number
    neverPassed: number
    seCount: number
}

function StatisticsDashboardCard({ stats }: { stats: DashboardStats }) {
    const totalUsers = stats.totalUsers
    const avgPerStudent = totalUsers > 0 ? (stats.totalSubmissions / totalUsers).toFixed(1) : '—'

    return (
        <Card className="w-full overflow-hidden">
            <CardContent className="p-0">
                <div className="grid grid-cols-2 md:grid-cols-6">
                    <div className="flex flex-col gap-1 p-4 md:p-5">
                        <span className="text-xs font-medium uppercase tracking-wider ">
                            Submissions
                        </span>
                        <span className="text-4xl font-bold text-gray-500">
                            {stats.totalSubmissions}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 p-4 md:p-5">
                        <span className="text-xs font-medium uppercase tracking-wider">Users</span>
                        <span className="text-4xl font-bold text-gray-500">{stats.totalUsers}</span>
                    </div>
                    <div className="flex flex-col gap-1 p-4 md:p-5">
                        <span className="text-xs font-medium uppercase tracking-wider">
                            Avg subs/user
                        </span>
                        <span className="text-4xl font-bold text-gray-500">{avgPerStudent}</span>
                    </div>
                    <div className="flex flex-col gap-1 p-4 md:p-5">
                        <span className="text-xs font-medium uppercase tracking-wider">
                            AC rate
                        </span>
                        <span className="text-4xl font-bold text-gray-500">
                            {totalUsers > 0 ? Math.round(stats.passRatePct) : 0}%
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 p-4 md:p-5">
                        <span className="text-xs font-medium uppercase tracking-wider">Fails</span>
                        <span className="text-4xl font-bold text-gray-500">
                            {stats.neverPassed}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 p-4 md:p-5">
                        <span className="text-xs font-medium uppercase tracking-wider">
                            <span
                                className={stats.seCount > 4 ? 'text-red-600 font-bold' : undefined}
                            >
                                Setter errors
                            </span>
                        </span>
                        <span className="text-4xl font-bold text-gray-500">{stats.seCount}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// -----------------------------------------------------------------------------
// Chart components
// -----------------------------------------------------------------------------

type MyPieChartProps = {
    data: Distribution
    category: string
    colors: ColorMapping
}

/** Pie/table toggle; small slices (< MIN_PERCENT_FOR_PIE_LABEL) are grouped as "Others". */
function MyPieChart({ data, category, colors }: MyPieChartProps) {
    const [chartVisible, setChartVisible] = useState(true)
    const dataClone = structuredClone(data)
    const total = Math.max(
        1,
        Object.values(dataClone).reduce((a, b) => a + b, 0),
    )
    for (const key of Object.keys(dataClone)) {
        dataClone[key] = Math.round((dataClone[key] / total) * 1000) / 10
    }

    const chartConfig: Record<string, { label: string; color: string }> = {
        value: { label: 'Percentage', color: 'transparent' },
    }
    let othersSum = 0
    let othersCount = 0
    let singleKey = ''
    for (const key of Object.keys(dataClone)) {
        if (dataClone[key] < MIN_PERCENT_FOR_PIE_LABEL) {
            othersSum += dataClone[key]
            othersCount += 1
            singleKey = key
        } else {
            chartConfig[key] = {
                label: key,
                color: getCategoryColor(key, category, colors),
            }
        }
    }

    const chartData = Object.entries(dataClone)
        .filter(([, value]) => value >= MIN_PERCENT_FOR_PIE_LABEL)
        .map(([key, value]) => ({
            label: key,
            value,
            fill: chartConfig[key]?.color ?? 'hsl(var(--chart-5))',
        }))
    if (othersSum > 0) {
        const label = othersCount === 1 ? singleKey : 'Others'
        chartData.push({
            label,
            value: othersSum,
            fill: 'hsl(var(--chart-5))',
        })
        chartConfig[label] = { label, color: 'hsl(var(--chart-5))' }
    }

    const chart = (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px] [&_.recharts-text]:fill-background"
        >
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="label" hideLabel />} />
                <Pie data={chartData} dataKey="value" innerRadius={60}>
                    <LabelList
                        dataKey="label"
                        className="fill-background"
                        stroke="none"
                        fontSize={11}
                        formatter={(value) => chartConfig[String(value)]?.label}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    )

    const tableTotal = Object.values(data).reduce((s, n) => s + n, 0)
    const table = (
        <ScrollArea className="h-[300px] w-full">
            <Table>
                <TableBody>
                    {Object.entries(data)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell className="text-end">{value}</TableCell>
                                <TableCell className="text-end">
                                    {tableTotal > 0 ? ((value / tableTotal) * 100).toFixed(1) : 0}%
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </ScrollArea>
    )

    return (
        <>
            {chartVisible ? chart : table}
            <ToggleGroup
                type="single"
                onValueChange={(value) => setChartVisible(value === 'pie')}
                className="mb-2"
                defaultValue="pie"
            >
                <ToggleGroupItem value="pie" aria-label="Pie chart">
                    <ChartPieIcon className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table">
                    <TableIcon className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </>
    )
}

function DatePickerField({
    label,
    value,
    onChange,
    disabled,
}: {
    label: string
    value: Date
    onChange: (d: Date | undefined) => void
    disabled?: boolean
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            'w-[160px] justify-start text-left font-normal',
                            !value && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? dayjs(value).format('YYYY-MM-DD') : <span>{label}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={value} onSelect={onChange} />
                </PopoverContent>
            </Popover>
        </div>
    )
}

type StatisticsSettingsDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    abstractProblem: AbstractProblem
    selectedProblemIds: Set<string>
    startDate: Date
    endDate: Date
    defaultStartDate: Date
    defaultEndDate: Date
    onAccept: (selectedProblemIds: Set<string>, startDate: Date, endDate: Date) => void
}

function StatisticsSettingsDialog({
    open,
    onOpenChange,
    abstractProblem,
    selectedProblemIds,
    startDate,
    endDate,
    defaultStartDate,
    defaultEndDate,
    onAccept,
}: StatisticsSettingsDialogProps) {
    const problems = Object.values(abstractProblem.problems)

    const [draftSelectedProblemIds, setDraftSelectedProblemIds] = useState<Set<string>>(
        () => new Set(selectedProblemIds),
    )
    const [draftStartDate, setDraftStartDate] = useState<Date>(() => startDate)
    const [draftEndDate, setDraftEndDate] = useState<Date>(() => endDate)

    useEffect(() => {
        if (open) {
            setDraftSelectedProblemIds(new Set(selectedProblemIds))
            setDraftStartDate(startDate)
            setDraftEndDate(endDate)
        }
    }, [open, selectedProblemIds, startDate, endDate])

    const handleResetDraft = () => {
        setDraftSelectedProblemIds(new Set(problems.map((p) => p.problem_id)))
        setDraftStartDate(defaultStartDate)
        setDraftEndDate(defaultEndDate)
    }

    const handleAccept = () => {
        onAccept(draftSelectedProblemIds, draftStartDate, draftEndDate)
        onOpenChange(false)
    }

    return (
        <FloatingToolbar>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        size="icon"
                        variant="default"
                        className="h-14 w-14 rounded-full"
                        aria-label="Open statistics settings"
                    >
                        <SettingsIcon className="h-6 w-6" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Statistics settings</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-2">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                Problems
                            </span>
                            <div className="flex flex-col gap-2 text-sm">
                                {problems
                                    .sort((a, b) => a.problem_id.localeCompare(b.problem_id))
                                    .map((p) => (
                                        <span
                                            key={p.problem_id}
                                            className="flex items-center gap-4"
                                        >
                                            <Switch
                                                checked={draftSelectedProblemIds.has(p.problem_id)}
                                                onCheckedChange={(checked) =>
                                                    setDraftSelectedProblemIds((prev) => {
                                                        const next = new Set(prev)
                                                        if (checked) next.add(p.problem_id)
                                                        else next.delete(p.problem_id)
                                                        return next
                                                    })
                                                }
                                                aria-label={`Include ${p.problem_id} in statistics`}
                                            />
                                            <span className="font-medium text-foreground w-20">
                                                {p.problem_id}
                                            </span>
                                            <span
                                                className="max-w-[200px] truncate sm:max-w-none"
                                                title={p.title}
                                            >
                                                {p.title}
                                            </span>
                                        </span>
                                    ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-end gap-2">
                            <DatePickerField
                                label="Start date"
                                value={draftStartDate}
                                onChange={(d) => d != null && setDraftStartDate(d)}
                            />
                            <DatePickerField
                                label="End date"
                                value={draftEndDate}
                                onChange={(d) => d != null && setDraftEndDate(d)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col gap-0">
                        <Button variant="outline" onClick={handleResetDraft} className="w-full">
                            <RotateCcwIcon className="h-4 w-4" />
                            Reset
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" className="w-full">
                                <XIcon className="h-4 w-4" />
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={handleAccept} className="w-full">
                            <CheckIcon className="h-4 w-4" />
                            Accept
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </FloatingToolbar>
    )
}

function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">{children}</CardContent>
        </Card>
    )
}

type StackedOkKoBarChartProps = {
    data: OkKoPoint[]
    colors: ColorMapping
}

function StackedOkKoBarChart({ data, colors }: StackedOkKoBarChartProps) {
    const chartConfig = {
        ok: { label: 'OK', color: getCategoryColor('OK', 'statuses', colors) },
        ko: { label: 'KO', color: getCategoryColor('KO', 'statuses', colors) },
    }
    return (
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="ko" fill="var(--color-ko)" radius={[0, 0, 4, 4]} stackId="a" />
                <Bar dataKey="ok" fill="var(--color-ok)" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
        </ChartContainer>
    )
}

type TimeToFirstPassFunnelProps = {
    curve: TimeToFirstPassPoint[]
    totalSolvers: number
    neverSolved: number
    medianHours: number | null
}

function TimeToFirstPassFunnelChart({
    curve,
    totalSolvers,
    neverSolved,
    medianHours,
}: TimeToFirstPassFunnelProps) {
    const chartConfig = {
        hours: { label: 'Time since first submission', color: 'hsl(var(--muted-foreground))' },
        cumulativePct: { label: 'Cumulative % solved', color: 'hsl(var(--chart-1))' },
    }
    const formatPct = (value: unknown) =>
        [`${Number(value).toFixed(1)}%`, 'Solved by this time'] as [string, string]
    const formatTimeLabel = (label: unknown) => {
        const h = Number(label)
        return h < 1
            ? `${Math.round(h * 60)} min`
            : h < 24
              ? `${h} h`
              : `${(h / 24).toFixed(1)} days`
    }
    return (
        <>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={curve} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="hours"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(h: number) =>
                            h < 1 ? `${Math.round(h * 60)}m` : h < 24 ? `${h}h` : `${h / 24}d`
                        }
                    />
                    <YAxis
                        domain={[0, 100]}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v: number) => `${v}%`}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={formatPct}
                                labelFormatter={formatTimeLabel}
                            />
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="cumulativePct"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={4}
                        dot={false}
                        connectNulls
                    />
                </LineChart>
            </ChartContainer>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {totalSolvers > 0 && (
                    <>
                        <span>Solvers: {totalSolvers}</span>
                        {neverSolved > 0 && <span>Never solved: {neverSolved}</span>}
                        {medianHours != null && (
                            <span>
                                Median time-to-solve:{' '}
                                {medianHours < 1
                                    ? `${Math.round(medianHours * 60)} min`
                                    : medianHours < 24
                                      ? `${medianHours.toFixed(1)} h`
                                      : `${(medianHours / 24).toFixed(1)} days`}
                            </span>
                        )}
                    </>
                )}
                {totalSolvers === 0 && <span>No solvers yet</span>}
            </div>
        </>
    )
}

type AttemptsToSolveChartProps = {
    histogram: AttemptsToSolvePoint[]
    medianAttempts: number | null
    totalPassed: number
    neverPassedCount: number
    colors: ColorMapping
}

function AttemptsToSolveChart({
    histogram,
    medianAttempts,
    totalPassed,
    neverPassedCount,
    colors,
}: AttemptsToSolveChartProps) {
    const chartConfig = {
        label: { label: 'Attempts', color: 'hsl(var(--muted-foreground))' },
        passed: {
            label: 'Passed (AC)',
            color: getCategoryColor('OK', 'statuses', colors),
        },
        neverPassed: {
            label: 'Did not pass',
            color: getCategoryColor('KO', 'statuses', colors),
        },
    }
    const formatCount = (value: unknown) => [String(value), 'Students'] as [string, string]
    return (
        <>
            <div className="flex w-full items-stretch gap-1">
                <div className="flex w-[1.125rem] shrink-0 items-center justify-center self-stretch sm:w-5">
                    <span className="whitespace-nowrap text-xs text-muted-foreground [writing-mode:vertical-rl] rotate-180">
                        Number of students
                    </span>
                </div>
                <ChartContainer config={chartConfig} className="h-[300px] min-w-0 flex-1">
                    <BarChart
                        data={histogram}
                        margin={{ top: 32, right: 8, bottom: 8, left: 4 }}
                        barCategoryGap="10%"
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            label={{
                                value: 'Attempts to first AC',
                                position: 'insideBottom',
                                offset: -4,
                            }}
                        />
                        <YAxis tickLine={false} axisLine={false} width={48} tickMargin={8} />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    formatter={formatCount}
                                    labelFormatter={(label) => `Attempts: ${label}`}
                                />
                            }
                        />
                        {medianAttempts != null && (
                            <ReferenceLine
                                x={String(medianAttempts)}
                                stroke="hsl(var(--chart-3))"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                label={{
                                    value: 'Median',
                                    position: 'top',
                                    fill: 'hsl(var(--chart-3))',
                                    offset: 4,
                                }}
                            />
                        )}
                        <Bar
                            dataKey="passed"
                            fill="var(--color-passed)"
                            stackId="a"
                            radius={[0, 0, 4, 4]}
                            name="Passed (AC)"
                        />
                        <Bar
                            dataKey="neverPassed"
                            fill="var(--color-neverPassed)"
                            stackId="a"
                            radius={[4, 4, 0, 0]}
                            name="Did not pass"
                        />
                    </BarChart>
                </ChartContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {totalPassed > 0 && (
                    <>
                        <span>Solvers: {totalPassed}</span>
                        {neverPassedCount > 0 && <span>Did not pass: {neverPassedCount}</span>}
                        {medianAttempts != null && (
                            <span>Median attempts to solve: {medianAttempts}</span>
                        )}
                    </>
                )}
                {totalPassed === 0 && neverPassedCount === 0 && <span>No submissions yet</span>}
                {totalPassed === 0 && neverPassedCount > 0 && (
                    <span>No solvers yet ({neverPassedCount} attempted)</span>
                )}
            </div>
        </>
    )
}

type SubmissionVolumeAreaChartProps = {
    data: VolumeOverTimePoint[]
    colors: ColorMapping
}

function SubmissionVolumeAreaChart({ data, colors }: SubmissionVolumeAreaChartProps) {
    const chartConfig = {
        year: { label: 'Year', color: 'hsl(var(--muted-foreground))' },
        ok: {
            label: 'OK (AC)',
            color: getCategoryColor('OK', 'statuses', colors),
        },
        ko: {
            label: 'KO',
            color: getCategoryColor('KO', 'statuses', colors),
        },
    }
    const formatCount = (value: unknown) => [String(value), 'Submissions'] as [string, string]
    if (data.length === 0) {
        return (
            <div className="flex h-[160px] w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                No submission data
            </div>
        )
    }
    return (
        <ChartContainer config={chartConfig} className="h-[160px] w-full aspect-auto">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(y: number) => String(y)}
                />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={formatCount}
                            labelFormatter={(_, payload) => {
                                const p = payload?.[0]?.payload as VolumeOverTimePoint | undefined
                                return p ? String(p.year) : ''
                            }}
                        />
                    }
                />
                <Area
                    type="monotone"
                    dataKey="ok"
                    stackId="a"
                    stroke="var(--color-ok)"
                    fill="var(--color-ok)"
                    fillOpacity={0.6}
                    name="OK (AC)"
                />
                <Area
                    type="monotone"
                    dataKey="ko"
                    stackId="a"
                    stroke="var(--color-ko)"
                    fill="var(--color-ko)"
                    fillOpacity={0.6}
                    name="KO"
                />
            </AreaChart>
        </ChartContainer>
    )
}

const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
] as const

type SubmissionsByLanguageChartProps = {
    data: SubmissionsByLanguageOverTimePoint[]
    languageIds: string[]
    languageNames: Record<string, string>
}

function SubmissionsByLanguageChart({
    data,
    languageIds,
    languageNames,
}: SubmissionsByLanguageChartProps) {
    const chartConfig = useMemo(() => {
        const config: Record<string, { label: string; color: string }> = {
            year: { label: 'Year', color: 'hsl(var(--muted-foreground))' },
        }
        languageIds.forEach((lid, i) => {
            config[lid] = {
                label: languageNames[lid] ?? lid,
                color: CHART_COLORS[i % CHART_COLORS.length],
            }
        })
        return config
    }, [languageIds, languageNames])
    if (data.length === 0) {
        return (
            <div className="flex h-[160px] w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                No submission data by language
            </div>
        )
    }
    return (
        <ChartContainer config={chartConfig} className="h-[160px] w-full aspect-auto">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(y: number) => String(y)}
                />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            labelFormatter={(_, payload) => {
                                const p = payload?.[0]?.payload as
                                    | SubmissionsByLanguageOverTimePoint
                                    | undefined
                                return p ? `Year ${p.year}` : ''
                            }}
                        />
                    }
                />
                <ChartLegend content={<ChartLegendContent />} />
                {languageIds.map((lid, i) => (
                    <Line
                        key={lid}
                        type="monotone"
                        dataKey={lid}
                        stroke={CHART_COLORS[i % CHART_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name={languageNames[lid] ?? lid}
                    />
                ))}
            </LineChart>
        </ChartContainer>
    )
}

/** X-axis tick: logarithmic scale as 2^0, 2^1, 2^2, … (plus 0 and open-ended tail). */
function formatPopularityBucketPowerLabel(b: ProblemPopularityBucketEntry): string {
    const { bucket_min, bucket_max, log2_bucket } = b
    const openEnded = bucket_max > 1e15 || bucket_max <= bucket_min
    if (bucket_min === 0 && bucket_max <= 1) {
        return '0'
    }
    if (openEnded) {
        return `2^${log2_bucket}+`
    }
    return `2^${log2_bucket}`
}

/** Bucket row for chart (X = 2^k scale, Y = how many problems fall in that range). */
function buildPopularityChartData(buckets: ProblemPopularityBucketEntry[]) {
    return [...buckets]
        .sort((a, b) => a.bucket_min - b.bucket_min)
        .map((b) => ({
            label: formatPopularityBucketPowerLabel(b),
            problem_count: b.problem_count,
        }))
}

/** Label of the bucket where this problem's submission count falls (half-open [min, max), last bucket inclusive). */
function findPopularityBucketLabel(
    buckets: ProblemPopularityBucketEntry[],
    totalSubmissions: number,
): string | null {
    if (buckets.length === 0) return null
    const sorted = [...buckets].sort((a, b) => a.bucket_min - b.bucket_min)
    for (let i = 0; i < sorted.length; i++) {
        const b = sorted[i]
        const isLast = i === sorted.length - 1
        if (isLast) {
            if (totalSubmissions >= b.bucket_min) return formatPopularityBucketPowerLabel(b)
        } else if (totalSubmissions >= b.bucket_min && totalSubmissions < b.bucket_max) {
            return formatPopularityBucketPowerLabel(b)
        }
    }
    if (totalSubmissions < sorted[0].bucket_min) {
        return formatPopularityBucketPowerLabel(sorted[0])
    }
    return formatPopularityBucketPowerLabel(sorted[sorted.length - 1])
}

type ProblemPopularityChartProps = {
    buckets: ProblemPopularityBucketEntry[]
    problemTotalSubmissions: number
}

function ProblemPopularityChart({ buckets, problemTotalSubmissions }: ProblemPopularityChartProps) {
    const chartData = useMemo(() => buildPopularityChartData(buckets), [buckets])
    const markerLabel = useMemo(
        () => findPopularityBucketLabel(buckets, problemTotalSubmissions),
        [buckets, problemTotalSubmissions],
    )
    const chartConfig = {
        label: { label: 'Submissions (per problem)', color: 'hsl(var(--muted-foreground))' },
        problem_count: {
            label: 'Problems in bucket',
            color: 'hsl(221 83% 53%)',
        },
    }
    const formatCount = (value: unknown) => [String(value), 'Problems'] as [string, string]

    if (chartData.length === 0) {
        return (
            <div className="flex h-[220px] w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                No popularity data
            </div>
        )
    }

    return (
        <>
            <ChartContainer config={chartConfig} className="h-[350px] w-full aspect-auto">
                <BarChart
                    data={chartData}
                    margin={{ top: 28, right: 12, bottom: 56, left: 48 }}
                    barCategoryGap="12%"
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        tick={{ fontSize: 10 }}
                        angle={-35}
                        textAnchor="end"
                        height={52}
                        label={{
                            value: 'Submissions per problem (2^k scale)',
                            position: 'insideBottom',
                            offset: -2,
                            style: { fontSize: 11 },
                        }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={44}
                        allowDecimals={false}
                        label={{
                            value: 'Number of problems',
                            angle: -90,
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' },
                        }}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={formatCount}
                                labelFormatter={(label) => `Bucket starts at ${label}`}
                            />
                        }
                    />
                    {markerLabel != null && (
                        <ReferenceLine
                            x={markerLabel}
                            stroke="hsl(var(--chart-3))"
                            strokeWidth={2}
                            label={{
                                value: 'This problem',
                                position: 'top',
                                fill: 'hsl(var(--chart-3))',
                                fontSize: 11,
                            }}
                        />
                    )}
                    <Bar
                        dataKey="problem_count"
                        fill="var(--color-problem_count)"
                        radius={[4, 4, 0, 0]}
                        name="Problems in bucket"
                    />
                </BarChart>
            </ChartContainer>
        </>
    )
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export function ProblemStatisticsView() {
    const { problem_nm } = useParams<{ problem_nm: string }>()
    const [statistics, setStatistics] = useState<{
        submissions: ProblemAnonymousSubmission[]
    } | null>(null)
    const [colors, setColors] = useState<ColorMapping | null>(null)
    const [languagesTable, setLanguagesTable] = useState<Record<string, Language> | null>(null)
    const [abstractProblem, setAbstractProblem] = useState<AbstractProblem | null>(null)
    const [selectedProblemIds, setSelectedProblemIds] = useState<Set<string>>(new Set())
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [popularityBuckets, setPopularityBuckets] = useState<
        ProblemPopularityBucketEntry[] | null
    >(null)

    useEffect(() => {
        async function fetchData() {
            const [submissions, colorMap, languages, abstract, buckets] = await Promise.all([
                fetchInstructorAnonymousSubmissions(problem_nm),
                fetchMiscHexColors(),
                fetchTablesLanguages(),
                fetchAbstractProblem(problem_nm),
                fetchInstructorProblemPopularityBuckets(),
            ])
            setStatistics({ submissions })
            setColors(colorMap)
            setLanguagesTable(languages)
            setAbstractProblem(abstract)
            setPopularityBuckets(buckets)
            setSelectedProblemIds(
                new Set(Object.values(abstract.problems).map((p) => p.problem_id)),
            )
        }
        fetchData()
    }, [problem_nm])

    const defaultStartDate = useMemo(() => {
        if (!statistics || statistics.submissions.length === 0)
            return dayjs().startOf('day').toDate()
        return dayjs(statistics.submissions[0].time).startOf('day').toDate()
    }, [statistics])
    const defaultEndDate = useMemo(() => dayjs().startOf('day').toDate(), [])

    useEffect(() => {
        if (!statistics || startDate !== null) return
        setStartDate(defaultStartDate)
        setEndDate(defaultEndDate)
    }, [statistics, defaultStartDate, defaultEndDate, startDate])

    const filteredSubmissions = useMemo(() => {
        if (!statistics || startDate === null || endDate === null)
            return statistics?.submissions ?? []
        const start = dayjs(startDate).startOf('day')
        const end = dayjs(endDate).endOf('day')
        return statistics.submissions.filter((s) => {
            const t = dayjs(s.time)
            const inRange = !t.isBefore(start) && !t.isAfter(end)
            const selected = selectedProblemIds.has(s.problem_id)
            return inRange && selected
        })
    }, [statistics, startDate, endDate, selectedProblemIds])

    /** Submissions filtered by date only (all problem_ids). Used for "Submissions by language" card. */
    const submissionsByDateOnly = useMemo(() => {
        if (!statistics || startDate === null || endDate === null)
            return statistics?.submissions ?? []
        const start = dayjs(startDate).startOf('day')
        const end = dayjs(endDate).endOf('day')
        return statistics.submissions.filter((s) => {
            const t = dayjs(s.time)
            return !t.isBefore(start) && !t.isAfter(end)
        })
    }, [statistics, startDate, endDate])

    const derived = useMemo(() => deriveChartData(filteredSubmissions), [filteredSubmissions])

    /** Submissions by (human) language over time: one point per year per language, date-filtered only. problem_id = problem_nm + '_' + language_id. */
    const submissionsByLanguageOverTime = useMemo((): {
        data: SubmissionsByLanguageOverTimePoint[]
        languageIds: string[]
        languageNames: Record<string, string>
    } => {
        if (!problem_nm || !languagesTable) return { data: [], languageIds: [], languageNames: {} }
        const prefix = problem_nm + '_'
        const byYearAndLang = new Map<number, Record<string, number>>()
        const langIdSet = new Set<string>()
        for (const s of submissionsByDateOnly) {
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
    }, [problem_nm, languagesTable, submissionsByDateOnly])

    const totalUsers = derived.usersOkKo.OK + derived.usersOkKo.KO
    const dashboardStats: DashboardStats = {
        totalSubmissions: filteredSubmissions.length,
        totalUsers,
        passRatePct: totalUsers > 0 ? (derived.usersOkKo.OK / totalUsers) * 100 : 0,
        passedCount: derived.usersOkKo.OK,
        neverPassed: derived.usersOkKo.KO,
        seCount: filteredSubmissions.filter((s) => s.verdict === 'SE').length,
    }

    if (
        statistics === null ||
        colors === null ||
        abstractProblem === null ||
        startDate === null ||
        endDate === null ||
        popularityBuckets === null
    ) {
        return <SimpleSpinner size={64} className="pt-24" />
    }

    const handleAcceptSettings = (ids: Set<string>, start: Date, end: Date) => {
        setSelectedProblemIds(ids)
        setStartDate(start)
        setEndDate(end)
    }

    const problemTotalSubmissionsAllTime = statistics.submissions.length

    return (
        <div className="flex w-full flex-col gap-4">
            <StatisticsDashboardCard stats={dashboardStats} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <StatCard title="User statuses">
                    <MyPieChart data={derived.usersOkKo} category="statuses" colors={colors} />
                </StatCard>
                <StatCard title="Submission statuses">
                    <MyPieChart
                        data={derived.submissionsOkKo}
                        category="statuses"
                        colors={colors}
                    />
                </StatCard>
                <StatCard title="Submissions by verdict">
                    <MyPieChart data={derived.verdicts} category="verdicts" colors={colors} />
                </StatCard>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <StatCard title="Compilers">
                    <MyPieChart data={derived.compilers} category="compilers" colors={colors} />
                </StatCard>
                <StatCard title="Programming languages">
                    <MyPieChart data={derived.proglangs} category="proglangs" colors={colors} />
                </StatCard>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="w-full">
                    <CardHeader className="p-4">
                        <CardTitle>Problem popularity</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            The more to the right, the more submissions the problem has and more
                            popular it is.
                        </p>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <ProblemPopularityChart
                            buckets={popularityBuckets}
                            problemTotalSubmissions={problemTotalSubmissionsAllTime}
                        />
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="p-4">
                        <CardTitle>Attempts to solve</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Curve shows how many tries it took each student to get AC.
                        </p>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <AttemptsToSolveChart
                            histogram={derived.attemptsToSolve.histogram}
                            medianAttempts={derived.attemptsToSolve.medianAttempts}
                            totalPassed={derived.attemptsToSolve.totalPassed}
                            neverPassedCount={derived.attemptsToSolve.neverPassedCount}
                            colors={colors}
                        />
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader className="p-4">
                        <CardTitle>Time to solve</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Cumulative % of students who had AC by a given time since their first
                            submission. Students who never passed are excluded from the curve.
                        </p>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <TimeToFirstPassFunnelChart
                            curve={derived.timeToFirstPass.curve}
                            totalSolvers={derived.timeToFirstPass.totalSolvers}
                            neverSolved={derived.timeToFirstPass.neverSolved}
                            medianHours={derived.timeToFirstPass.medianHours}
                        />
                    </CardContent>
                </Card>
            </div>
            <Card className="w-full">
                <CardHeader className="p-4">
                    <CardTitle>Submissions by day</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <Heatmap
                        data={derived.heatmapData}
                        start={derived.heatmapStart}
                        end={derived.heatmapEnd}
                        maxValue={derived.maxValue}
                    />
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader className="p-4">
                    <CardTitle>Submission over time</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <SubmissionVolumeAreaChart
                        data={derived.submissionVolumeOverTime}
                        colors={colors}
                    />
                </CardContent>
            </Card>
            {Object.values(abstractProblem.problems).length > 1 && (
                <Card className="w-full">
                    <CardHeader className="p-4">
                        <CardTitle>Submissions by language</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <SubmissionsByLanguageChart
                            data={submissionsByLanguageOverTime.data}
                            languageIds={submissionsByLanguageOverTime.languageIds}
                            languageNames={submissionsByLanguageOverTime.languageNames}
                        />
                    </CardContent>
                </Card>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <StatCard title="Submissions by year">
                    <StackedOkKoBarChart data={derived.submissionsByYear} colors={colors} />
                </StatCard>
                <StatCard title="Submissions by month of year">
                    <StackedOkKoBarChart data={derived.submissionsByMonth} colors={colors} />
                </StatCard>
                <StatCard title="Submissions by day of week">
                    <StackedOkKoBarChart data={derived.submissionsByWeekday} colors={colors} />
                </StatCard>
                <StatCard title="Submissions by hour of day">
                    <StackedOkKoBarChart data={derived.submissionsByHour} colors={colors} />
                </StatCard>
            </div>
            <StatisticsSettingsDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                abstractProblem={abstractProblem}
                selectedProblemIds={selectedProblemIds}
                startDate={startDate}
                endDate={endDate}
                defaultStartDate={defaultStartDate}
                defaultEndDate={defaultEndDate}
                onAccept={handleAcceptSettings}
            />
        </div>
    )
}
