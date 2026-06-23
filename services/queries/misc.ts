import { cache } from 'react'

import { getAnonymousJutgeClient } from '@/lib/jutge-client-registry'
import { type HomepageStats } from '@/lib/jutge_api_client'

export const fetchHomepageStats = cache(async (): Promise<HomepageStats | null> => {
    try {
        const client = getAnonymousJutgeClient()
        return await client.misc.getHomepageStats()
    } catch {
        return null
    }
})
