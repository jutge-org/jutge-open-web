import { cache } from 'react'

import { JutgeApiClient, type HomepageStats } from '@/lib/jutge_api_client'

export const fetchHomepageStats = cache(async (): Promise<HomepageStats | null> => {
    try {
        const client = new JutgeApiClient()
        return await client.misc.getHomepageStats()
    } catch {
        return null
    }
})
