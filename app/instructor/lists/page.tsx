import { ListsListView } from '@/components/instructor/lists/ListsListView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'

export const metadata = { title: 'Lists — Instructor — Jutge.org' }

export default function InstructorListsPage() {
    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Lists', url: '/instructor/lists' },
            ]}
        >
            <h1>Instructor Lists</h1>
            <ListsListView />
        </InstructorPageShell>
    )
}
