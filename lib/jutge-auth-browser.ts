import {
    JUTGE_AUTH_COOKIE_FALLBACK_MAX_AGE_SECONDS,
    JUTGE_AUTHTOKEN_COOKIE,
    JUTGE_USER_UID_COOKIE,
    maxAgeSecondsFromCredentialsExpiration,
} from '@/lib/jutge-auth-cookie'
import type { CredentialsOut } from '@/lib/jutge_api_client'

export type BrowserAuthSession = {
    token: string
    userUid: string
}

function cookieBaseOptions(maxAge: number): string {
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
    return `; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

function readCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined
    const prefix = `${name}=`
    for (const part of document.cookie.split(';')) {
        const trimmed = part.trim()
        if (trimmed.startsWith(prefix)) {
            return decodeURIComponent(trimmed.slice(prefix.length))
        }
    }
    return undefined
}

export function readAuthFromCookies(): BrowserAuthSession | null {
    const token = readCookie(JUTGE_AUTHTOKEN_COOKIE)
    const userUid = readCookie(JUTGE_USER_UID_COOKIE)
    if (!token || !userUid) return null
    return { token, userUid }
}

export function hasAuthCookies(): boolean {
    return readAuthFromCookies() !== null
}

export function setAuthCookies(
    token: string,
    userUid: string,
    expiration?: CredentialsOut['expiration'],
): void {
    const maxAge = maxAgeSecondsFromCredentialsExpiration(expiration)
    const options = cookieBaseOptions(maxAge)
    document.cookie = `${JUTGE_AUTHTOKEN_COOKIE}=${encodeURIComponent(token)}${options}`
    document.cookie = `${JUTGE_USER_UID_COOKIE}=${encodeURIComponent(userUid)}${options}`
}

export function clearAuthCookies(): void {
    const options = cookieBaseOptions(0)
    document.cookie = `${JUTGE_AUTHTOKEN_COOKIE}=${options}`
    document.cookie = `${JUTGE_USER_UID_COOKIE}=${options}`
}

export { JUTGE_AUTH_COOKIE_FALLBACK_MAX_AGE_SECONDS, JUTGE_AUTHTOKEN_COOKIE, JUTGE_USER_UID_COOKIE }
