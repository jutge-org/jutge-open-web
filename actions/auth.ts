'use server'

import { jutgeClientFromToken } from '@/lib/jutge-clients'
import { clearJutgeAuthCookie, getJutgeAuthToken, setJutgeAuthCookie } from '@/lib/jutge-auth-session'
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
    const token = await getJutgeAuthToken()

    if (token) {
        try {
            const client = await jutgeClientFromToken(token)
            await client.auth.logout()
        } catch {
            /* token may already be invalid */
        }
    }

    await clearJutgeAuthCookie()
}
