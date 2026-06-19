import { redirect } from 'next/navigation'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Problems — Jutge.org' }

export default async function ProblemsPage() {
    const authenticated = await isAuthenticated()
    if (!authenticated) redirect('/problems/public')

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Problems', url: '/problems' }]} />
            <PageTitle section="/problems" authenticated />
            <p className="text-muted-foreground">Coming soon.</p>
        </div>
    )
}
