import { CompilersTable } from '@/components/documentation/CompilersTable'
import { DocumentationPageShell } from '@/components/documentation/DocumentationPageShell'
import { fetchCompilers } from '@/services/queries/tables'

export const metadata = { title: 'Compilers — Documentation — Jutge.org' }

export default async function DocumentationCompilersPage() {
    const compilers = await fetchCompilers()

    return (
        <DocumentationPageShell
            activeTab="compilers"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Compilers', url: '/documentation/compilers' },
            ]}
        >
            {compilers.length === 0 ? (
                <p className="text-muted-foreground">Could not load compilers. Please try again later.</p>
            ) : (
                <CompilersTable compilers={compilers} />
            )}
        </DocumentationPageShell>
    )
}
