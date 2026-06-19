import { DocumentPropertiesView } from '@/components/instructor/documents/DocumentPropertiesView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'

type PageProps = {
    params: Promise<{ document_nm: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { document_nm } = await params
    return { title: `${document_nm} — Documents — Instructor — Jutge.org` }
}

export default async function InstructorDocumentPage({ params }: PageProps) {
    const { document_nm } = await params

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Documents', url: '/instructor/documents' },
                { title: document_nm, url: `/instructor/documents/${document_nm}` },
            ]}
        >
            <DocumentPropertiesView document_nm={document_nm} />
        </InstructorPageShell>
    )
}
