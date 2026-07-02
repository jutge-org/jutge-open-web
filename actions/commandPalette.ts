'use server'

import { getCurrentClient, getPreferredLanguageId, isAuthenticated } from '@/lib/auth'
import type { SearchableCourseRow } from '@/lib/courses'
import { getAnonymousJutgeClient } from '@/lib/jutge-client-registry'
import { fetchCoursesData, fetchPublicCourses } from '@/services/queries/courses'
import { abstractProblemsToRows, type ProblemRow } from '@/services/queries/problems'

export type CommandPaletteCourse = SearchableCourseRow & {
    course_key: string
}

export async function fetchCommandPaletteProblems(): Promise<ProblemRow[]> {
    const client = getAnonymousJutgeClient()
    const abstractProblems = await client.problems.getAllAbstractProblems()
    const preferredLanguageId = await getPreferredLanguageId()
    return abstractProblemsToRows(abstractProblems, preferredLanguageId)
}

export async function fetchCommandPaletteCourses(): Promise<CommandPaletteCourse[]> {
    if (await isAuthenticated()) {
        const client = await getCurrentClient()
        const data = await fetchCoursesData(client)
        const seen = new Set<string>()
        const rows: CommandPaletteCourse[] = []

        for (const course of [...data.enrolled, ...data.available, ...data.archived]) {
            if (seen.has(course.course_key)) {
                continue
            }
            seen.add(course.course_key)
            rows.push({
                course_key: course.course_key,
                title: course.title,
                ownerName: course.ownerName,
                description: course.description,
                isOfficial: course.isOfficial,
                isOwner: course.isOwner,
            })
        }

        return rows.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
    }

    const courses = await fetchPublicCourses()
    return courses.map((course) => ({
        course_key: course.course_key,
        title: course.title,
        ownerName: course.ownerName,
        description: course.description,
        isOfficial: course.isOfficial,
    }))
}
