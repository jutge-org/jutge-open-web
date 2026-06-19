import { CourseDuplicateView } from '@/components/instructor/courses/CourseDuplicateView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorCourseSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Duplicate course — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ course_nm: string }>
}

export default async function InstructorCourseDuplicatePage({ params }: Props) {
    const { course_nm } = await params
    const baseHref = `/instructor/courses/${course_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Courses', url: '/instructor/courses' },
                { title: course_nm, url: `${baseHref}/duplicate` },
            ]}
        >
            <InstructorSubNav
                items={instructorCourseSubNav(course_nm)}
                baseHref={baseHref}
                activeSegment="duplicate"
            />
            <CourseDuplicateView />
        </InstructorPageShell>
    )
}
