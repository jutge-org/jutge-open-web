import { AboutNav } from '@/components/about/AboutNav'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import type { AboutTab } from '@/lib/about'
import { isAuthenticated } from '@/lib/auth'
import type { ReactNode } from 'react'

type AboutPageShellProps = {
    activeTab: AboutTab
    breadcrumbs: { title: string; url: string }[]
    children: ReactNode
}

export async function AboutPageShell({ activeTab, breadcrumbs, children }: AboutPageShellProps) {
    const authenticated = await isAuthenticated()

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            <PageTitle section="/about" authenticated={authenticated} />
            <AboutNav activeTab={activeTab} />
            {children}
        </div>
    )
}
