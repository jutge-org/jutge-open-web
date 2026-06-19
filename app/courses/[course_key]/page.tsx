import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CourseDetail } from '@/components/courses/CourseDetail'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { getCurrentClient } from '@/lib/auth'
import { buildCourseRow, courseHref } from '@/lib/courses'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchCourse } from '@/services/queries/courses'

export const dynamic = 'force-dynamic'

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
        const result = await fetchCourse(client, rawCourseKey)
        if (!result) {
            notFound()
        }

        const { courseKey, course, status } = result
        const row = buildCourseRow(course, status, courseKey)
        const href = courseHref(courseKey)

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Courses', url: '/courses' },
                        { title: row.title, url: href },
                    ]}
                />
                <CourseDetail courseKey={courseKey} course={course} status={status} />
            </div>
        )
    })
}
