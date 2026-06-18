import { DocumentationPageShell } from '@/components/documentation/DocumentationPageShell'
import { MarkdownDoc } from '@/components/documentation/MarkdownDoc'

export const metadata = { title: 'FAQ — Documentation — Jutge.org' }

export default function DocumentationFaqPage() {
    return (
        <DocumentationPageShell
            activeTab="faq"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'FAQ', url: '/documentation/faq' },
            ]}
        >
            <MarkdownDoc filename="faq.md" />
        </DocumentationPageShell>
    )
}
