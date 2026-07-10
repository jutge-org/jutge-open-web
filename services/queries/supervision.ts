import { cache } from 'react'

import { getCurrentClient, getPreferredLanguageId } from '@/lib/auth'
import { buildCourseRow, courseIconUrl, listTitleFromKey } from '@/lib/courses'
import { deriveAbstractStatusesFromCourseSubmissions } from '@/lib/supervisionSubmissions'
import { withSupervisorClient } from '@/lib/supervisor/with-supervisor-client'
import type { SupervisionCourseOption } from '@/lib/supervision'
import type { AbstractStatus, CourseSubmission, PublicProfile } from '@/lib/jutge_api_client'
import { fetchCourse, fetchCoursesData } from '@/services/queries/courses'
import { fetchCourseListsData, type CourseListData } from '@/services/queries/lists'
import { fetchAllAbstractProblems, fetchLanguages } from '@/services/queries/problems'

export const fetchSupervisionCourseOptions = cache(async (): Promise<SupervisionCourseOption[]> => {
    const client = await getCurrentClient()
    const [courseKeys, coursesData] = await Promise.all([
        withSupervisorClient((supervisorClient) => supervisorClient.tutor.courses.coursesKeys()),
        fetchCoursesData(client),
    ])

    const enrolledByKey = new Map(coursesData.enrolled.map((course) => [course.course_key, course]))
    const options: SupervisionCourseOption[] = []

    for (const courseKey of courseKeys) {
        const enrolled = enrolledByKey.get(courseKey)
        if (enrolled) {
            options.push({
                courseKey,
                title: enrolled.title,
                iconUrl: enrolled.iconUrl,
            })
            continue
        }

        const fetched = await fetchCourse(client, courseKey)
        if (fetched) {
            const row = buildCourseRow(fetched.course, fetched.status, fetched.courseKey)
            options.push({
                courseKey,
                title: row.title,
                iconUrl: row.iconUrl,
            })
            continue
        }

        options.push({
            courseKey,
            title: listTitleFromKey(courseKey),
            iconUrl: courseIconUrl(null),
        })
    }

    return options.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
})

export type SupervisionStudentPageData = {
    profile: PublicProfile
    submissions: CourseSubmission[]
    courseKey: string
    courseTitle: string
    lists: CourseListData[]
    languages: Awaited<ReturnType<typeof fetchLanguages>>
    statuses: Record<string, AbstractStatus>
}

export const fetchSupervisionStudentPageData = cache(
    async (courseKey: string, email: string): Promise<SupervisionStudentPageData | null> => {
        const client = await getCurrentClient()
        const [profile, submissions, courseResult, languages, preferredLanguageId, userProfile] = await Promise.all([
            withSupervisorClient((supervisorClient) => supervisorClient.tutor.profile.profile(email)),
            withSupervisorClient((supervisorClient) =>
                supervisorClient.tutor.submissions.submissions({ course_key: courseKey, email }),
            ),
            fetchCourse(client, courseKey),
            fetchLanguages(),
            getPreferredLanguageId(),
            client.student.profile.get(),
        ])

        if (!courseResult) {
            return null
        }

        const problems = await fetchAllAbstractProblems(preferredLanguageId)
        const lists = await fetchCourseListsData(client, courseResult.course.lists, problems, userProfile)
        const statuses = deriveAbstractStatusesFromCourseSubmissions(submissions)
        const courseTitle = buildCourseRow(courseResult.course, courseResult.status, courseResult.courseKey).title

        return {
            profile,
            submissions,
            courseKey: courseResult.courseKey,
            courseTitle,
            lists,
            languages,
            statuses,
        }
    },
)
