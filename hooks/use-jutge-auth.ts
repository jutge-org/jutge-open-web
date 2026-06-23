'use client'

import { useJutgeAuthContext } from '@/providers/JutgeAuthProvider'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

export function useJutgeAuth() {
    return useJutgeAuthContext()
}

export function useRequireAuth() {
    return useJutgeAuth()
}

export function useInstructorClient(): JutgeApiClient {
    const { client, user } = useJutgeAuth()
    if (!user?.instructor) {
        throw new Error('Forbidden')
    }
    return client
}

export function useAdminClient(): JutgeApiClient {
    const { client, user } = useJutgeAuth()
    if (!user?.administrator) {
        throw new Error('Forbidden')
    }
    return client
}
