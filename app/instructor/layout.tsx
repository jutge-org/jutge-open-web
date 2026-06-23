'use client'

import { NavigationGuardProvider } from 'next-navigation-guard'
import type { ReactNode } from 'react'

import { InstructorGate } from '@/components/auth/AuthGates'

export default function InstructorLayout({ children }: { children: ReactNode }) {
    return (
        <InstructorGate>
            <NavigationGuardProvider>{children}</NavigationGuardProvider>
        </InstructorGate>
    )
}
