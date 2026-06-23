'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react'

import { clearAuthCookies, readAuthFromCookies, setAuthCookies } from '@/lib/jutge-auth-browser'
import {
    configureBrowserJutgeClient,
    getBrowserJutgeClient,
    resetBrowserJutgeClient,
} from '@/lib/jutge-browser'
import type { CoursesNavItem } from '@/lib/courses'
import { profileToSessionUser, type SessionUser } from '@/lib/session-user'
import type { JutgeApiClient } from '@/lib/jutge_api_client'
import { fetchEnrolledCoursesNavItems } from '@/services/queries/courses'

export type JutgeAuthContextValue = {
    user: SessionUser | null
    authenticated: boolean
    loading: boolean
    client: JutgeApiClient
    languageId: string | null
    enrolledCoursesNavItems: CoursesNavItem[]
    signIn: (email: string, password: string) => Promise<{ ok: true; userName: string } | { ok: false; error: string }>
    signOut: () => Promise<void>
    refreshSession: () => Promise<void>
}

const JutgeAuthContext = createContext<JutgeAuthContextValue | null>(null)

async function loadSessionFromCookies(): Promise<{
    user: SessionUser | null
    languageId: string | null
    enrolledCoursesNavItems: CoursesNavItem[]
}> {
    const auth = readAuthFromCookies()
    if (!auth) {
        configureBrowserJutgeClient(null, null)
        return { user: null, languageId: null, enrolledCoursesNavItems: [] }
    }

    configureBrowserJutgeClient(auth.token, auth.userUid)
    const client = getBrowserJutgeClient()

    try {
        const profile = await client.student.profile.get()
        const user = profileToSessionUser(profile)
        const enrolledCoursesNavItems = await fetchEnrolledCoursesNavItems(client)
        return { user, languageId: profile.language_id, enrolledCoursesNavItems }
    } catch {
        clearAuthCookies()
        configureBrowserJutgeClient(null, null)
        return { user: null, languageId: null, enrolledCoursesNavItems: [] }
    }
}

export function JutgeAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SessionUser | null>(null)
    const [languageId, setLanguageId] = useState<string | null>(null)
    const [enrolledCoursesNavItems, setEnrolledCoursesNavItems] = useState<CoursesNavItem[]>([])
    const [loading, setLoading] = useState(true)
    const [clientEpoch, setClientEpoch] = useState(0)
    const client = useMemo(() => getBrowserJutgeClient(), [clientEpoch])

    const applySession = useCallback(
        async (session: {
            user: SessionUser | null
            languageId: string | null
            enrolledCoursesNavItems: CoursesNavItem[]
        }) => {
            setUser(session.user)
            setLanguageId(session.languageId)
            setEnrolledCoursesNavItems(session.enrolledCoursesNavItems)
        },
        [],
    )

    const refreshSession = useCallback(async () => {
        const session = await loadSessionFromCookies()
        await applySession(session)
    }, [applySession])

    useEffect(() => {
        let cancelled = false

        async function init() {
            const session = await loadSessionFromCookies()
            if (!cancelled) {
                await applySession(session)
                setLoading(false)
            }
        }

        void init()

        return () => {
            cancelled = true
        }
    }, [applySession])

    const signIn = useCallback(
        async (email: string, password: string) => {
            const trimmed = email.trim()
            if (!trimmed || !password) {
                return { ok: false as const, error: 'Email and password are required.' }
            }

            try {
                const loginClient = getBrowserJutgeClient()
                const credentials = await loginClient.login({ email: trimmed, password })
                const profile = await loginClient.student.profile.get()
                setAuthCookies(credentials.token, profile.user_uid, credentials.expiration)

                const sessionUser = profileToSessionUser(profile)
                const navItems = await fetchEnrolledCoursesNavItems(loginClient)
                setUser(sessionUser)
                setLanguageId(profile.language_id)
                setEnrolledCoursesNavItems(navItems)

                return { ok: true as const, userName: profile.name }
            } catch (e) {
                configureBrowserJutgeClient(null, null)
                const message = e instanceof Error ? e.message : 'Sign in failed.'
                return { ok: false as const, error: message }
            }
        },
        [],
    )

    const signOut = useCallback(async () => {
        try {
            await client.auth.logout()
        } catch {
            /* token may already be invalid */
        }

        clearAuthCookies()
        resetBrowserJutgeClient()
        setClientEpoch((epoch) => epoch + 1)
        setUser(null)
        setLanguageId(null)
        setEnrolledCoursesNavItems([])
    }, [client])

    const value = useMemo<JutgeAuthContextValue>(
        () => ({
            user,
            authenticated: user !== null,
            loading,
            client,
            languageId,
            enrolledCoursesNavItems,
            signIn,
            signOut,
            refreshSession,
        }),
        [user, loading, client, languageId, enrolledCoursesNavItems, signIn, signOut, refreshSession],
    )

    return <JutgeAuthContext.Provider value={value}>{children}</JutgeAuthContext.Provider>
}

export function useJutgeAuthContext(): JutgeAuthContextValue {
    const context = useContext(JutgeAuthContext)
    if (!context) {
        throw new Error('useJutgeAuthContext must be used within JutgeAuthProvider')
    }
    return context
}
