'use client'

import type { ReactNode } from 'react'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { SupervisionStudentBanner } from '@/components/supervision/SupervisionStudentBanner'
import type { SupervisionContext } from '@/lib/supervision'
import type { MainBreadcrumbSegment } from '@/store/MainBreadcrumbs'

type SupervisionPageShellProps = {
    context: SupervisionContext
    courseTitle?: string
    breadcrumbs: MainBreadcrumbSegment[]
    children: ReactNode
}

export function SupervisionPageShell({ context, courseTitle, breadcrumbs, children }: SupervisionPageShellProps) {
    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            <SupervisionStudentBanner context={context} courseTitle={courseTitle} />
            {children}
        </div>
    )
}
