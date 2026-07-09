'use client'

import { LayoutWidthContainer } from '@/components/layout/LayoutWidthContainer'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const SUBMISSION_CODE_EDITOR_PATH = /^\/problems\/[^/]+\/submissions\/[^/]+\/code(\/view)?$/
const SUBMISSION_TESTCASE_DIFF_EDITOR_PATH = /^\/problems\/[^/]+\/submissions\/[^/]+\/diffs\/[^/]+\/diff(\/view)?$/
const SUBMISSION_DEBUG_EDITOR_PATH = /^\/problems\/[^/]+\/submissions\/[^/]+\/debug\/view$/

type RootShellProps = {
    children: ReactNode
    header: ReactNode
    footer: ReactNode
}

export function RootShell({ children, header, footer }: RootShellProps) {
    const pathname = usePathname() ?? ''

    if (
        SUBMISSION_CODE_EDITOR_PATH.test(pathname) ||
        SUBMISSION_TESTCASE_DIFF_EDITOR_PATH.test(pathname) ||
        SUBMISSION_DEBUG_EDITOR_PATH.test(pathname)
    ) {
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
