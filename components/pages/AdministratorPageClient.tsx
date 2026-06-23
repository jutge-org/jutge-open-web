'use client'

import type { ReactNode } from 'react'

import { AdministratorGate } from '@/components/auth/AuthGates'

export function AdministratorPageClient({ children }: { children: ReactNode }) {
    return <AdministratorGate>{children}</AdministratorGate>
}
