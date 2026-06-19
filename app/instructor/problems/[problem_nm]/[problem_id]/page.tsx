import { ProblemTranslationView } from '@/components/instructor/problems/ProblemTranslationView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorProblemSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Problem translation — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ problem_nm: string; problem_id: string }>
}

export default async function InstructorProblemTranslationPage({ params }: Props) {
    const { problem_nm, problem_id } = await params
    const baseHref = `/instructor/problems/${problem_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Problems', url: '/instructor/problems' },
                { title: problem_nm, url: `${baseHref}/properties` },
                { title: problem_id, url: `${baseHref}/${problem_id}` },
            ]}
        >
            <InstructorSubNav
                items={instructorProblemSubNav(problem_nm)}
                baseHref={baseHref}
                activeSegment="properties"
            />
            <ProblemTranslationView />
        </InstructorPageShell>
    )
}
