import { ProblemsListView } from '@/components/instructor/problems/ProblemsListView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'

export const metadata = { title: 'Problems — Instructor — Jutge.org' }

export default function InstructorProblemsPage() {
    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Problems', url: '/instructor/problems' },
            ]}
        >
            <h1>Instructor Problems</h1>
            <ProblemsListView />
        </InstructorPageShell>
    )
}
