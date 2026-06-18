import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { FullWidthBreakout } from '@/components/layout/FullWidthBreakout'
import type { ReactNode } from 'react'

type AdministratorPageShellProps = {
    breadcrumbs: { title: string; url: string }[]
    children: ReactNode
}

export function AdministratorPageShell({ breadcrumbs, children }: AdministratorPageShellProps) {
    return (
        <div className="w-full">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            {children}
        </div>
    )
}
