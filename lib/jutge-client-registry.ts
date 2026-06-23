import { JutgeApiClient } from '@/lib/jutge_api_client'

let anonymousClient: JutgeApiClient | null = null

const clientsByUserUid = new Map<string, JutgeApiClient>()

/** Shared client for public catalog data (problems, languages, tables, etc.). */
export function getAnonymousJutgeClient(): JutgeApiClient {
    if (!anonymousClient) {
        anonymousClient = new JutgeApiClient()
    }
    return anonymousClient
}

/** Reuse an authenticated client per user when the session token matches. */
export function getAuthenticatedJutgeClient(token: string, userUid: string): JutgeApiClient {
    const existing = clientsByUserUid.get(userUid)
    if (existing?.meta?.token === token) {
        return existing
    }

    const client = new JutgeApiClient()
    client.meta = { token, user_uid: userUid }
    clientsByUserUid.set(userUid, client)
    return client
}

/** Store a client after login so the first post-login request reuses it. */
export function registerAuthenticatedJutgeClient(client: JutgeApiClient): void {
    const userUid = client.meta?.user_uid
    const token = client.meta?.token
    if (!userUid || !token) {
        throw new Error('Cannot register Jutge client without token and user_uid in meta')
    }
    clientsByUserUid.set(userUid, client)
}

export function evictJutgeClient(userUid: string): void {
    clientsByUserUid.delete(userUid)
}
