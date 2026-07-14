import { courseHref } from '@/lib/courses'
import { parseProblemKey } from '@/lib/problems'
import { includesForSearch } from '@/lib/utils'

export const MAX_RECENTS_ITEMS = 6

const RECENTS_STORAGE_PREFIX = 'jutge-recents:'

export type RecentCourseItem = {
    courseKey: string
    title: string
    iconUrl?: string
    accessedAt: number
}

export type RecentProblemItem = {
    problemNm: string
    title: string
    iconUrl?: string
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
        typeof (value as RecentCourseItem).accessedAt === 'number' &&
        ((value as RecentCourseItem).iconUrl === undefined || typeof (value as RecentCourseItem).iconUrl === 'string')
    )
}

function isRecentProblemItem(value: unknown): value is RecentProblemItem {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as RecentProblemItem).problemNm === 'string' &&
        typeof (value as RecentProblemItem).title === 'string' &&
        typeof (value as RecentProblemItem).accessedAt === 'number' &&
        ((value as RecentProblemItem).iconUrl === undefined || typeof (value as RecentProblemItem).iconUrl === 'string')
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

function upsertByKey<T extends { accessedAt: number }>(items: T[], item: T, keyOf: (entry: T) => string): T[] {
    const key = keyOf(item)
    const filtered = items.filter((entry) => keyOf(entry) !== key)
    return [item, ...filtered].sort((a, b) => b.accessedAt - a.accessedAt).slice(0, MAX_RECENTS_ITEMS)
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

export function enrichRecentCourseIcons(data: RecentsData, iconByKey: ReadonlyMap<string, string>): RecentsData {
    let changed = false
    const courses = data.courses.map((course) => {
        if (course.iconUrl) {
            return course
        }

        const iconUrl = iconByKey.get(course.courseKey)
        if (!iconUrl) {
            return course
        }

        changed = true
        return { ...course, iconUrl }
    })

    return changed ? { ...data, courses } : data
}

export function enrichRecentProblemIcons(data: RecentsData, iconByNm: ReadonlyMap<string, string>): RecentsData {
    let changed = false
    const problems = data.problems.map((problem) => {
        if (problem.iconUrl) {
            return problem
        }

        const iconUrl = iconByNm.get(problem.problemNm)
        if (!iconUrl) {
            return problem
        }

        changed = true
        return { ...problem, iconUrl }
    })

    return changed ? { ...data, problems } : data
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

export type CommandPaletteRecentItem = {
    id: string
    kind: 'course' | 'problem' | 'submission'
    label: string
    description: string
    href: string
    iconUrl?: string
    accessedAt: number
}

export function commandPaletteRecentItems(recents: RecentsData): CommandPaletteRecentItem[] {
    const items: CommandPaletteRecentItem[] = [
        ...recents.courses.map((item) => ({
            id: `course:${item.courseKey}`,
            kind: 'course' as const,
            label: item.title,
            description: item.courseKey,
            href: recentCourseHref(item),
            iconUrl: item.iconUrl,
            accessedAt: item.accessedAt,
        })),
        ...recents.problems.map((item) => ({
            id: `problem:${item.problemNm}`,
            kind: 'problem' as const,
            label: formatRecentProblemTitle(item),
            description: item.problemNm,
            href: recentProblemHref(item),
            iconUrl: item.iconUrl,
            accessedAt: item.accessedAt,
        })),
        ...recents.submissions.map((item) => ({
            id: `submission:${item.submissionId}`,
            kind: 'submission' as const,
            label: item.title,
            description: `${item.problemNm} · ${item.submissionId}`,
            href: recentSubmissionHref(item),
            accessedAt: item.accessedAt,
        })),
    ]

    return items.sort((a, b) => b.accessedAt - a.accessedAt)
}

export function filterCommandPaletteRecents(
    recents: RecentsData,
    query: string,
    limit = 10,
): CommandPaletteRecentItem[] {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
        return []
    }

    const items = commandPaletteRecentItems(recents)
    const showAll = includesForSearch('recent recents history', trimmedQuery)
    const filtered = showAll
        ? items
        : items.filter((item) => includesForSearch(`${item.label} ${item.description}`, trimmedQuery))

    return filtered.slice(0, limit)
}

const RECENT_VERDICT_EMOJI_SELECTOR = '[data-recent-verdict-emoji]'
const RECENT_COURSE_ICON_SELECTOR = '[data-recent-course-icon-url]'
const RECENT_PROBLEM_ICON_SELECTOR = '[data-recent-problem-icon-url]'

function verdictEmojiFromDocument(): string | undefined {
    const element = document.querySelector(RECENT_VERDICT_EMOJI_SELECTOR)
    const emoji = element?.getAttribute('data-recent-verdict-emoji')?.trim()
    return emoji || undefined
}

function courseIconUrlFromDocument(): string | undefined {
    const element = document.querySelector(RECENT_COURSE_ICON_SELECTOR)
    const iconUrl = element?.getAttribute('data-recent-course-icon-url')?.trim()
    return iconUrl || undefined
}

function problemIconUrlFromDocument(): string | undefined {
    const element = document.querySelector(RECENT_PROBLEM_ICON_SELECTOR)
    const iconUrl = element?.getAttribute('data-recent-problem-icon-url')?.trim()
    return iconUrl || undefined
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

function submissionTitleFromDocument(submissionId: string): string {
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
        const iconUrl = courseIconUrlFromDocument()
        if (index === -1) {
            return null
        }

        const existing = data.courses[index]
        if (existing.title === title && existing.iconUrl === iconUrl) {
            return null
        }

        const courses = [...data.courses]
        courses[index] = { ...existing, title, iconUrl }
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

        const title = submissionTitleFromDocument(submissionId)
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
        const iconUrl = problemIconUrlFromDocument()
        if (index === -1) {
            return null
        }

        const existing = data.problems[index]
        if (existing.title === title && existing.iconUrl === iconUrl) {
            return null
        }

        const problems = [...data.problems]
        problems[index] = { ...existing, title, iconUrl }
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
            iconUrl: courseIconUrlFromDocument(),
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
            title: submissionTitleFromDocument(submissionId),
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
            iconUrl: problemIconUrlFromDocument(),
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
        attributeFilter: ['data-recent-verdict-emoji', 'data-recent-course-icon-url', 'data-recent-problem-icon-url'],
    })

    const retryTimeouts = [50, 150, 500, 1000, 2000, 3000].map((delay) => window.setTimeout(handleChange, delay))

    return () => {
        titleObserver?.disconnect()
        contentObserver.disconnect()
        retryTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
}
