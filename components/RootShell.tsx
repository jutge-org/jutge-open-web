'use client'

import { LayoutWidthContainer } from '@/components/layout/LayoutWidthContainer'
import { isFullscreenSubmissionEditorPath } from '@/lib/submissions'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type RootShellProps = {
    children: ReactNode
    header: ReactNode
    footer: ReactNode
}

export function RootShell({ children, header, footer }: RootShellProps) {
    const pathname = usePathname() ?? ''

    if (isFullscreenSubmissionEditorPath(pathname)) {
        return children
    }

    return (
        <>
            {header}
            <LayoutWidthContainer as="main" id="main-content" className="flex-1 flex flex-col px-4 pt-4 pb-2 sm:px-6">
                {children}
            </LayoutWidthContainer>
            {footer}
        </>
    )
}
