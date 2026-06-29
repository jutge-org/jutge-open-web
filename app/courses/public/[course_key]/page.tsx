import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GuestCourseDetail } from '@/components/courses/GuestCourseDetail'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { isAuthenticated } from '@/lib/auth'
import { buildGuestCourseRow, publicCourseHref } from '@/lib/courses'
import { fetchPublicCourse } from '@/services/queries/courses'

type PageProps = {
    params: Promise<{ course_key: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { course_key: rawCourseKey } = await params

    try {
        const result = await fetchPublicCourse(rawCourseKey)
        if (!result) {
            return { title: 'Course — Jutge.org' }
        }

        const row = buildGuestCourseRow(result.course, result.courseKey)
        return { title: `${row.title} — Public courses — Jutge.org` }
    } catch {
        return { title: 'Course — Jutge.org' }
    }
}

export default async function PublicCoursePage({ params }: PageProps) {
    const { course_key: rawCourseKey } = await params
    const result = await fetchPublicCourse(rawCourseKey)

    if (!result) {
        notFound()
    }

    const { courseKey, course } = result
    const row = buildGuestCourseRow(course, courseKey)
    const href = publicCourseHref(courseKey)

    const authenticated = await isAuthenticated()

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs
                breadcrumbs={[
                    { title: 'Courses', url: authenticated ? '/courses' : '/courses/public' },
                    { title: 'Public courses', url: '/courses/public' },
                    { title: row.title, url: href },
                ]}
            />
            <PageTitle section="/courses" authenticated={false} hidden={false} />
            <GuestCourseDetail courseKey={courseKey} course={course} />
        </div>
    )
}
