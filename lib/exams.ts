import dayjs from 'dayjs'

import { buildCourseKey, courseIconUrl } from '@/lib/courses'
import { includesForSearch } from '@/lib/utils'
import type { Exam, PublicProfile } from '@/lib/jutge_api_client'

type ExamTimestamp = Exam['exp_time_start']

const DEFAULT_CALENDAR_DURATION_MINUTES = 120

export function parseExamTime(exp_time_start: ExamTimestamp): Date {
    if (typeof exp_time_start === 'number') return new Date(exp_time_start)
    return new Date(exp_time_start)
}

export function formatExamDateTime(exp_time_start: ExamTimestamp): string {
    return dayjs(parseExamTime(exp_time_start)).format('YYYY-MM-DD HH:mm:ss')
}

export type ExamStatusTone = 'finished' | 'upcoming' | 'in-progress'

export type ExamRow = {
    exam_nm: string
    title: string
    place: string
    description: string
    exp_time_start: string
    exp_time_startMs: number
    contest: boolean
    finished: boolean
    courseTitle: string
    courseIconUrl: string
    courseHref: string
    ownerName: string
    statusTone: ExamStatusTone
    calendarUrl: string
}

export type ExamDetail = ExamRow & {
    course_nm: string
    courseHref: string
    statusLabel: string
    statusTone: ExamStatusTone
}

function ownerDisplayName(owner: PublicProfile): string {
    return owner.name?.trim() || owner.username?.trim() || owner.email
}

function buildExamRowBase(exam_nm: string, exam: Exam): Omit<ExamRow, 'calendarUrl'> {
    const status = getExamStatus(exam)

    return {
        exam_nm,
        title: exam.title,
        place: exam.place?.trim() ?? '',
        description: exam.description?.trim() ?? '',
        exp_time_start: formatExamDateTime(exam.exp_time_start),
        exp_time_startMs: parseExamTime(exam.exp_time_start).getTime(),
        contest: exam.contest,
        finished: exam.finished,
        courseTitle: exam.course.title?.trim() || exam.course.course_nm,
        courseIconUrl: courseIconUrl(exam.course.icon),
        courseHref: `/courses/${buildCourseKey(exam.owner, exam.course.course_nm)}`,
        ownerName: ownerDisplayName(exam.owner),
        statusTone: status.tone,
    }
}

export function buildExamRow(exam_nm: string, exam: Exam): ExamRow {
    return {
        ...buildExamRowBase(exam_nm, exam),
        calendarUrl: examToCalendarLink(exam),
    }
}

export function getExamStatus(exam: Exam): { label: string; tone: ExamStatusTone } {
    if (exam.finished) {
        return { label: 'Finished', tone: 'finished' }
    }

    const start = parseExamTime(exam.exp_time_start)
    if (start.getTime() > Date.now()) {
        return { label: 'Upcoming', tone: 'upcoming' }
    }

    return { label: 'In progress', tone: 'in-progress' }
}

export function buildExamDetail(exam_nm: string, exam: Exam): ExamDetail {
    const status = getExamStatus(exam)

    return {
        ...buildExamRow(exam_nm, exam),
        course_nm: exam.course.course_nm,
        courseHref: `/courses/${buildCourseKey(exam.owner, exam.course.course_nm)}`,
        statusLabel: status.label,
        statusTone: status.tone,
    }
}

export function examToCalendarLink(
    exam: Pick<Exam, 'title' | 'place' | 'exp_time_start'>,
    durationMinutes = DEFAULT_CALENDAR_DURATION_MINUTES,
): string {
    const formatDate = (date: Date): string => {
        const isoString = date.toISOString().replace(/[-:]/g, '')
        return isoString.slice(0, 13) + isoString.slice(15, -1)
    }

    const startDate = parseExamTime(exam.exp_time_start)
    const endDate = new Date(startDate.getTime() + durationMinutes * 60_000)

    const text = encodeURIComponent(exam.title)
    const dates = `${formatDate(startDate)}/${formatDate(endDate)}`
    const location = encodeURIComponent(exam.place || 'unknown')

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=${location}`
}

export type ExamsTypeFilter = 'all' | 'exam' | 'contest'
export type ExamsStatusFilter = 'all' | 'upcoming' | 'in-progress' | 'finished'
export type ExamsSortField = 'date' | 'title' | 'course' | 'instructor'

export type SearchableExamRow = Pick<
    ExamRow,
    | 'exam_nm'
    | 'title'
    | 'courseTitle'
    | 'ownerName'
    | 'place'
    | 'description'
    | 'contest'
    | 'statusTone'
    | 'exp_time_startMs'
>

function matchesExamSearch(exam: SearchableExamRow, query: string): boolean {
    if (!query) {
        return true
    }

    const haystack = [exam.exam_nm, exam.title, exam.courseTitle, exam.ownerName, exam.place, exam.description].join(
        ' ',
    )
    return includesForSearch(haystack, query)
}

function matchesExamTypeFilter(exam: SearchableExamRow, filter: ExamsTypeFilter): boolean {
    switch (filter) {
        case 'all':
            return true
        case 'exam':
            return !exam.contest
        case 'contest':
            return exam.contest
    }
}

function matchesExamStatusFilter(exam: SearchableExamRow, filter: ExamsStatusFilter): boolean {
    switch (filter) {
        case 'all':
            return true
        case 'upcoming':
            return exam.statusTone === 'upcoming'
        case 'in-progress':
            return exam.statusTone === 'in-progress'
        case 'finished':
            return exam.statusTone === 'finished'
    }
}

function compareExamRows(a: SearchableExamRow, b: SearchableExamRow, sortField: ExamsSortField): number {
    switch (sortField) {
        case 'title':
            return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
        case 'course':
            return a.courseTitle.localeCompare(b.courseTitle, undefined, { sensitivity: 'base' })
        case 'instructor':
            return a.ownerName.localeCompare(b.ownerName, undefined, { sensitivity: 'base' })
        case 'date':
            return b.exp_time_startMs - a.exp_time_startMs
    }
}

export function filterAndSortExams<T extends SearchableExamRow>(
    exams: T[],
    searchQuery: string,
    typeFilter: ExamsTypeFilter,
    statusFilter: ExamsStatusFilter,
    sortField: ExamsSortField,
): T[] {
    const query = searchQuery.trim()

    return exams
        .filter(
            (exam) =>
                matchesExamSearch(exam, query) &&
                matchesExamTypeFilter(exam, typeFilter) &&
                matchesExamStatusFilter(exam, statusFilter),
        )
        .sort((a, b) => compareExamRows(a, b, sortField))
}
