import { CoursesListView } from '@/components/instructor/courses/CoursesListView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'

export const metadata = { title: 'Courses — Instructor — Jutge.org' }

export default function InstructorCoursesPage() {
    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Courses', url: '/instructor/courses' },
            ]}
        >
            <h1>Instructor Courses</h1>
            <CoursesListView />
        </InstructorPageShell>
    )
}
