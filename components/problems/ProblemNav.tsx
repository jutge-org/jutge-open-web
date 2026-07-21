'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

import { SubNav } from '@/components/general/SubNav'
import { problemNavItems, problemTabFromPathname } from '@/lib/problemNav'
import type { SubNavItem } from '@/store/SubNav'

type ProblemNavProps = {
    pageKey: string
    showInstructorTabs: boolean
}

/** Registers problem section links in the sticky header sub-nav. */
export function ProblemNav({ pageKey, showInstructorTabs }: ProblemNavProps) {
    const pathname = usePathname()
    const activeTab = problemTabFromPathname(pathname, pageKey)

    const items = useMemo((): readonly SubNavItem[] => {
        return problemNavItems(pageKey, showInstructorTabs).map(({ tab, label, href }) => ({
            key: tab,
            label,
            href,
        }))
    }, [pageKey, showInstructorTabs])

    return <SubNav ariaLabel="Problem sections" activeKey={activeTab} items={items} />
}
