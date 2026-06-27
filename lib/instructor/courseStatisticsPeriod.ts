import dayjs from 'dayjs'

const COURSE_STATISTICS_PERIOD_STORAGE_PREFIX = 'instructor-course-statistics-period:'

export type CourseStatisticsPeriod = {
    startDate: Date
    endDate: Date
}

export function courseStatisticsPeriodStorageKey(courseKey: string): string {
    return `${COURSE_STATISTICS_PERIOD_STORAGE_PREFIX}${courseKey}`
}

function isValidDateString(value: unknown): value is string {
    return typeof value === 'string' && dayjs(value).isValid()
}

export function parseCourseStatisticsPeriod(
    stored: string | null,
    fallback: CourseStatisticsPeriod,
): CourseStatisticsPeriod {
    if (!stored) {
        return fallback
    }

    try {
        const parsed: unknown = JSON.parse(stored)
        if (!parsed || typeof parsed !== 'object') {
            return fallback
        }

        const { start, end } = parsed as { start?: unknown; end?: unknown }
        if (!isValidDateString(start) || !isValidDateString(end)) {
            return fallback
        }

        const startDate = dayjs(start).startOf('day').toDate()
        const endDate = dayjs(end).startOf('day').toDate()
        if (dayjs(startDate).isAfter(endDate)) {
            return fallback
        }

        return { startDate, endDate }
    } catch {
        return fallback
    }
}

export function serializeCourseStatisticsPeriod(period: CourseStatisticsPeriod): string {
    return JSON.stringify({
        start: dayjs(period.startDate).format('YYYY-MM-DD'),
        end: dayjs(period.endDate).format('YYYY-MM-DD'),
    })
}
