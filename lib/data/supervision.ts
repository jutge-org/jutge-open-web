import { getCurrentClient, getPreferredLanguageId } from '@/lib/data/auth'
import { buildCourseRow, courseIconUrl, listTitleFromKey } from '@/lib/courses'
import { withSupervisorClient } from '@/lib/supervisor/client'
import {
    buildSupervisionLastSubmissionsByProblemNm,
    type SupervisionContext,
    type SupervisionCourseOption,
} from '@/lib/supervision'
import type { AbstractStatus, PublicProfile, TutorSubmission } from '@/lib/jutge_api_client'
import type { LastSubmissionInfo } from '@/lib/submissions'
import { fetchCourse, fetchCoursesData } from '@/lib/data/courses'
import { fetchCourseListsData, type CourseListData } from '@/lib/data/lists'
import { fetchAllAbstractProblems, fetchLanguages } from '@/lib/data/problems'

export async function fetchSupervisionCourseOptions(): Promise<SupervisionCourseOption[]> {
    const client = await getCurrentClient()
    const [courseKeys, coursesData] = await Promise.all([
        withSupervisorClient((supervisorClient) => supervisorClient.tutor.courses.getCoursesKeys()),
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
}

export type SupervisionStudentPageData = {
    profile: PublicProfile
    submissions: TutorSubmission[]
    courseKey: string
    courseTitle: string
    lists: CourseListData[]
    languages: Awaited<ReturnType<typeof fetchLanguages>>
    statuses: Record<string, AbstractStatus>
    lastSubmissions: Record<string, LastSubmissionInfo>
    supervisionContext: SupervisionContext
}

export async function fetchSupervisionStudentPageData(
    courseKey: string,
    email: string,
): Promise<SupervisionStudentPageData | null> {
    const client = await getCurrentClient()
    const [profile, submissions, statuses, courseResult, languages, preferredLanguageId, userProfile] =
        await Promise.all([
            withSupervisorClient((supervisorClient) => supervisorClient.tutor.profile.get(email)),
            withSupervisorClient((supervisorClient) =>
                supervisorClient.tutor.submissions.getAll({ course_key: courseKey, email }),
            ),
            withSupervisorClient((supervisorClient) =>
                supervisorClient.tutor.statuses.getAll({ course_key: courseKey, email }),
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
    const courseTitle = buildCourseRow(courseResult.course, courseResult.status, courseResult.courseKey).title
    const supervisionContext: SupervisionContext = {
        courseKey: courseResult.courseKey,
        email,
        studentName: profile.name,
    }

    return {
        profile,
        submissions,
        courseKey: courseResult.courseKey,
        courseTitle,
        lists,
        languages,
        statuses,
        lastSubmissions: buildSupervisionLastSubmissionsByProblemNm(submissions, supervisionContext),
        supervisionContext: { ...supervisionContext, studentName: profile.name },
    }
}

export async function fetchSupervisionStudentProfile(courseKey: string, email: string): Promise<PublicProfile | null> {
    try {
        return await withSupervisorClient((client) => client.tutor.profile.get(email))
    } catch {
        return null
    }
}
