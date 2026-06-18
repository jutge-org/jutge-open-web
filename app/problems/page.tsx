import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { ProblemsList } from '@/components/problems/ProblemsList'
import { isAuthenticated } from '@/lib/auth'
import { fetchAllAbstractProblems, fetchLanguages } from '@/services/queries/problems'

export const metadata = { title: 'Problems — Jutge.org' }

export default async function ProblemsPage() {
    const [authenticated, problems, languages] = await Promise.all([
        isAuthenticated(),
        fetchAllAbstractProblems(),
        fetchLanguages(),
    ])

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Problems', url: '/problems' }]} />
            <PageTitle section="/problems" authenticated={authenticated} />
            {problems.length === 0 ? (
                <p className="text-muted-foreground">Could not load problems. Please try again later.</p>
            ) : (
                <ProblemsList problems={problems} languages={languages} />
            )}
        </div>
    )
}
