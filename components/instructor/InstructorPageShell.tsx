import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import type { ReactNode } from 'react'

type InstructorPageShellProps = {
    breadcrumbs: { title: string; url: string }[]
    children: ReactNode
}

export function InstructorPageShell({ breadcrumbs, children }: InstructorPageShellProps) {
    return (
        <div className="flex-1 flex flex-col w-full">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            <div className="flex-1 flex flex-col gap-4">{children}</div>
        </div>
    )
}
