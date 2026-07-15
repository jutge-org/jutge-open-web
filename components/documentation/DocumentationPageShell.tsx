'use client'

import { useAuth } from '@/components/AuthProvider'
import { DocumentationNav } from '@/components/documentation/DocumentationNav'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import type { DocumentationTab } from '@/lib/documentation'
import type { ReactNode } from 'react'

type DocumentationPageShellProps = {
    activeTab: DocumentationTab
    breadcrumbs: { title: string; url: string }[]
    children: ReactNode
}

export function DocumentationPageShell({ activeTab, breadcrumbs, children }: DocumentationPageShellProps) {
    const { user } = useAuth()

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            <PageTitle section="/documentation" authenticated={user !== null} />
            <DocumentationNav activeTab={activeTab} />
            {children}
        </div>
    )
}
