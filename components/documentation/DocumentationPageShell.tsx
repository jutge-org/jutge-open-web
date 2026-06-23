'use client'

import type { ReactNode } from 'react'

import { DocumentationNav } from '@/components/documentation/DocumentationNav'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import type { DocumentationTab } from '@/lib/documentation'

type DocumentationPageShellProps = {
    activeTab: DocumentationTab
    breadcrumbs: { title: string; url: string }[]
    children: ReactNode
}

export function DocumentationPageShell({ activeTab, breadcrumbs, children }: DocumentationPageShellProps) {
    const { authenticated, loading } = useJutgeAuth()

    if (loading) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            <PageTitle section="/documentation" authenticated={authenticated} />
            <DocumentationNav activeTab={activeTab} />
            {children}
        </div>
    )
}
