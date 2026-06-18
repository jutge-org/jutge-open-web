import type { HeatmapCalendar } from '@/lib/jutge_api_client'

const DAY_SECONDS = 86_400
const ROW_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

export type HeatmapCell = {
    value: number
    dateLabel: string | null
}

export type HeatmapWeekGrid = {
    grid: HeatmapCell[][]
    monthLabels: (string | null)[]
    maxValue: number
}

function heatmapTimestampToDate(ts: number): Date {
    return new Date(ts * 1000)
}

function utcMondayIndex(date: Date): number {
    const day = date.getUTCDay()
    return day === 0 ? 6 : day - 1
}

function formatMonthLabel(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short' })
}

/** Build a GitHub-style week-column heatmap from dashboard calendar data. */
export function buildHeatmapWeekGrid(heatmap: HeatmapCalendar): HeatmapWeekGrid {
    if (heatmap.length === 0) {
        return { grid: [], monthLabels: [], maxValue: 0 }
    }

    const valueByDay = new Map<number, number>()
    for (const entry of heatmap) {
        valueByDay.set(entry.date, entry.value)
    }

    const sortedDates = [...valueByDay.keys()].sort((a, b) => a - b)
    const minTs = sortedDates[0]!
    const maxTs = sortedDates[sortedDates.length - 1]!

    const startDate = heatmapTimestampToDate(minTs)
    const startMondayOffset = utcMondayIndex(startDate)
    const gridStartTs = minTs - startMondayOffset * DAY_SECONDS

    const endDate = heatmapTimestampToDate(maxTs)
    const endMondayOffset = utcMondayIndex(endDate)
    const gridEndTs = maxTs + (6 - endMondayOffset) * DAY_SECONDS

    const weekCount = Math.floor((gridEndTs - gridStartTs) / (7 * DAY_SECONDS)) + 1
    const grid: HeatmapCell[][] = ROW_KEYS.map(() =>
        Array.from({ length: weekCount }, () => ({ value: 0, dateLabel: null })),
    )

    let maxValue = 0
    const monthLabels: (string | null)[] = Array.from({ length: weekCount }, () => null)

    for (let week = 0; week < weekCount; week++) {
        const weekStartTs = gridStartTs + week * 7 * DAY_SECONDS
        for (let row = 0; row < 7; row++) {
            const dayTs = weekStartTs + row * DAY_SECONDS
            const value = valueByDay.get(dayTs) ?? 0
            const date = heatmapTimestampToDate(dayTs)
            const inRange = dayTs >= minTs && dayTs <= maxTs
            grid[row]![week] = {
                value: inRange ? value : 0,
                dateLabel: inRange
                    ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                    : null,
            }
            maxValue = Math.max(maxValue, value)
        }

        const weekDate = heatmapTimestampToDate(weekStartTs)
        if (weekDate.getUTCDate() <= 7) {
            monthLabels[week] = formatMonthLabel(weekDate)
        }
    }

    return { grid, monthLabels, maxValue }
}

export const HEATMAP_ROW_LABELS = ROW_KEYS
