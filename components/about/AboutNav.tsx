'use client'

import { ExternalLink } from '@/components/ExternalLink'
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
                                    <ExternalLink href={href}>
                                        {label}
                                    </ExternalLink>
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
