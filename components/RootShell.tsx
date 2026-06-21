'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const SUBMISSION_CODE_EDITOR_PATH = /^\/problems\/[^/]+\/submissions\/[^/]+\/code(\/view)?$/
const SUBMISSION_TESTCASE_DIFF_EDITOR_PATH =
    /^\/problems\/[^/]+\/submissions\/[^/]+\/diffs\/[^/]+\/diff(\/view)?$/

type RootShellProps = {
    children: ReactNode
    header: ReactNode
    footer: ReactNode
}

export function RootShell({ children, header, footer }: RootShellProps) {
    const pathname = usePathname() ?? ''

    if (SUBMISSION_CODE_EDITOR_PATH.test(pathname) || SUBMISSION_TESTCASE_DIFF_EDITOR_PATH.test(pathname)) {
        return children
    }

    return (
        <>
            {header}
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-4 pb-2 sm:px-6">{children}</main>
            {footer}
        </>
    )
}
