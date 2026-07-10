import { canAccessSupervision, getCurrentClient, tryGetCurrentUser } from '@/lib/auth'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

export async function withSupervisorClient<T>(fn: (client: JutgeApiClient) => Promise<T>): Promise<T> {
    const user = await tryGetCurrentUser()
    if (!user || !canAccessSupervision(user)) {
        throw new Error('Forbidden')
    }
    return fn(await getCurrentClient())
}
