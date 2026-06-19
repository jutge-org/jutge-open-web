'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { InstructorSubNavItem } from '@/lib/instructor/menus'
import Link from 'next/link'

type InstructorSubNavProps = {
    items: InstructorSubNavItem[]
    baseHref: string
    activeSegment: string
}

export function InstructorSubNav({ items, baseHref, activeSegment }: InstructorSubNavProps) {
    return (
        <nav aria-label="Resource sections" className="w-full">
            <Tabs value={activeSegment}>
                <TabsList className="w-full min-w-max">
                    {items.map(({ key, label, segment }) => (
                        <TabsTrigger key={key} value={segment} asChild>
                            <Link
                                href={`${baseHref}/${segment}`}
                                aria-current={segment === activeSegment ? 'page' : undefined}
                            >
                                {label}
                            </Link>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </nav>
    )
}
