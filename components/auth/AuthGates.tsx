'use client'

import type { ReactNode } from 'react'

import { AccessDeniedGate } from '@/components/AccessDeniedGate'
import { LoginGate } from '@/components/LoginGate'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'

export function AuthedGate({ children }: { children: ReactNode }) {
    const { loading, authenticated } = useJutgeAuth()

    if (loading) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    if (!authenticated) {
        return <LoginGate />
    }

    return children
}

export function InstructorGate({ children }: { children: ReactNode }) {
    const { loading, authenticated, user } = useJutgeAuth()

    if (loading) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    if (!authenticated) {
        return <LoginGate />
    }

    if (!user?.instructor) {
        return <AccessDeniedGate />
    }

    return children
}

export function AdministratorGate({ children }: { children: ReactNode }) {
    const { loading, authenticated, user } = useJutgeAuth()

    if (loading) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    if (!authenticated) {
        return <LoginGate />
    }

    if (!user?.administrator) {
        return <AccessDeniedGate />
    }

    return children
}
