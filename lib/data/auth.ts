import jutge from '@/lib/jutge'
import { profileToSessionUser, type SessionUser } from '@/lib/session'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

export async function tryGetCurrentUser(): Promise<SessionUser | null> {
    if (!jutge.meta?.token) return null
    try {
        const profile = await jutge.student.profile.get()
        return profileToSessionUser(profile)
    } catch {
        return null
    }
}

export async function getCurrentClient(): Promise<JutgeApiClient> {
    if (!jutge.meta?.token) {
        throw new Error('Not authenticated')
    }
    return jutge
}

export async function getProblemsApiClient(): Promise<JutgeApiClient> {
    return jutge
}

export async function getPreferredLanguageId(): Promise<string | null> {
    if (!jutge.meta?.token) return null
    try {
        const profile = await jutge.student.profile.get()
        return profile.language_id
    } catch {
        return null
    }
}

export function isAuthenticated(): boolean {
    return jutge.meta?.token !== undefined
}
