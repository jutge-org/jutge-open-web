import { courseHref } from '@/lib/courses'
import { parseProblemKey } from '@/lib/problems'

export const MAX_RECENTS_ITEMS = 6

const RECENTS_STORAGE_PREFIX = 'jutge-recents:'

export type RecentCourseItem = {
    courseKey: string
    title: string
    accessedAt: number
}

export type RecentProblemItem = {
    problemNm: string
    title: string
    accessedAt: number
}

export type RecentSubmissionItem = {
    submissionId: string
    problemNm: string
    title: string
    verdictEmoji?: string
    accessedAt: number
}

export type RecentsData = {
    courses: RecentCourseItem[]
    problems: RecentProblemItem[]
    submissions: RecentSubmissionItem[]
}

export function recentsStorageKey(userId: string): string {
    return `${RECENTS_STORAGE_PREFIX}${userId}`
}

export function emptyRecents(): RecentsData {
    return { courses: [], problems: [], submissions: [] }
}

function isRecentCourseItem(value: unknown): value is RecentCourseItem {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as RecentCourseItem).courseKey === 'string' &&
        typeof (value as RecentCourseItem).title === 'string' &&
        typeof (value as RecentCourseItem).accessedAt === 'number'
    )
}

function isRecentProblemItem(value: unknown): value is RecentProblemItem {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as RecentProblemItem).problemNm === 'string' &&
        typeof (value as RecentProblemItem).title === 'string' &&
        typeof (value as RecentProblemItem).accessedAt === 'number'
    )
}

function isRecentSubmissionItem(value: unknown): value is RecentSubmissionItem {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const item = value as RecentSubmissionItem
    return (
        typeof item.submissionId === 'string' &&
        typeof item.problemNm === 'string' &&
        typeof item.title === 'string' &&
        typeof item.accessedAt === 'number' &&
        (item.verdictEmoji === undefined || typeof item.verdictEmoji === 'string')
    )
}

function parseRecentItems<T>(value: unknown, guard: (item: unknown) => item is T): T[] {
    if (!Array.isArray(value)) {
        return []
    }

    return value.filter(guard).slice(0, MAX_RECENTS_ITEMS)
}

export function parseRecentsData(raw: string | null): RecentsData {
    if (!raw) {
        return emptyRecents()
    }

    try {
        const parsed: unknown = JSON.parse(raw)
        if (typeof parsed !== 'object' || parsed === null) {
            return emptyRecents()
        }

        return {
            courses: parseRecentItems((parsed as RecentsData).courses, isRecentCourseItem),
            problems: parseRecentItems((parsed as RecentsData).problems, isRecentProblemItem),
            submissions: parseRecentItems((parsed as RecentsData).submissions, isRecentSubmissionItem),
        }
    } catch {
        return emptyRecents()
    }
}

export function serializeRecentsData(data: RecentsData): string {
    return JSON.stringify(data)
}

function upsertByKey<T extends { accessedAt: number }>(
    items: T[],
    item: T,
    keyOf: (entry: T) => string,
): T[] {
    const key = keyOf(item)
    const filtered = items.filter((entry) => keyOf(entry) !== key)
    return [item, ...filtered]
        .sort((a, b) => b.accessedAt - a.accessedAt)
        .slice(0, MAX_RECENTS_ITEMS)
}

export function addRecentCourse(data: RecentsData, item: RecentCourseItem): RecentsData {
    return {
        ...data,
        courses: upsertByKey(data.courses, item, (entry) => entry.courseKey),
    }
}

export function addRecentProblem(data: RecentsData, item: RecentProblemItem): RecentsData {
    return {
        ...data,
        problems: upsertByKey(data.problems, item, (entry) => entry.problemNm),
    }
}

export function addRecentSubmission(data: RecentsData, item: RecentSubmissionItem): RecentsData {
    return {
        ...data,
        submissions: upsertByKey(data.submissions, item, (entry) => entry.submissionId),
    }
}

export function clearRecentCourses(data: RecentsData): RecentsData {
    return { ...data, courses: [] }
}

export function clearRecentProblems(data: RecentsData): RecentsData {
    return { ...data, problems: [] }
}

