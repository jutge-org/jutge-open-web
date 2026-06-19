import { InstructorIndex } from '@/components/instructor/InstructorIndex'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { PageTitle } from '@/components/general/PageTitle'

export const metadata = { title: 'Instructor — Jutge.org' }

export default function InstructorPage() {
    return (
        <InstructorPageShell breadcrumbs={[{ title: 'Instructor', url: '/instructor' }]}>
            <PageTitle section="/instructor" authenticated />
            <InstructorIndex />
        </InstructorPageShell>
    )
}
