'use client'

import type { ReactNode } from 'react'

import { AuthedGate } from '@/components/auth/AuthGates'
import { ProfilePageShell } from '@/components/profile/ProfilePageShell'
import type { ProfileTab } from '@/lib/profile'

type ProfilePageClientProps = {
    activeTab: ProfileTab
    subpage?: { title: string; url: string } | null
    children: ReactNode
}

export function ProfilePageClient({ activeTab, subpage, children }: ProfilePageClientProps) {
    return (
        <AuthedGate>
            <ProfilePageShell activeTab={activeTab} subpage={subpage}>
                {children}
            </ProfilePageShell>
        </AuthedGate>
    )
}
