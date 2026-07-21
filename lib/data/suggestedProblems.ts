import { fetchCommandPaletteProblems } from '@/lib/data/commandPalette'
import { fetchStudentProblemStatuses } from '@/lib/data/problems'
import jutge from '@/lib/jutge'
import type { AbstractStatus } from '@/lib/jutge_api_client'
import type { RecentsData } from '@/lib/recents'

export const SUGGESTION_MODES = ['continue', 'retry', 'random'] as const
export type SuggestionMode = (typeof SUGGESTION_MODES)[number]

export const SUGGESTION_MODE_LABELS: Record<SuggestionMode, string> = {
    continue: 'Continue',
    retry: 'Try again',
    random: 'Random',
}

export const SUGGESTION_MODE_DESCRIPTIONS: Record<SuggestionMode, string> = {
    continue: 'Next problems you have not solved',
    retry: 'Problems you tried but did not get right',
    random: 'Random problems',
}

export type SuggestedProblem = {
    problemNm: string
    title: string
    iconUrl: string | null
}

export type SuggestionPool = {
    /** Where the problems come from, shown so the suggestions are not a black box. */
    sourceLabel: string
    /** Problem names in list order, which is the order the modes suggest them in. */
    problemNms: string[]
    statuses: Record<string, AbstractStatus>
    titles: Map<string, { title: string; iconUrl: string | null }>
}

export const SUGGESTIONS_COUNT = 3

function listItemProblemNms(items: { problem_nm: string | null }[]): string[] {
    return items.flatMap((item) => (item.problem_nm ? [item.problem_nm] : []))
}

/** Problems of the last accessed list, falling back to every list of the last accessed course. */
async function fetchPoolProblemNms(
    recents: RecentsData,
): Promise<{ sourceLabel: string; problemNms: string[] } | null> {
    const lastList = recents.lists[0]
    if (lastList) {
        try {
            const list = await jutge.student.lists.get(lastList.listNm)
            return {
                sourceLabel: list.title ?? lastList.title,
                problemNms: listItemProblemNms(list.items),
            }
        } catch {
            // The list may be gone; fall through to the course.
        }
    }

    const lastCourse = recents.courses[0]
    if (!lastCourse) {
        return null
    }

    try {
        const course = await jutge.student.courses
            .getEnrolled(lastCourse.courseKey)
            .catch(() => jutge.student.courses.getAvailable(lastCourse.courseKey))

        if (course.lists.length === 0) {
            return { sourceLabel: course.title ?? lastCourse.title, problemNms: [] }
        }

        const lists = await jutge.student.lists.getMany(course.lists.join(','))
        // Keep the course's own list order rather than the map's iteration order.
        const problemNms = course.lists.flatMap((listNm) => {
            const list = lists[listNm]
            return list ? listItemProblemNms(list.items) : []
        })

        return { sourceLabel: course.title ?? lastCourse.title, problemNms }
    } catch {
        return null
    }
}

export async function fetchSuggestionPool(recents: RecentsData): Promise<SuggestionPool | null> {
    const pool = await fetchPoolProblemNms(recents)
    if (!pool) {
        return null
    }

    const [statuses, allProblems] = await Promise.all([
        fetchStudentProblemStatuses(jutge),
        fetchCommandPaletteProblems(),
    ])

    const titles = new Map(
        allProblems.map((problem) => [problem.problem_nm, { title: problem.title, iconUrl: problem.iconUrl }]),
    )

    // Drop duplicates: a problem can appear in more than one list of the same course.
    const seen = new Set<string>()
    const problemNms = pool.problemNms.filter((nm) => !seen.has(nm) && seen.add(nm))

    return { sourceLabel: pool.sourceLabel, problemNms, statuses, titles }
}

function isSolved(status: AbstractStatus | undefined): boolean {
    return status?.status === 'accepted'
}

function wasAttempted(status: AbstractStatus | undefined): boolean {
    return (status?.nb_submissions ?? 0) > 0
}

function sample<T>(items: readonly T[], count: number): T[] {
    const pool = [...items]
    const picked: T[] = []
    while (pool.length > 0 && picked.length < count) {
        const index = Math.floor(Math.random() * pool.length)
        picked.push(pool[index]!)
        pool.splice(index, 1)
    }
    return picked
}

/**
 * Pick suggestions for a mode:
 * - continue: the first unsolved problems, in list order, to carry on where you left off.
 * - retry: problems with submissions but no accepted verdict.
 * - random: any problems of the pool.
 */
export function selectSuggestions(pool: SuggestionPool, mode: SuggestionMode): SuggestedProblem[] {
    const toProblem = (problemNm: string): SuggestedProblem => {
        const meta = pool.titles.get(problemNm)
        return { problemNm, title: meta?.title ?? problemNm, iconUrl: meta?.iconUrl ?? null }
    }

    if (mode === 'random') {
        return sample(pool.problemNms, SUGGESTIONS_COUNT).map(toProblem)
    }

    const candidates = pool.problemNms.filter((nm) => {
        const status = pool.statuses[nm]
        if (isSolved(status)) {
            return false
        }
        return mode === 'continue' ? true : wasAttempted(status)
    })

    return candidates.slice(0, SUGGESTIONS_COUNT).map(toProblem)
}
