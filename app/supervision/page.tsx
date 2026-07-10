import type { Metadata } from 'next'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { SupervisionForm } from '@/components/supervision/SupervisionForm'
import { getCurrentClient } from '@/lib/auth'
import { canSuperviseCourse } from '@/lib/courses'
import { renderSupervisor } from '@/lib/renderAuthed'
import type { SupervisionCourseOption } from '@/lib/supervision'
import { fetchCoursesData } from '@/services/queries/courses'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Supervision — Jutge.org' }

export default async function SupervisionPage() {
    return renderSupervisor(async (user) => {
        const client = await getCurrentClient()
        const data = await fetchCoursesData(client)
        const courses: SupervisionCourseOption[] = data.enrolled
            .filter((course) => canSuperviseCourse(course))
            .map((course) => ({
                courseKey: course.course_key,
                title: course.title,
                iconUrl: course.iconUrl,
            }))

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs breadcrumbs={[{ title: 'Supervision', url: '/supervision' }]} />
                <PageTitle section="/supervision" authenticated hidden={false} />
                <SupervisionForm userId={user.id} courses={courses} />
            </div>
        )
    })
}
