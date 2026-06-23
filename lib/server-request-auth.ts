import { cookies } from 'next/headers'

import {
    JUTGE_AUTHTOKEN_COOKIE,
    JUTGE_USER_UID_COOKIE,
} from '@/lib/jutge-auth-cookie'
import { createBrowserJutgeClient } from '@/lib/jutge-browser'
import { profileToSessionUser, type SessionUser } from '@/lib/session-user'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

function parseCookieHeader(cookieHeader: string | null): Record<string, string> {
    if (!cookieHeader) return {}
    const parsed: Record<string, string> = {}
    for (const part of cookieHeader.split(';')) {
        const trimmed = part.trim()
        const eq = trimmed.indexOf('=')
        if (eq === -1) continue
        const name = trimmed.slice(0, eq)
        const value = trimmed.slice(eq + 1)
        parsed[name] = decodeURIComponent(value)
    }
    return parsed
}

export function getAuthFromRequest(request: Request): { token: string; userUid: string } | null {
    const parsed = parseCookieHeader(request.headers.get('cookie'))
    const token = parsed[JUTGE_AUTHTOKEN_COOKIE]
    const userUid = parsed[JUTGE_USER_UID_COOKIE]
    if (!token || !userUid) return null
    return { token, userUid }
}

export function createServerJutgeClient(token: string, userUid: string): JutgeApiClient {
    const client = createBrowserJutgeClient()
    client.meta = { token, user_uid: userUid }
    return client
}

export function getClientFromRequestCookies(request: Request): JutgeApiClient | null {
    const auth = getAuthFromRequest(request)
    if (!auth) return null
    return createServerJutgeClient(auth.token, auth.userUid)
}

export async function tryGetUserFromRequest(request: Request): Promise<SessionUser | null> {
    const client = getClientFromRequestCookies(request)
    if (!client) return null
    try {
        const profile = await client.student.profile.get()
        return profileToSessionUser(profile)
    } catch {
        return null
    }
}

/** Server Components / generateMetadata: read auth cookies via next/headers. */
export async function getServerJutgeClient(): Promise<JutgeApiClient | null> {
    const jar = await cookies()
    const token = jar.get(JUTGE_AUTHTOKEN_COOKIE)?.value
    const userUid = jar.get(JUTGE_USER_UID_COOKIE)?.value
    if (!token || !userUid) return null
    return createServerJutgeClient(token, userUid)
}

export async function getAnonymousServerJutgeClient(): Promise<JutgeApiClient> {
    return createBrowserJutgeClient()
}
