import { tallyProblemStatuses, type ProblemStatusCounts } from '@/lib/courses'
import { fetchListsMany } from '@/lib/data/lists'
import { fetchStudentProblemStatuses } from '@/lib/data/problems'
import type { JutgeApiClient, List } from '@/lib/jutge_api_client'

export type CourseProgress = {
    counts: ProblemStatusCounts
}

function listProblemNms(list: List | undefined): string[] {
    if (!list) {
        return []
    }

    // Items without a problem are separators, not problems.
    return list.items.flatMap((item) => (item.problem_nm ? [item.problem_nm] : []))
}

/**
 * Progress of the given enrolled courses, keyed by course key.
 *
 * The course index does not carry lists or problem counts, so this needs one request per
 * course to read its lists — but the lists themselves and the problem statuses are then
 * fetched in a single batched request each, keeping the total at `courseKeys.length + 2`.
 */
export async function fetchCoursesProgress(
    client: JutgeApiClient,
    courseKeys: string[],
): Promise<Record<string, CourseProgress>> {
    if (courseKeys.length === 0) {
        return {}
    }

    const courses = await Promise.all(
        courseKeys.map((courseKey) =>
            client.student.courses
                .getEnrolled(courseKey)
                .then((course) => ({ courseKey, lists: course.lists }))
                // One unreadable course must not sink the whole batch.
                .catch(() => null),
        ),
    )

    const listKeys = [...new Set(courses.flatMap((course) => course?.lists ?? []))]
    const [listsByKey, statuses] = await Promise.all([
        fetchListsMany(client, listKeys),
        fetchStudentProblemStatuses(client),
    ])

    const progress: Record<string, CourseProgress> = {}
    for (const course of courses) {
        if (!course) {
            continue
        }

        const problemNms = course.lists.flatMap((listKey) => listProblemNms(listsByKey[listKey]))
        progress[course.courseKey] = { counts: tallyProblemStatuses(problemNms, statuses) }
    }

    return progress
}
