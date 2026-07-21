'use client'

import { SubNav } from '@/components/general/SubNav'
import { aboutNavItems, type AboutTab } from '@/lib/about'
import type { SubNavItem } from '@/store/SubNav'

const aboutSubNavItems: readonly SubNavItem[] = aboutNavItems.map(({ tab, label, href, external }) => ({
    key: tab,
    label,
    href,
    external,
}))

type AboutNavProps = {
    activeTab: AboutTab
}

/** Registers about section links in the sticky header sub-nav. */
export function AboutNav({ activeTab }: AboutNavProps) {
    return <SubNav ariaLabel="About sections" activeKey={activeTab} items={aboutSubNavItems} />
}
