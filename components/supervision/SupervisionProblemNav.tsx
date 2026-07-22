'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

import { SubNav } from '@/components/general/SubNav'
import {
    supervisionProblemNavItems,
    supervisionProblemTabFromPathname,
    type SupervisionContext,
} from '@/lib/supervision'
import type { SubNavItem } from '@/store/SubNav'

type SupervisionProblemNavProps = {
    pageKey: string
    context: SupervisionContext
}

/** Registers supervision problem section links in the sticky header sub-nav. */
export function SupervisionProblemNav({ pageKey, context }: SupervisionProblemNavProps) {
    const pathname = usePathname()
    const activeTab = supervisionProblemTabFromPathname(pathname, pageKey, context)

    const items = useMemo((): readonly SubNavItem[] => {
        return supervisionProblemNavItems(context, pageKey).map(({ tab, label, href }) => ({
            key: tab,
            label,
            href,
        }))
    }, [context, pageKey])

    return <SubNav ariaLabel="Problem sections" activeKey={activeTab} items={items} />
}
