'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { documentationNavItems, type DocumentationTab } from '@/lib/documentation'
import Link from 'next/link'

type DocumentationNavProps = {
    activeTab: DocumentationTab
}

export function DocumentationNav({ activeTab }: DocumentationNavProps) {
    return (
        <nav aria-label="Documentation sections" className="w-full">
            <Tabs value={activeTab}>
                <TabsList className="w-full min-w-max">
                    {documentationNavItems.map(({ tab, label, href }) => (
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
