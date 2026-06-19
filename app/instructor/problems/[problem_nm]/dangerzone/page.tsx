import { ProblemDangerZoneView } from '@/components/instructor/problems/ProblemDangerZoneView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorProblemSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Problem danger zone — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ problem_nm: string }>
}

export default async function InstructorProblemDangerZonePage({ params }: Props) {
    const { problem_nm } = await params
    const baseHref = `/instructor/problems/${problem_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Problems', url: '/instructor/problems' },
                { title: problem_nm, url: `${baseHref}/properties` },
            ]}
        >
            <InstructorSubNav
                items={instructorProblemSubNav(problem_nm)}
                baseHref={baseHref}
                activeSegment="dangerzone"
            />
            <ProblemDangerZoneView />
        </InstructorPageShell>
    )
}
