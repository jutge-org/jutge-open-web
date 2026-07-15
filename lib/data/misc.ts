import jutge from '@/lib/jutge'
import { type HomepageStats } from '@/lib/jutge_api_client'

export async function fetchHomepageStats(): Promise<HomepageStats | null> {
    try {
        const client = jutge
        return await client.misc.getHomepageStats()
    } catch {
        return null
    }
}
