import { CoursesList } from '@/components/courses/CoursesList'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { getCurrentClient } from '@/lib/auth'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchCoursesData } from '@/services/queries/courses'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Courses — Jutge.org' }

export default async function CoursesPage() {
    return renderAuthed(async () => {
        const client = await getCurrentClient()
        const data = await fetchCoursesData(client)

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs breadcrumbs={[{ title: 'Courses', url: '/courses' }]} />
                <PageTitle section="/courses" authenticated />
                <CoursesList data={data} />
            </div>
        )
    })
}
