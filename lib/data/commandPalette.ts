import { getCurrentClient, getPreferredLanguageId, isAuthenticated } from '@/lib/data/auth'
import type { ExamRow } from '@/lib/exams'
import type { SearchableCourseRow } from '@/lib/courses'
import jutge from '@/lib/jutge'
import { fetchCoursesData, fetchPublicCourses } from '@/lib/data/courses'
import { fetchExamsData } from '@/lib/data/exams'
import { abstractProblemsToRows, type ProblemRow } from '@/lib/data/problems'

export type CommandPaletteCourse = SearchableCourseRow & {
    course_key: string
    iconUrl: string
}

export async function fetchCommandPaletteProblems(): Promise<ProblemRow[]> {
    const abstractProblems = await jutge.problems.getAllAbstractProblems()
    const preferredLanguageId = await getPreferredLanguageId()
    return abstractProblemsToRows(abstractProblems, preferredLanguageId)
}

export async function fetchCommandPaletteCourses(): Promise<CommandPaletteCourse[]> {
    if (isAuthenticated()) {
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
                iconUrl: course.iconUrl,
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
        iconUrl: course.iconUrl,
    }))
}

export async function fetchCommandPaletteExams(): Promise<ExamRow[]> {
    if (!isAuthenticated()) {
        return []
    }

    const client = await getCurrentClient()
    return fetchExamsData(client)
}
