'use client'

import { useAuth } from '@/components/AuthProvider'
import { AboutNav } from '@/components/about/AboutNav'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import type { AboutTab } from '@/lib/about'
import type { ReactNode } from 'react'

type AboutPageShellProps = {
    activeTab: AboutTab
    breadcrumbs: { title: string; url: string }[]
    children: ReactNode
}

export function AboutPageShell({ activeTab, breadcrumbs, children }: AboutPageShellProps) {
    const { user } = useAuth()

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            <PageTitle section="/about" authenticated={user !== null} />
            <AboutNav activeTab={activeTab} />
            {children}
        </div>
    )
}
