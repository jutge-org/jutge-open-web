import type { ReactNode } from 'react'

import { AccessDeniedGate } from '@/components/AccessDeniedGate'
import { LoginGate } from '@/components/LoginGate'
import { tryGetCurrentUser, type SessionUser } from '@/lib/auth'

export async function renderAuthed(
    render: (user: SessionUser) => ReactNode | Promise<ReactNode>,
): Promise<ReactNode> {
    const user = await tryGetCurrentUser()
    if (!user) return <LoginGate />
    return render(user)
}

export async function renderInstructor(
    render: (user: SessionUser) => ReactNode | Promise<ReactNode>,
): Promise<ReactNode> {
    const user = await tryGetCurrentUser()
    if (!user) return <LoginGate />
    if (!user.instructor) return <AccessDeniedGate />
    return render(user)
}

export async function renderAdministrator(
    render: (user: SessionUser) => ReactNode | Promise<ReactNode>,
): Promise<ReactNode> {
    const user = await tryGetCurrentUser()
    if (!user) return <LoginGate />
    if (!user.administrator) return <AccessDeniedGate />
    return render(user)
}
