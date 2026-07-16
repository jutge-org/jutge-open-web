'use client'

import { NavigationGuardProvider } from 'next-navigation-guard'
import type { ReactNode } from 'react'

import { ColorTheme } from '@/components/ColorTheme'
import { InstructorGate } from '@/components/ClientGates'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'

export default function InstructorLayout({ children }: { children: ReactNode }) {
    return (
        <InstructorGate>
            <ColorTheme theme="instructor" />
            <NavigationGuardProvider>
                <InstructorPageShell breadcrumbs={[{ title: 'Instructor', url: '/instructor' }]}>
                    {children}
                </InstructorPageShell>
            </NavigationGuardProvider>
        </InstructorGate>
    )
}
