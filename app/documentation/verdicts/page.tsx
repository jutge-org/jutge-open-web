import { DocumentationPageShell } from '@/components/documentation/DocumentationPageShell'
import { VerdictsTable } from '@/components/documentation/VerdictsTable'
import { Button } from '@/components/ui/button'
import { fetchVerdicts } from '@/services/queries/tables'
import { FileCode2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Verdicts — Documentation — Jutge.org' }

export default async function DocumentationVerdictsPage() {
    const verdicts = await fetchVerdicts()

    return (
        <DocumentationPageShell
            activeTab="verdicts"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Verdicts', url: '/documentation/verdicts' },
            ]}
        >
            {verdicts.length === 0 ? (
                <p className="text-muted-foreground">Could not load verdicts. Please try again later.</p>
            ) : (
                <>
                    <VerdictsTable verdicts={verdicts} />
                    <div className="flex justify-end">
                        <Button variant="outline" asChild>
                            <Link href="/documentation/verdicts/all">
                                <FileCode2 aria-hidden />
                                All verdicts in one page
                            </Link>
                        </Button>
                    </div>
                </>
            )}
        </DocumentationPageShell>
    )
}
