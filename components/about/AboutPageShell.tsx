'use client'

import type { ReactNode } from 'react'

import { AboutNav } from '@/components/about/AboutNav'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import type { AboutTab } from '@/lib/about'

type AboutPageShellProps = {
    activeTab: AboutTab
    breadcrumbs: { title: string; url: string }[]
    children: ReactNode
}

export function AboutPageShell({ activeTab, breadcrumbs, children }: AboutPageShellProps) {
    const { authenticated, loading } = useJutgeAuth()

    if (loading) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            <PageTitle section="/about" authenticated={authenticated} />
            <AboutNav activeTab={activeTab} />
            {children}
        </div>
    )
}
