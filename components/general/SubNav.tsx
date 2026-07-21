'use client'

import { useSubNav, type SubNavConfig } from '@/store/SubNav'
import { useEffect, useId } from 'react'

/**
 * Registers sticky header sub-nav items for the current page (like MainBreadcrumbs).
 * Renders nothing; the bar is drawn by SubNavInLayout inside AppShell.
 * Pages without this component keep a single main nav bar only.
 */
export function SubNav({ items, activeKey, ariaLabel }: SubNavConfig) {
    const ownerId = useId()
    const setSubNav = useSubNav((s) => s.setSubNav)
    const clearSubNav = useSubNav((s) => s.clearSubNav)

    useEffect(() => {
        setSubNav(ownerId, { items, activeKey, ariaLabel })
    }, [ownerId, items, activeKey, ariaLabel, setSubNav])

    useEffect(() => {
        return () => clearSubNav(ownerId)
    }, [ownerId, clearSubNav])

    return null
}
