import { CourseProblemStatisticsView } from '@/components/instructor/courses/CourseProblemStatisticsView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { FullWidthBreakout } from '@/components/layout/FullWidthBreakout'
import { instructorCourseSubNav } from '@/lib/instructor/menus'
import { loadCourseProblemStatisticsData } from '@/lib/instructor/loadCourseProblemStatisticsData'

export const metadata = { title: 'Course problem statistics — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ course_nm: string; problem_nm: string }>
}

export default async function InstructorCourseProblemStatisticsPage({ params }: Props) {
    const { course_nm, problem_nm } = await params
    const baseHref = `/instructor/courses/${course_nm}`
    const data = await loadCourseProblemStatisticsData(course_nm, problem_nm)

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Courses', url: '/instructor/courses' },
                { title: course_nm, url: `${baseHref}/statistics` },
                { title: problem_nm, url: `${baseHref}/statistics/${problem_nm}` },
            ]}
        >
            <InstructorSubNav
                items={instructorCourseSubNav(course_nm)}
                baseHref={baseHref}
                activeSegment="statistics"
            />
            <FullWidthBreakout className="mt-4 px-2">
                <CourseProblemStatisticsView data={data} />
            </FullWidthBreakout>
        </InstructorPageShell>
    )
}
