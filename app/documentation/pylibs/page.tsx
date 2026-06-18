import { DocumentationPageShell } from '@/components/documentation/DocumentationPageShell'
import { MarkdownDoc } from '@/components/documentation/MarkdownDoc'

export const metadata = { title: 'Python libs — Documentation — Jutge.org' }

export default function DocumentationPylibsPage() {
    return (
        <DocumentationPageShell
            activeTab="pylibs"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Python libs', url: '/documentation/pylibs' },
            ]}
        >
            <MarkdownDoc filename="pylibs.md" />
        </DocumentationPageShell>
    )
}
