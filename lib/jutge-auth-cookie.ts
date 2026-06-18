import type { CredentialsOut } from '@/lib/jutge_api_client'

/** HttpOnly cookie that stores the Jutge API access token after sign-in. */
export const JUTGE_AUTHTOKEN_COOKIE = 'jutge_authtoken'

/** HttpOnly cookie that stores the Jutge user id (`user_uid`) after sign-in. */
export const JUTGE_USER_UID_COOKIE = 'jutge_user_uid'

export const JUTGE_AUTH_COOKIE_FALLBACK_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

/**
 * Computes Max-Age (seconds) for the session cookie from Jutge credentials metadata.
 */
export function maxAgeSecondsFromCredentialsExpiration(expiration: CredentialsOut['expiration']): number {
    if (expiration === null || expiration === undefined) {
        return JUTGE_AUTH_COOKIE_FALLBACK_MAX_AGE_SECONDS
    }

    if (typeof expiration === 'number') {
        const asMs = expiration < 10_000_000_000 ? expiration * 1000 : expiration
        const secs = Math.floor((asMs - Date.now()) / 1000)
        return secs > 60 ? secs : JUTGE_AUTH_COOKIE_FALLBACK_MAX_AGE_SECONDS
    }

    if (typeof expiration === 'string') {
        const asNum = Number(expiration)
        if (!Number.isNaN(asNum) && asNum !== 0) {
            const unixMs = asNum < 10_000_000_000 ? asNum * 1000 : asNum
            const secs = Math.floor((unixMs - Date.now()) / 1000)
            if (secs > 60) return secs
        }
        const parsed = Date.parse(expiration)
        if (!Number.isNaN(parsed)) {
            const secs = Math.floor((parsed - Date.now()) / 1000)
            return secs > 60 ? secs : JUTGE_AUTH_COOKIE_FALLBACK_MAX_AGE_SECONDS
        }
    }

    return JUTGE_AUTH_COOKIE_FALLBACK_MAX_AGE_SECONDS
}
