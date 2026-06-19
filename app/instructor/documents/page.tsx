import { DocumentsListView } from '@/components/instructor/documents/DocumentsListView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'

export const metadata = { title: 'Documents — Instructor — Jutge.org' }

export default function InstructorDocumentsPage() {
    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Documents', url: '/instructor/documents' },
            ]}
        >
            <DocumentsListView />
        </InstructorPageShell>
    )
}
