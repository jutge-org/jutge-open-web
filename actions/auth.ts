'use server'

import { evictJutgeClient } from '@/lib/jutge-client-registry'
import { jutgeClientFromToken } from '@/lib/jutge-clients'
import { clearJutgeAuthCookie, getJutgeAuthSession, setJutgeAuthCookie } from '@/lib/jutge-auth-session'
import { loginUser } from '@/services/mutations/users'

export async function signInAction(
    email: string,
    password: string,
): Promise<{ ok: true; userName: string } | { ok: false; error: string }> {
    const trimmed = email.trim()
    if (!trimmed || !password) {
        return { ok: false, error: 'Email and password are required.' }
    }

    try {
        const { credentials, profile } = await loginUser(trimmed, password)
        await setJutgeAuthCookie(credentials.token, profile.user_uid, credentials.expiration)
        return { ok: true, userName: profile.name }
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Sign in failed.'
        return { ok: false, error: message }
    }
}

export async function signOutAction(): Promise<void> {
    const session = await getJutgeAuthSession()

    if (session?.token) {
        try {
            const client = jutgeClientFromToken(session.token, session.userUid)
            await client.auth.logout()
        } catch {
            /* token may already be invalid */
        }
    }

    if (session?.userUid) {
        evictJutgeClient(session.userUid)
    }

    await clearJutgeAuthCookie()
}
