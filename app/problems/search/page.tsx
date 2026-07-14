import { redirect } from 'next/navigation'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemsSearchView } from '@/components/problems/ProblemsSearchView'
import { isAuthenticated } from '@/lib/auth'

export const metadata = { title: 'Search — Problems — Jutge.org' }

export default async function ProblemsSearchPage() {
    const authenticated = await isAuthenticated()
    if (!authenticated) redirect('/problems/public')

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs
                breadcrumbs={[
                    { title: 'Problems', url: '/problems' },
                    { title: 'Search', url: '/problems/search' },
                ]}
            />
            <ProblemsSearchView />
        </div>
    )
}
