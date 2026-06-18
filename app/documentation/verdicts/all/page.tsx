import { DocumentationPageShell } from '@/components/documentation/DocumentationPageShell'
import { VerdictDetail } from '@/components/documentation/VerdictDetail'
import { fetchVerdicts } from '@/services/queries/tables'

export const metadata = { title: 'All verdicts — Documentation — Jutge.org' }

export default async function DocumentationVerdictsAllPage() {
    const verdicts = await fetchVerdicts()

    return (
        <DocumentationPageShell
            activeTab="verdicts"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Verdicts', url: '/documentation/verdicts' },
                { title: 'All', url: '/documentation/verdicts/all' },
            ]}
        >
            {verdicts.length === 0 ? (
                <p className="text-muted-foreground">Could not load verdicts. Please try again later.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {verdicts.map((verdict) => (
                        <VerdictDetail key={verdict.verdict_id} verdict={verdict} />
                    ))}
                </div>
            )}
        </DocumentationPageShell>
    )
}
