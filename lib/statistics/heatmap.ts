import type { HeatmapCalendar } from '@/lib/jutge_api_client'

const DAY_SECONDS = 86_400
const ROW_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

/**
 * Floor for the window width. The calendar spans the user's whole history, but a brand new
 * account would otherwise collapse to a couple of columns, so always show at least a year.
 */
const MIN_WEEKS_SHOWN = 53

export type HeatmapCell = {
    value: number
    dateLabel: string | null
    /** Day key (UTC-midnight seconds), or null for the padding days after today. */
    dateTs: number | null
}

export type HeatmapWeekGrid = {
    grid: HeatmapCell[][]
    monthLabels: (string | null)[]
    maxValue: number
}

/**
 * Day key for a calendar date: the API buckets the heatmap by UTC midnight, so a date is
 * turned into a key from its calendar fields rather than by shifting the instant.
 */
export function calendarDayTs(date: Date): number {
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000)
}

/** Day key of a submission timestamp, so it lines up with the calendar cells. */
export function calendarDayTsFromMs(ms: number): number {
    return calendarDayTs(new Date(ms))
}

function dayTsToDate(ts: number): Date {
    return new Date(ts * 1000)
}

/** Day keys are UTC midnights, so every label must be read back in UTC. */
export function formatDayLabel(ts: number): string {
    return dayTsToDate(ts).toLocaleDateString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function formatMonthLabel(ts: number): string {
    return dayTsToDate(ts).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' })
}

function mondayIndex(ts: number): number {
    const day = dayTsToDate(ts).getUTCDay()
    return day === 0 ? 6 : day - 1
}

/**
 * Build a GitHub-style week-column heatmap spanning the user's whole history up to `today`.
 *
 * The window always ends on today rather than on the last submission, so someone who has not
 * submitted in months still sees empty days up to the present. It starts at their first recorded
 * day — the API has no account creation date, so the earliest heatmap entry stands in for it.
 * Days after today are padding: they carry no date and render blank.
 */
export function buildHeatmapWeekGrid(heatmap: HeatmapCalendar, today: Date = new Date()): HeatmapWeekGrid {
    const valueByDay = new Map<number, number>()
    for (const entry of heatmap) {
        valueByDay.set(entry.date, entry.value)
    }

    const todayTs = calendarDayTs(today)
    const gridEndTs = todayTs + (6 - mondayIndex(todayTs)) * DAY_SECONDS

    const minStartTs = gridEndTs - (MIN_WEEKS_SHOWN * 7 - 1) * DAY_SECONDS
    const firstDayTs = heatmap.length > 0 ? Math.min(...heatmap.map((entry) => entry.date)) : minStartTs
    const windowStartTs = Math.min(firstDayTs, minStartTs)
    // Align the first column to a Monday so every column is a whole week.
    const gridStartTs = windowStartTs - mondayIndex(windowStartTs) * DAY_SECONDS

    const weekCount = Math.round((gridEndTs - gridStartTs) / (7 * DAY_SECONDS)) + 1

    const grid: HeatmapCell[][] = ROW_KEYS.map(() =>
        Array.from({ length: weekCount }, () => ({ value: 0, dateLabel: null, dateTs: null })),
    )
    const monthLabels: (string | null)[] = Array.from({ length: weekCount }, () => null)
    let maxValue = 0

    for (let week = 0; week < weekCount; week++) {
        const weekStartTs = gridStartTs + week * 7 * DAY_SECONDS

        for (let row = 0; row < 7; row++) {
            const dayTs = weekStartTs + row * DAY_SECONDS
            if (dayTs > todayTs) {
                continue
            }

            const value = valueByDay.get(dayTs) ?? 0
            grid[row]![week] = { value, dateLabel: formatDayLabel(dayTs), dateTs: dayTs }
            maxValue = Math.max(maxValue, value)
        }

        // Label the column where a month starts, as GitHub does.
        if (dayTsToDate(weekStartTs).getUTCDate() <= 7) {
            monthLabels[week] = formatMonthLabel(weekStartTs)
        }
    }

    return { grid, monthLabels, maxValue }
}

export const HEATMAP_ROW_LABELS = ROW_KEYS
