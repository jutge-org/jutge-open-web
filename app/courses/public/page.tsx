import { GuestCoursesList } from '@/components/courses/GuestCoursesList'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { isAuthenticated } from '@/lib/auth'
import { fetchPublicCourses } from '@/services/queries/courses'

export const metadata = { title: 'Public courses — Jutge.org' }

export default async function PublicCoursesPage() {
    const [courses, authenticated] = await Promise.all([fetchPublicCourses(), isAuthenticated()])

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Courses', url: '/courses/public' }]} />
            <PageTitle
                section="/courses"
                authenticated={authenticated}
                hidden={false}
                description={
                    authenticated ? 'Browse public courses available on Jutge.org' : undefined
                }
            />
            <GuestCoursesList courses={courses} />
        </div>
    )
}
