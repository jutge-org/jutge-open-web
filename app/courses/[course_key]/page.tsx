import type { Metadata } from 'next'

import { CourseDetailPageClient } from '@/components/pages/CourseDetailPageClient'
import { buildCourseRow } from '@/lib/courses'
import { getServerJutgeClient } from '@/lib/server-request-auth'
import { fetchCourse } from '@/services/queries/courses'

type PageProps = {
    params: Promise<{ course_key: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { course_key: rawCourseKey } = await params

    try {
        const client = await getServerJutgeClient()
        if (!client) {
            return { title: 'Course — Jutge.org' }
        }

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

    return <CourseDetailPageClient courseKey={rawCourseKey} />
}
