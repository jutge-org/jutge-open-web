import { JutgeApiClient } from './jutge_api_client'

export function getUserUidFromClient(client: JutgeApiClient): string {
    const userUid = client.meta?.user_uid
    if (!userUid) {
        throw new Error('Jutge client meta is missing user_uid')
    }
    return userUid
}

export async function jutgeClientFromToken(token: string, userUid?: string) {
    const client = new JutgeApiClient()
    client.meta = userUid ? { token, user_uid: userUid } : ({ token } as JutgeApiClient['meta'])
    return client
}
