import { cookies } from 'next/headers'

import {
    JUTGE_AUTHTOKEN_COOKIE,
    JUTGE_USER_UID_COOKIE,
    maxAgeSecondsFromCredentialsExpiration,
} from '@/lib/jutge-auth-cookie'

export type JutgeAuthSession = {
    token: string
    userUid: string | undefined
}

const cookieOptions = (maxAge: number) =>
    ({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge,
    }) as const

export async function getJutgeAuthSession(): Promise<JutgeAuthSession | null> {
    const jar = await cookies()
    const token = jar.get(JUTGE_AUTHTOKEN_COOKIE)?.value
    if (!token) return null
    const userUid = jar.get(JUTGE_USER_UID_COOKIE)?.value
    return { token, userUid }
}

export async function getJutgeAuthToken(): Promise<string | undefined> {
    const session = await getJutgeAuthSession()
    return session?.token
}

export async function setJutgeAuthCookie(
    token: string,
    userUid: string,
    expiration: Parameters<typeof maxAgeSecondsFromCredentialsExpiration>[0],
) {
    const jar = await cookies()
    const maxAge = maxAgeSecondsFromCredentialsExpiration(expiration)
    const options = cookieOptions(maxAge)
    jar.set(JUTGE_AUTHTOKEN_COOKIE, token, options)
    jar.set(JUTGE_USER_UID_COOKIE, userUid, options)
}

export async function clearJutgeAuthCookie() {
    const jar = await cookies()
    const cleared = cookieOptions(0)
    jar.set(JUTGE_AUTHTOKEN_COOKIE, '', cleared)
    jar.set(JUTGE_USER_UID_COOKIE, '', cleared)
}
