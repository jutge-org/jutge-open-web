import type { Profile } from '@/lib/jutge_api_client'

export type SessionUser = {
    id: string
    name: string
    email: string
    instructor: boolean
    administrator: boolean
}

export function profileToSessionUser(profile: Profile): SessionUser {
    return {
        id: profile.user_uid,
        name: profile.name,
        email: profile.email,
        instructor: profile.instructor !== 0,
        administrator: profile.administrator !== 0,
    }
}
