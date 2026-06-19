'use client'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { coursesNavItems, type CoursesData, type CoursesTab } from '@/lib/courses'

type CoursesNavProps = {
    activeTab: CoursesTab
    counts: Pick<CoursesData, 'enrolled' | 'archived' | 'available'>
}

const countByTab: Record<CoursesTab, keyof Pick<CoursesData, 'enrolled' | 'archived' | 'available'>> = {
    enrolled: 'enrolled',
    archived: 'archived',
    available: 'available',
}

export function CoursesNav({ activeTab, counts }: CoursesNavProps) {
    return (
        <nav aria-label="Course sections" className="w-full">
            <Tabs value={activeTab}>
                <TabsList className="w-full min-w-max">
                    {coursesNavItems.map(({ tab, label, href }) => {
                        const count = counts[countByTab[tab]].length

                        return (
                            <TabsTrigger key={tab} value={tab} asChild>
                                <Link href={href} aria-current={tab === activeTab ? 'page' : undefined}>
                                    {label}
                                    {count > 0 ? (
                                        <Badge variant="secondary" className="ml-1.5 px-1.5">
                                            {count}
                                        </Badge>
                                    ) : null}
                                </Link>
                            </TabsTrigger>
                        )
                    })}
                </TabsList>
            </Tabs>
        </nav>
    )
}
