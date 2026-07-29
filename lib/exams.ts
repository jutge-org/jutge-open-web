import dayjs from 'dayjs'

import { courseIconUrl } from '@/lib/courses'
import type { LastSubmissionInfo, SubmissionRow } from '@/lib/submissions'
import { includesForSearch } from '@/lib/utils'
import type { AbstractStatus, BriefExam, Exam, Language, PublicProfile } from '@/lib/jutge_api_client'

type StudentExam = BriefExam | Exam
type ExamTimestamp = StudentExam['exp_time_start']

const DEFAULT_CALENDAR_DURATION_MINUTES = 120

export function parseExamTime(exp_time_start: ExamTimestamp): Date {
    if (typeof exp_time_start === 'number') return new Date(exp_time_start)
    return new Date(exp_time_start)
}

export function formatExamDateTime(exp_time_start: ExamTimestamp): string {
    return dayjs(parseExamTime(exp_time_start)).format('YYYY-MM-DD HH:mm:ss')
}

export function formatExamDateTimeOrNull(timestamp: ExamTimestamp | null | undefined): string | null {
    if (timestamp == null) {
        return null
    }

    return formatExamDateTime(timestamp)
}

function parseRunningTimeMinutes(running_time: StudentExam['running_time']): number {
    if (typeof running_time === 'number' && Number.isFinite(running_time)) {
        return running_time
    }

    const parsed = Number(running_time)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_CALENDAR_DURATION_MINUTES
}

export type ExamStatusTone = 'finished' | 'upcoming' | 'in-progress'

export type ExamRow = {
    exam_key: string
    title: string
    place: string
    description: string
    exp_time_start: string
    exp_time_startMs: number
    contest: boolean
    courseTitle: string
    courseIconUrl: string
    courseHref: string
    ownerName: string
    status: string
    statusLabel: string
    statusTone: ExamStatusTone
    runningTimeMinutes: number
    calendarUrl: string
}

export type ExamProblemRow = {
    kind: 'problem'
    problem_nm: string
    title: string
    iconUrl: string | null
    language_ids: string[]
    driver_id: string | null
    author: string | null
    created_at: string | number
    updated_at: string | number
}

export type ExamDetail = ExamRow & {
    course_nm: string
    time_start: string | null
    time_end: string | null
    visible_submissions: boolean
    problems: ExamProblemRow[]
    languages: Record<string, Language>
    problemStatuses: Record<string, AbstractStatus>
    problemLastSubmissions: Record<string, LastSubmissionInfo>
    submissions: SubmissionRow[]
}

function ownerDisplayName(owner: PublicProfile): string {
    return owner.name?.trim() || owner.username?.trim() || owner.email
}

function statusLabelFromTone(tone: ExamStatusTone): string {
    switch (tone) {
        case 'finished':
            return 'Finished'
        case 'upcoming':
            return 'Upcoming'
        case 'in-progress':
            return 'In progress'
    }
}

function statusToneFromStatus(status: string): ExamStatusTone | null {
    const normalized = status.trim().toLowerCase()
    if (!normalized) {
        return null
    }

    if (normalized.includes('finish') || normalized === 'ended' || normalized === 'completed') {
        return 'finished'
    }

    if (normalized.includes('progress') || normalized.includes('running') || normalized === 'started') {
        return 'in-progress'
    }

    if (normalized.includes('upcoming') || normalized.includes('schedul') || normalized.includes('not')) {
        return 'upcoming'
    }

    return null
}

function statusToneFromTimes(
    exam: Pick<StudentExam, 'exp_time_start' | 'time_start' | 'time_end' | 'running_time'>,
): ExamStatusTone {
    if (exam.time_end) {
        return 'finished'
    }

    if (exam.time_start) {
        return 'in-progress'
    }

    const start = parseExamTime(exam.exp_time_start)
    if (start.getTime() > Date.now()) {
        return 'upcoming'
    }

    const runningMs = parseRunningTimeMinutes(exam.running_time) * 60_000
    if (start.getTime() + runningMs < Date.now()) {
        return 'finished'
    }

    return 'in-progress'
}

export function getExamStatus(
    exam: Pick<StudentExam, 'status' | 'exp_time_start' | 'time_start' | 'time_end' | 'running_time'>,
): { label: string; tone: ExamStatusTone } {
    const tone = statusToneFromStatus(exam.status) ?? statusToneFromTimes(exam)
    const trimmedStatus = exam.status.trim()

    return {
        label: trimmedStatus || statusLabelFromTone(tone),
        tone,
    }
}

