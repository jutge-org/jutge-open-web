import { AdministratorPageShell } from '@/components/administrator/AdministratorPageShell'
import CoursesView from '@/components/administrator/courses/CoursesView'
import { renderAdministrator } from '@/lib/renderAuthed'

export const metadata = { title: 'Courses — Administrator — Jutge.org' }

export default async function AdministratorCoursesPage() {
    return renderAdministrator(() => (
        <AdministratorPageShell
            breadcrumbs={[
                { title: 'Administrator', url: '/administrator' },
                { title: 'Courses', url: '/administrator/courses' },
            ]}
        >
            <CoursesView />
        </AdministratorPageShell>
    ))
}