export function clearRecentSubmissions(data: RecentsData): RecentsData {
    return { ...data, submissions: [] }
}

export function clearAllRecents(): RecentsData {
    return emptyRecents()
}

export function readRecents(userId: string): RecentsData {
    if (typeof window === 'undefined') {
        return emptyRecents()
    }

    return parseRecentsData(localStorage.getItem(recentsStorageKey(userId)))
}

export function writeRecents(userId: string, data: RecentsData): void {
    if (typeof window === 'undefined') {
        return
    }

    localStorage.setItem(recentsStorageKey(userId), serializeRecentsData(data))
}

export function recentCourseHref(item: RecentCourseItem): string {
    return courseHref(item.courseKey)
}

export function recentProblemHref(item: RecentProblemItem): string {
    return `/problems/${item.problemNm}`
}

export function formatRecentProblemTitle(item: RecentProblemItem): string {
    const title = item.title.trim()
    if (title && title !== item.problemNm) {
        return `${item.problemNm} · ${title}`
    }

    return item.problemNm
}

export function recentSubmissionHref(item: RecentSubmissionItem): string {
    return `/problems/${item.problemNm}/submissions/${item.submissionId}`
}

const RECENT_VERDICT_EMOJI_SELECTOR = '[data-recent-verdict-emoji]'

function verdictEmojiFromDocument(): string | undefined {
    const element = document.querySelector(RECENT_VERDICT_EMOJI_SELECTOR)
    const emoji = element?.getAttribute('data-recent-verdict-emoji')?.trim()
    return emoji || undefined
}

const COURSE_PATH_RE = /^\/courses\/(?!public(?:\/|$))([^/]+)$/
const PROBLEM_PATH_RE = /^\/problems\/(?!public(?:\/|$))([^/]+)$/
const SUBMISSION_PATH_RE = /^\/problems\/([^/]+)\/submissions\/([^/]+)$/

function titleFromDocument(fallback: string): string {
    const parts = document.title.split(' — ')
    if (parts.length >= 2 && parts[parts.length - 1]?.trim() === 'Jutge.org') {
        return parts[0]?.trim() || fallback
    }

    return fallback
}

function submissionTitleFromDocument(submissionId: string, problemNm: string): string {
    const parts = document.title.split(' — ')
    if (parts.length >= 3 && parts[parts.length - 1]?.trim() === 'Jutge.org') {
        const problemTitle = parts[1]?.trim()
        if (problemTitle) {
            return `${problemTitle} · ${parts[0]?.trim() || submissionId}`
        }
    }

    return submissionId
}

function hasResolvedTitle(title: string, fallback: string): boolean {
    const trimmed = title.trim()
    return trimmed.length > 0 && trimmed !== fallback.trim()
}

export function patchRecentsFromDocument(pathname: string, data: RecentsData): RecentsData | null {
    const courseMatch = pathname.match(COURSE_PATH_RE)
    if (courseMatch) {
        const courseKey = decodeURIComponent(courseMatch[1])
        const title = titleFromDocument(courseKey)
        if (!hasResolvedTitle(title, courseKey)) {
            return null
        }

        const index = data.courses.findIndex((entry) => entry.courseKey === courseKey)
        if (index === -1 || data.courses[index].title === title) {
            return null
        }

        const courses = [...data.courses]
        courses[index] = { ...courses[index], title }
        return { ...data, courses }
    }

    const submissionMatch = pathname.match(SUBMISSION_PATH_RE)
    if (submissionMatch) {
        const problemKey = decodeURIComponent(submissionMatch[1])
        const submissionId = decodeURIComponent(submissionMatch[2])
        const parsed = parseProblemKey(problemKey)
        if (parsed.kind === 'invalid') {
            return null
        }

        const title = submissionTitleFromDocument(submissionId, parsed.problem_nm)
        const verdictEmoji = verdictEmojiFromDocument()
        const index = data.submissions.findIndex((entry) => entry.submissionId === submissionId)

        if (index === -1) {
            if (!verdictEmoji && !hasResolvedTitle(title, submissionId)) {
                return null
            }

            return addRecentSubmission(data, {
                submissionId,
                problemNm: parsed.problem_nm,
                title: hasResolvedTitle(title, submissionId) ? title : submissionId,
                verdictEmoji,
                accessedAt: Date.now(),
            })
        }

        const existing = data.submissions[index]
        const nextTitle = hasResolvedTitle(title, submissionId) ? title : existing.title
        const nextVerdictEmoji = verdictEmoji ?? existing.verdictEmoji
        if (existing.title === nextTitle && existing.verdictEmoji === nextVerdictEmoji) {
            return null
        }

        const submissions = [...data.submissions]
        submissions[index] = { ...existing, title: nextTitle, verdictEmoji: nextVerdictEmoji }
        return { ...data, submissions }
    }

    const problemMatch = pathname.match(PROBLEM_PATH_RE)
    if (problemMatch) {
        const problemKey = decodeURIComponent(problemMatch[1])
        const parsed = parseProblemKey(problemKey)
        if (parsed.kind === 'invalid') {
            return null
        }

        const problemNm = parsed.problem_nm
        const title = titleFromDocument(problemNm)
        if (!hasResolvedTitle(title, problemNm)) {
            return null
        }

        const index = data.problems.findIndex((entry) => entry.problemNm === problemNm)
        if (index === -1 || data.problems[index].title === title) {
            return null
        }

        const problems = [...data.problems]
        problems[index] = { ...problems[index], title }
        return { ...data, problems }
    }

    return null
}

