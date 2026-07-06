'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { problemNavItems, problemTabFromPathname } from '@/lib/problemNav'

type ProblemNavProps = {
    pageKey: string
    showInstructorTabs: boolean
}

export function ProblemNav({ pageKey, showInstructorTabs }: ProblemNavProps) {
    const pathname = usePathname()
    const activeTab = problemTabFromPathname(pathname, pageKey)
    const items = problemNavItems(pageKey, showInstructorTabs)

    return (
        <nav aria-label="Problem sections" className="w-full">
            <Tabs value={activeTab}>
                <TabsList className="w-full min-w-max">
                    {items.map(({ tab, label, href }) => (
                        <TabsTrigger key={tab} value={tab} asChild>
                            <Link href={href} aria-current={tab === activeTab ? 'page' : undefined}>
                                {label}
                            </Link>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </nav>
    )
}
