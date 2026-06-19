import { CourseTutorsView } from '@/components/instructor/courses/CourseTutorsView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorCourseSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Course tutors — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ course_nm: string }>
}

export default async function InstructorCourseTutorsPage({ params }: Props) {
    const { course_nm } = await params
    const baseHref = `/instructor/courses/${course_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Courses', url: '/instructor/courses' },
                { title: course_nm, url: `${baseHref}/tutors` },
            ]}
        >
            <InstructorSubNav
                items={instructorCourseSubNav(course_nm)}
                baseHref={baseHref}
                activeSegment="tutors"
            />
            <CourseTutorsView />
        </InstructorPageShell>
    )
}
