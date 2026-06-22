'use client'

import Link from 'next/link'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { profileNavItems, type ProfileTab } from '@/lib/profile'

type ProfileNavProps = {
    activeTab: ProfileTab
}

export function ProfileNav({ activeTab }: ProfileNavProps) {
    return (
        <nav aria-label="Profile sections" className="w-full">
            <Tabs value={activeTab}>
                <TabsList className="w-full min-w-max">
                    {profileNavItems.map(({ tab, label, href }) => (
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
