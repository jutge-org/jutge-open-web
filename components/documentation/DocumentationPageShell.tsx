import { DocumentationNav } from '@/components/documentation/DocumentationNav'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import type { DocumentationTab } from '@/lib/documentation'
import { isAuthenticated } from '@/lib/auth'
import type { ReactNode } from 'react'

type DocumentationPageShellProps = {
    activeTab: DocumentationTab
    breadcrumbs: { title: string; url: string }[]
    children: ReactNode
}

export async function DocumentationPageShell({ activeTab, breadcrumbs, children }: DocumentationPageShellProps) {
    const authenticated = await isAuthenticated()

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            <PageTitle section="/documentation" authenticated={authenticated} />
            <DocumentationNav activeTab={activeTab} />
            {children}
        </div>
    )
}
