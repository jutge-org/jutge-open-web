import { CoursesList } from '@/components/courses/CoursesList'
import { CoursesNav } from '@/components/courses/CoursesNav'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { getCurrentClient, getCurrentUser } from '@/lib/auth'
import type { CoursesData, CoursesTab } from '@/lib/courses'
import { fetchCoursesData } from '@/services/queries/courses'

type CoursesStudentShellProps = {
    activeTab: CoursesTab
    data: CoursesData
    children: React.ReactNode
}

export function CoursesStudentShell({ activeTab, data, children }: CoursesStudentShellProps) {
    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Courses', url: '/courses' }]} />
            <PageTitle section="/courses" authenticated />
            <CoursesNav
                activeTab={activeTab}
                counts={{
                    enrolled: data.enrolled,
                    available: data.available,
                    archived: data.archived,
                }}
            />
            {children}
        </div>
    )
}

type CoursesTabPageProps = {
    activeTab: CoursesTab
}

export async function CoursesTabPage({ activeTab }: CoursesTabPageProps) {
    const [client, user] = await Promise.all([getCurrentClient(), getCurrentUser()])
    const data = await fetchCoursesData(client)

    return (
        <CoursesStudentShell activeTab={activeTab} data={data}>
            <CoursesList tab={activeTab} courses={data[activeTab]} userId={user.id} />
        </CoursesStudentShell>
    )
}
