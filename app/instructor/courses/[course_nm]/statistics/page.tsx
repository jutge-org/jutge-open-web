import { CourseStatisticsView } from '@/components/instructor/courses/CourseStatisticsView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { FullWidthBreakout } from '@/components/layout/FullWidthBreakout'
import { instructorCourseSubNav } from '@/lib/instructor/menus'
import { loadCourseStatisticsData } from '@/lib/instructor/loadCourseStatisticsData'

export const metadata = { title: 'Course statistics — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ course_nm: string }>
}

export default async function InstructorCourseStatisticsPage({ params }: Props) {
    const { course_nm } = await params
    const baseHref = `/instructor/courses/${course_nm}`
    const data = await loadCourseStatisticsData(course_nm)

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Courses', url: '/instructor/courses' },
                { title: course_nm, url: `${baseHref}/statistics` },
            ]}
        >
            <InstructorSubNav
                items={instructorCourseSubNav(course_nm)}
                baseHref={baseHref}
                activeSegment="statistics"
            />
            <FullWidthBreakout className="px-2">
                <CourseStatisticsView data={data} />
            </FullWidthBreakout>
        </InstructorPageShell>
    )
}
