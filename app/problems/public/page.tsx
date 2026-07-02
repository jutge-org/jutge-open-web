import { redirect } from 'next/navigation'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { ProblemsList } from '@/components/problems/ProblemsList'
import { getPreferredLanguageId, isAuthenticated } from '@/lib/auth'
import { fetchAllAbstractProblems, fetchLanguages } from '@/services/queries/problems'

export const metadata = { title: 'Public problems — Jutge.org' }

export default async function PublicProblemsPage() {
    const authenticated = await isAuthenticated()
    if (authenticated) redirect('/problems')

    const [preferredLanguageId, languages] = await Promise.all([
        getPreferredLanguageId(),
        fetchLanguages(),
    ])
    const problems = await fetchAllAbstractProblems(preferredLanguageId, { allLanguageTitles: true })

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Problems', url: '/problems/public' }]} />
            <PageTitle section="/problems" authenticated={false} hidden={false} />
            {problems.length === 0 ? (
                <p className="text-muted-foreground">Could not load problems. Please try again later.</p>
            ) : (
                <ProblemsList problems={problems} languages={languages} preferredLanguageId={preferredLanguageId} />
            )}
        </div>
    )
}