export function recordRecentFromPathname(pathname: string, data: RecentsData): RecentsData {
    const courseMatch = pathname.match(COURSE_PATH_RE)
    if (courseMatch) {
        const courseKey = decodeURIComponent(courseMatch[1])
        return addRecentCourse(data, {
            courseKey,
            title: titleFromDocument(courseKey),
            accessedAt: Date.now(),
        })
    }

    const submissionMatch = pathname.match(SUBMISSION_PATH_RE)
    if (submissionMatch) {
        const problemKey = decodeURIComponent(submissionMatch[1])
        const submissionId = decodeURIComponent(submissionMatch[2])
        const parsed = parseProblemKey(problemKey)
        if (parsed.kind === 'invalid') {
            return data
        }

        const problemNm = parsed.problem_nm
        return addRecentSubmission(data, {
            submissionId,
            problemNm,
            title: submissionTitleFromDocument(submissionId, problemNm),
            verdictEmoji: verdictEmojiFromDocument(),
            accessedAt: Date.now(),
        })
    }

    const problemMatch = pathname.match(PROBLEM_PATH_RE)
    if (problemMatch) {
        const problemKey = decodeURIComponent(problemMatch[1])
        const parsed = parseProblemKey(problemKey)
        if (parsed.kind === 'invalid') {
            return data
        }

        const problemNm = parsed.problem_nm
        return addRecentProblem(data, {
            problemNm,
            title: titleFromDocument(problemNm),
            accessedAt: Date.now(),
        })
    }

    return data
}

export function syncRecentsFromPage(pathname: string, data: RecentsData, options?: { record?: boolean }): RecentsData {
    const afterRecord = options?.record === false ? data : recordRecentFromPathname(pathname, data)
    return patchRecentsFromDocument(pathname, afterRecord) ?? afterRecord
}

export function observeRecentPageMetadata(onChange: () => void): () => void {
    if (typeof document === 'undefined') {
        return () => {}
    }

    const handleChange = () => {
        onChange()
    }

    handleChange()

    const titleElement = document.querySelector('title')
    let titleObserver: MutationObserver | undefined
    if (titleElement) {
        titleObserver = new MutationObserver(() => {
            handleChange()
        })
        titleObserver.observe(titleElement, { childList: true, subtree: true, characterData: true })
    }

    const contentObserver = new MutationObserver(() => {
        handleChange()
    })
    const contentRoot = document.getElementById('main-content') ?? document.body
    contentObserver.observe(contentRoot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-recent-verdict-emoji'],
    })

    const retryTimeouts = [50, 150, 500, 1000, 2000, 3000].map((delay) => window.setTimeout(handleChange, delay))

    return () => {
        titleObserver?.disconnect()
        contentObserver.disconnect()
        retryTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
}
