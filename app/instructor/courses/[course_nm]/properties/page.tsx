import { CoursePropertiesView } from '@/components/instructor/courses/CoursePropertiesView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorCourseSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Course properties — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ course_nm: string }>
}

export default async function InstructorCoursePropertiesPage({ params }: Props) {
    const { course_nm } = await params
    const baseHref = `/instructor/courses/${course_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Courses', url: '/instructor/courses' },
                { title: course_nm, url: `${baseHref}/properties` },
            ]}
        >
            <InstructorSubNav
                items={instructorCourseSubNav(course_nm)}
                baseHref={baseHref}
                activeSegment="properties"
            />
            <CoursePropertiesView />
        </InstructorPageShell>
    )
}
