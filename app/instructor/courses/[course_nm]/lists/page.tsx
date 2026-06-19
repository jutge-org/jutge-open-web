import { CourseListsView } from '@/components/instructor/courses/CourseListsView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { getCurrentClient } from '@/lib/auth'
import { instructorCourseSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Course lists — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ course_nm: string }>
}

export default async function InstructorCourseListsPage({ params }: Props) {
    const { course_nm } = await params
    const baseHref = `/instructor/courses/${course_nm}`
    const client = await getCurrentClient()
    const profile = await client.student.profile.get()

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Courses', url: '/instructor/courses' },
                { title: course_nm, url: `${baseHref}/lists` },
            ]}
        >
            <InstructorSubNav
                items={instructorCourseSubNav(course_nm)}
                baseHref={baseHref}
                activeSegment="lists"
            />
            <CourseListsView profile={profile} />
        </InstructorPageShell>
    )
}
