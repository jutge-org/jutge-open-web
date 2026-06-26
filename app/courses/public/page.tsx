import { redirect } from 'next/navigation'

import { GuestCoursesList } from '@/components/courses/GuestCoursesList'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { isAuthenticated } from '@/lib/auth'
import { fetchPublicCourses } from '@/services/queries/courses'

export const metadata = { title: 'Public courses — Jutge.org' }

export default async function PublicCoursesPage() {
    const authenticated = await isAuthenticated()
    if (authenticated) redirect('/courses')

    const courses = await fetchPublicCourses()

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Courses', url: '/courses/public' }]} />
            <PageTitle section="/courses" authenticated={false} hidden={false} />
            <GuestCoursesList courses={courses} />
        </div>
    )
}
