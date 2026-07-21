'use client'

import { useMemo } from 'react'

import { SubNav } from '@/components/general/SubNav'
import type { InstructorSubNavItem } from '@/lib/instructor/menus'
import type { SubNavItem } from '@/store/SubNav'

type InstructorSubNavProps = {
    items: InstructorSubNavItem[]
    baseHref: string
    activeSegment: string
}

/** Registers instructor resource section links in the sticky header sub-nav. */
export function InstructorSubNav({ items, baseHref, activeSegment }: InstructorSubNavProps) {
    const itemSignature = items.map(({ key, label, segment }) => `${key}:${label}:${segment}`).join('|')

    const subNavItems = useMemo((): readonly SubNavItem[] => {
        return items.map(({ key, label, segment }) => ({
            key,
            label,
            href: `${baseHref}/${segment}`,
        }))
        // itemSignature covers items content; baseHref is the only other input.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- items is recreated each render by callers
    }, [baseHref, itemSignature])

    return <SubNav ariaLabel="Resource sections" activeKey={activeSegment} items={subNavItems} />
}
