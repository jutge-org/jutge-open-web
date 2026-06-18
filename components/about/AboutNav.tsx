'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { aboutNavItems, type AboutTab } from '@/lib/about'
import Link from 'next/link'

type AboutNavProps = {
    activeTab: AboutTab
}

export function AboutNav({ activeTab }: AboutNavProps) {
    return (
        <nav aria-label="About sections" className="w-full">
            <Tabs value={activeTab}>
                <TabsList className="w-full min-w-max">
                    {aboutNavItems.map(({ tab, label, href, external }) => {
                        if (external) {
                            return (
                                <TabsTrigger key={tab} value={tab} asChild>
                                    <a href={href} target="_blank" rel="noreferrer">
                                        {label}
                                    </a>
                                </TabsTrigger>
                            )
                        }

                        return (
                            <TabsTrigger key={tab} value={tab} asChild>
                                <Link href={href} aria-current={tab === activeTab ? 'page' : undefined}>
                                    {label}
                                </Link>
                            </TabsTrigger>
                        )
                    })}
                </TabsList>
            </Tabs>
        </nav>
    )
}
