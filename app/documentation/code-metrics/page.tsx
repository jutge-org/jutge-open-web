import { DocumentationPageShell } from '@/components/documentation/DocumentationPageShell'
import { MarkdownDoc } from '@/components/documentation/MarkdownDoc'

export const metadata = { title: 'Code metrics — Documentation — Jutge.org' }

export default function DocumentationCodeMetricsPage() {
    return (
        <DocumentationPageShell
            activeTab="code-metrics"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Code metrics', url: '/documentation/code-metrics' },
            ]}
        >
            <MarkdownDoc filename="code-metrics.md" />
        </DocumentationPageShell>
    )
}
