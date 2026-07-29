'use client'

import { SubNav } from '@/components/general/SubNav'
import { documentationNavItems, type DocumentationTab } from '@/lib/documentation'
import type { SubNavItem } from '@/store/SubNav'

const documentationSubNavItems: readonly SubNavItem[] = documentationNavItems.map(({ tab, label, href, external }) => ({
    key: tab,
    label,
    href,
    external,
}))

type DocumentationNavProps = {
    activeTab: DocumentationTab
}

/** Registers documentation section links in the sticky header sub-nav. */
export function DocumentationNav({ activeTab }: DocumentationNavProps) {
    return <SubNav ariaLabel="Documentation sections" activeKey={activeTab} items={documentationSubNavItems} />
}
