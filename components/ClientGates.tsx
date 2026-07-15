'use client'

import { useAuth } from '@/components/AuthProvider'
import { AccessDeniedGate } from '@/components/AccessDeniedGate'
import { LoginGate } from '@/components/LoginGate'
import { canAccessSupervision, type SessionUser } from '@/lib/session'
import type { ReactNode } from 'react'

type GateProps = {
    children: ReactNode | ((user: SessionUser) => ReactNode)
}

export function AuthedGate({ children }: GateProps) {
    const { user, loading } = useAuth()
    if (loading) return null
    if (!user) return <LoginGate />
    return typeof children === 'function' ? children(user) : children
}

export function InstructorGate({ children }: GateProps) {
    const { user, loading } = useAuth()
    if (loading) return null
    if (!user) return <LoginGate />
    if (!user.instructor) return <AccessDeniedGate />
    return typeof children === 'function' ? children(user) : children
}

export function AdministratorGate({ children }: GateProps) {
    const { user, loading } = useAuth()
    if (loading) return null
    if (!user) return <LoginGate />
    if (!user.administrator) return <AccessDeniedGate />
    return typeof children === 'function' ? children(user) : children
}

export function SupervisorGate({ children }: GateProps) {
    const { user, loading } = useAuth()
    if (loading) return null
    if (!user) return <LoginGate />
    if (!canAccessSupervision(user)) return <AccessDeniedGate />
    return typeof children === 'function' ? children(user) : children
}

export function PageSpinner() {
    return <p className="py-16 text-center text-muted-foreground">Loading…</p>
}
