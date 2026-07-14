import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CourseDetail } from '@/components/courses/CourseDetail'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { getCurrentClient, getPreferredLanguageId } from '@/lib/auth'
import { buildCourseRow, courseHref, isCourseOwnedByUser } from '@/lib/courses'
import type { LastSubmissionInfo } from '@/lib/submissions'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchCourse } from '@/services/queries/courses'
import { fetchCourseListsData } from '@/services/queries/lists'
import { fetchAllAbstractProblems, fetchLanguages, fetchStudentProblemStatuses } from '@/services/queries/problems'
import { fetchLastSubmissionsByProblemNm } from '@/services/queries/submissions'

type PageProps = {
    params: Promise<{ course_key: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { course_key: rawCourseKey } = await params

    try {
        const client = await getCurrentClient()
        const result = await fetchCourse(client, rawCourseKey)
        if (!result) {
            return { title: 'Course — Jutge.org' }
        }

        const row = buildCourseRow(result.course, result.status, result.courseKey)
        return { title: `${row.title} — Courses — Jutge.org` }
    } catch {
        return { title: 'Course — Jutge.org' }
    }
}

export default async function CoursePage({ params }: PageProps) {
    const { course_key: rawCourseKey } = await params

    return renderAuthed(async () => {
        const client = await getCurrentClient()
        const [result, profile] = await Promise.all([fetchCourse(client, rawCourseKey), client.student.profile.get()])
        if (!result) {
            notFound()
        }

        const { courseKey, course, status } = result
        const isOwner = isCourseOwnedByUser(course.owner, profile)
        const row = buildCourseRow(course, status, courseKey, isOwner)
        const href = courseHref(courseKey)

        const isEnrolled = status !== 'available'
        let lists: Awaited<ReturnType<typeof fetchCourseListsData>> = []
        let languages: Awaited<ReturnType<typeof fetchLanguages>> = {}
        let statuses: Awaited<ReturnType<typeof fetchStudentProblemStatuses>> | undefined
        let lastSubmissions: Record<string, LastSubmissionInfo> | undefined

        if (isEnrolled) {
            const [preferredLanguageId, languagesResult, statusesResult, lastSubmissionsByProblemNm] =
                await Promise.all([
                    getPreferredLanguageId(),
                    fetchLanguages(),
                    fetchStudentProblemStatuses(client),
                    fetchLastSubmissionsByProblemNm(client),
                ])
            const problems = await fetchAllAbstractProblems(preferredLanguageId)
            lists = await fetchCourseListsData(client, course.lists, problems, profile)
            languages = languagesResult
            statuses = statusesResult
            lastSubmissions = Object.fromEntries(lastSubmissionsByProblemNm)
        }

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Courses', url: '/courses' },
                        { title: row.title, url: href },
                    ]}
                />
                <CourseDetail
                    courseKey={courseKey}
                    course={course}
                    status={status}
                    isOwner={isOwner}
                    lists={lists}
                    languages={languages}
                    statuses={statuses}
                    lastSubmissions={lastSubmissions}
                />
            </div>
        )
    })
}
