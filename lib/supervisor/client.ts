import jutge from '@/lib/jutge'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

export async function withSupervisorClient<T>(fn: (client: JutgeApiClient) => Promise<T>): Promise<T> {
    if (!jutge.meta?.token) {
        throw new Error('Forbidden')
    }
    const profile = await jutge.student.profile.get()
    if (!profile.instructor && !profile.tutor) {
        throw new Error('Forbidden')
    }
    return fn(jutge)
}
