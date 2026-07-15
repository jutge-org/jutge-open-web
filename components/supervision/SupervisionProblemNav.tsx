'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    supervisionProblemNavItems,
    supervisionProblemTabFromPathname,
    type SupervisionContext,
} from '@/lib/supervision'

type SupervisionProblemNavProps = {
    pageKey: string
    context: SupervisionContext
}

export function SupervisionProblemNav({ pageKey, context }: SupervisionProblemNavProps) {
    const pathname = usePathname()
    const activeTab = supervisionProblemTabFromPathname(pathname, pageKey, context)
    const items = supervisionProblemNavItems(context, pageKey)

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
