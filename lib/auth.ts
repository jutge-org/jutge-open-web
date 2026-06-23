import { redirect } from 'next/navigation'
import { cache } from 'react'

import { getJutgeAuthSession } from '@/lib/jutge-auth-session'
import { getAnonymousJutgeClient, getAuthenticatedJutgeClient } from '@/lib/jutge-client-registry'
import { JutgeApiClient, type Profile } from '@/lib/jutge_api_client'

export type SessionUser = {
    id: string
    name: string
    email: string
    instructor: boolean
    administrator: boolean
}

function profileToSessionUser(profile: Profile): SessionUser {
    return {
        id: profile.user_uid,
        name: profile.name,
        email: profile.email,
        instructor: profile.instructor !== 0,
        administrator: profile.administrator !== 0,
    }
}

const resolveJutgeSessionFromCookie = cache(
    async (): Promise<{ user: SessionUser; client: JutgeApiClient; languageId: string | null } | null> => {
        const session = await getJutgeAuthSession()
        if (!session?.token || !session.userUid) return null

        const client = getAuthenticatedJutgeClient(session.token, session.userUid)
        try {
            const profile = await client.student.profile.get()
            return { user: profileToSessionUser(profile), client, languageId: profile.language_id }
        } catch {
            return null
        }
    },
)

/** Whether the current user has auth cookies (token and user id). Memoized per request via `cache`. */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getJutgeAuthSession()
    return session?.token !== undefined && session.userUid !== undefined
}

/** Session user when the auth cookies are valid; `null` if missing or session resolution fails. */
export async function tryGetCurrentUser(): Promise<SessionUser | null> {
    const session = await resolveJutgeSessionFromCookie()
    return session?.user ?? null
}

/** Session user or redirect to home when not authenticated. */
export async function getCurrentUser(): Promise<SessionUser> {
    const session = await resolveJutgeSessionFromCookie()
    if (!session) redirect('/')
    return session.user
}

/** Session user with instructor role, or redirect to home. */
export async function requireInstructor(): Promise<SessionUser> {
    const user = await getCurrentUser()
    if (!user.instructor) redirect('/')
    return user
}

/** Session user with administrator role, or redirect to home. */
export async function requireAdministrator(): Promise<SessionUser> {
    const user = await getCurrentUser()
    if (!user.administrator) redirect('/')
    return user
}

export async function getCurrentClient(): Promise<JutgeApiClient> {
    const session = await resolveJutgeSessionFromCookie()
    if (!session) {
        throw new Error('Not authenticated')
    }
    return session.client
}

/** Jutge API client for problem endpoints; authenticated when the session is valid. */
export async function getProblemsApiClient(): Promise<JutgeApiClient> {
    const session = await resolveJutgeSessionFromCookie()
    return session?.client ?? getAnonymousJutgeClient()
}

/** Profile language for problems; `null` when not authenticated or unavailable. */
export async function getPreferredLanguageId(): Promise<string | null> {
    const session = await resolveJutgeSessionFromCookie()
    return session?.languageId ?? null
}
