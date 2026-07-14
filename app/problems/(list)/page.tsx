import { redirect } from 'next/navigation'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { ProblemsList } from '@/components/problems/ProblemsList'
import { getCurrentClient, getPreferredLanguageId, isAuthenticated } from '@/lib/auth'
import { fetchAllAbstractProblems, fetchLanguages, fetchStudentProblemStatuses } from '@/services/queries/problems'

export const metadata = { title: 'Problems — Jutge.org' }

export default async function ProblemsPage() {
    const authenticated = await isAuthenticated()
    if (!authenticated) redirect('/problems/public')

    const client = await getCurrentClient()
    const [preferredLanguageId, languages, statuses] = await Promise.all([
        getPreferredLanguageId(),
        fetchLanguages(),
        fetchStudentProblemStatuses(client),
    ])
    const problems = await fetchAllAbstractProblems(preferredLanguageId)

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Problems', url: '/problems' }]} />
            <PageTitle section="/problems" authenticated />
            {problems.length === 0 ? (
                <p className="text-muted-foreground">Could not load problems. Please try again later.</p>
            ) : (
                <ProblemsList
                    problems={problems}
                    languages={languages}
                    statuses={statuses}
                    showAdvancedSearch
                    showHelp
                    preferredLanguageId={preferredLanguageId}
                />
            )}
        </div>
    )
}
