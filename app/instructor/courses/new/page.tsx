import { CoursesNewView } from '@/components/instructor/courses/CoursesNewView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'

export const metadata = { title: 'Add course — Instructor — Jutge.org' }

export default function InstructorCoursesNewPage() {
    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Courses', url: '/instructor/courses' },
                { title: 'Add course', url: '/instructor/courses/new' },
            ]}
        >
            <CoursesNewView />
        </InstructorPageShell>
    )
}
