import type { Profile } from '@/lib/jutge_api_client'

export type SessionUser = {
    id: string
    name: string
    nickname: string | null
    email: string
    instructor: boolean
    administrator: boolean
    tutor: boolean
}

export function canAccessSupervision(user: Pick<SessionUser, 'instructor' | 'tutor'>): boolean {
    return user.instructor || user.tutor
}

export function profileToSessionUser(profile: Profile): SessionUser {
    return {
        id: profile.user_uid,
        name: profile.name,
        nickname: profile.nickname,
        email: profile.email,
        instructor: profile.instructor !== 0,
        administrator: profile.administrator !== 0,
        tutor: profile.tutor !== 0,
    }
}

export function isAuthenticatedClient(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('token') !== null && localStorage.getItem('expiration') !== null
}
