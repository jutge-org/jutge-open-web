import { getCurrentClient, tryGetCurrentUser } from '@/lib/auth'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

export async function withInstructorClient<T>(fn: (client: JutgeApiClient) => Promise<T>): Promise<T> {
    const user = await tryGetCurrentUser()
    if (!user?.instructor) {
        throw new Error('Forbidden')
    }
    return fn(await getCurrentClient())
}