function buildExamRowBase(exam: StudentExam): Omit<ExamRow, 'calendarUrl'> {
    const status = getExamStatus(exam)

    return {
        exam_key: exam.exam_key,
        title: exam.title,
        place: exam.place?.trim() ?? '',
        description: exam.description?.trim() ?? '',
        exp_time_start: formatExamDateTime(exam.exp_time_start),
        exp_time_startMs: parseExamTime(exam.exp_time_start).getTime(),
        contest: exam.contest,
        courseTitle: exam.course.title?.trim() || exam.course.course_nm,
        courseIconUrl: courseIconUrl(exam.course.icon),
        // For exams, course_nm is already the full course key (owner:course_nm), so use it as-is —
        // running it through buildCourseKey would prepend the owner again and double it.
        courseHref: `/courses/${exam.course.course_nm}`,
        ownerName: ownerDisplayName(exam.owner),
        status: exam.status,
        statusLabel: status.label,
        statusTone: status.tone,
        runningTimeMinutes: parseRunningTimeMinutes(exam.running_time),
    }
}

export function buildExamRow(exam: StudentExam): ExamRow {
    return {
        ...buildExamRowBase(exam),
        calendarUrl: examToCalendarLink(exam),
    }
}

/**
 * Course key of the course an exam is bound to. Exams live in their own course, so this key is how
 * we recognise a "course" that is really an exam (e.g. to keep it out of recent courses).
 */
export function examCourseKey(exam: Pick<ExamRow, 'courseHref'>): string {
    return exam.courseHref.replace(/^\/courses\//, '')
}

/** Human-readable exam duration, e.g. "2h", "1h 30m", "45m". */
export function formatExamDuration(runningTimeMinutes: number): string {
    const minutes = Math.max(0, Math.round(runningTimeMinutes))
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) {
        return `${mins}m`
    }
    if (mins === 0) {
        return `${hours}h`
    }
    return `${hours}h ${mins}m`
}

/** Remaining time until a moment, e.g. "2d 4h", "4h 12m", "12m", "<1m". Null once elapsed. */
export function formatCountdown(ms: number): string | null {
    if (ms <= 0) {
        return null
    }

    const totalMinutes = Math.floor(ms / 60_000)
    const days = Math.floor(totalMinutes / (60 * 24))
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
    const minutes = totalMinutes % 60

    if (days > 0) {
        return `${days}d ${hours}h`
    }
    if (hours > 0) {
        return `${hours}h ${minutes}m`
    }
    if (minutes > 0) {
        return `${minutes}m`
    }
    return '<1m'
}

export type ExamRecencyGroups = {
    upcoming: ExamRow[]
    past: ExamRow[]
}

/**
 * Split exams into upcoming (anything not finished, incl. in-progress) and past (finished).
 * Does not reorder — callers keep whatever order they passed in.
 */
export function partitionExamsByRecency(rows: ExamRow[]): ExamRecencyGroups {
    const upcoming: ExamRow[] = []
    const past: ExamRow[] = []

    for (const row of rows) {
        if (row.statusTone === 'finished') {
            past.push(row)
        } else {
            upcoming.push(row)
        }
    }

    return { upcoming, past }
}

function buildFallbackExamProblemRow(problem_nm: string): ExamProblemRow {
    return {
        kind: 'problem',
        problem_nm,
        title: problem_nm,
        iconUrl: null,
        language_ids: [],
        driver_id: null,
        author: null,
        created_at: '',
        updated_at: '',
    }
}

export function buildExamDetail(
    exam: Exam,
    options?: {
        problems?: ExamProblemRow[]
        languages?: Record<string, Language>
        problemStatuses?: Record<string, AbstractStatus>
        problemLastSubmissions?: Record<string, LastSubmissionInfo>
        submissions?: SubmissionRow[]
    },
): ExamDetail {
    return {
        ...buildExamRow(exam),
        course_nm: exam.course.course_nm,
        time_start: formatExamDateTimeOrNull(exam.time_start),
        time_end: formatExamDateTimeOrNull(exam.time_end),
        visible_submissions: exam.visible_submissions,
        problems: options?.problems ?? exam.problems.map(buildFallbackExamProblemRow),
        languages: options?.languages ?? {},
        problemStatuses: options?.problemStatuses ?? {},
        problemLastSubmissions: options?.problemLastSubmissions ?? {},
        submissions: options?.submissions ?? [],
    }
}

export function examToCalendarLink(
    exam: Pick<StudentExam, 'title' | 'place' | 'exp_time_start' | 'running_time'>,
    durationMinutes?: number,
): string {
    const formatDate = (date: Date): string => {
        const isoString = date.toISOString().replace(/[-:]/g, '')
        return isoString.slice(0, 13) + isoString.slice(15, -1)
    }

    const startDate = parseExamTime(exam.exp_time_start)
    const minutes = durationMinutes ?? parseRunningTimeMinutes(exam.running_time)
    const endDate = new Date(startDate.getTime() + minutes * 60_000)

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
    | 'exam_key'
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

    const haystack = [exam.exam_key, exam.title, exam.courseTitle, exam.ownerName, exam.place, exam.description].join(
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
