import { getAuthenticatedJutgeClient } from '@/lib/jutge-client-registry'
import { JutgeApiClient } from './jutge_api_client'

export function getUserUidFromClient(client: JutgeApiClient): string {
    const userUid = client.meta?.user_uid
    if (!userUid) {
        throw new Error('Jutge client meta is missing user_uid')
    }
    return userUid
}

export function jutgeClientFromToken(token: string, userUid?: string): JutgeApiClient {
    if (userUid) {
        return getAuthenticatedJutgeClient(token, userUid)
    }

    const client = new JutgeApiClient()
    client.meta = { token } as JutgeApiClient['meta']
    return client
}
