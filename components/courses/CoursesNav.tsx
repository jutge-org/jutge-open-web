'use client'

import { useMemo } from 'react'

import { SubNav } from '@/components/general/SubNav'
import { Badge } from '@/components/ui/badge'
import { coursesNavItems, type CoursesData, type CoursesTab } from '@/lib/courses'
import type { SubNavItem } from '@/store/SubNav'

type CoursesNavProps = {
    activeTab: CoursesTab
    counts: Pick<CoursesData, 'enrolled' | 'archived' | 'available'>
}

const countByTab: Record<CoursesTab, keyof Pick<CoursesData, 'enrolled' | 'archived' | 'available'>> = {
    enrolled: 'enrolled',
    archived: 'archived',
    available: 'available',
}

/** Registers course section links in the sticky header sub-nav. */
export function CoursesNav({ activeTab, counts }: CoursesNavProps) {
    const enrolledCount = counts.enrolled.length
    const archivedCount = counts.archived.length
    const availableCount = counts.available.length

    const items = useMemo((): readonly SubNavItem[] => {
        const lengths = {
            enrolled: enrolledCount,
            archived: archivedCount,
            available: availableCount,
        }

        return coursesNavItems.map(({ tab, label, href }) => {
            const count = lengths[countByTab[tab]]
            return {
                key: tab,
                label,
                href,
                badge:
                    count > 0 ? (
                        <Badge variant="secondary" className="px-1.5">
                            {count}
                        </Badge>
                    ) : undefined,
            }
        })
    }, [enrolledCount, archivedCount, availableCount])

    return <SubNav ariaLabel="Course sections" activeKey={activeTab} items={items} />
}
