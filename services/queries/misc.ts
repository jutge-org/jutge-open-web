import { type HomepageStats, type JutgeApiClient } from '@/lib/jutge_api_client'

export async function fetchHomepageStats(client: JutgeApiClient): Promise<HomepageStats | null> {
    try {
        return await client.misc.getHomepageStats()
    } catch {
        return null
    }
}
