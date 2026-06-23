import { JutgeApiClient } from '@/lib/jutge_api_client'

const DEFAULT_JUTGE_API_URL = 'https://api.jutge.org/api'

export function getJutgeApiUrl(): string {
    return process.env.NEXT_PUBLIC_JUTGE_API_URL ?? DEFAULT_JUTGE_API_URL
}

export function createBrowserJutgeClient(): JutgeApiClient {
    const client = new JutgeApiClient()
    client.JUTGE_API_URL = getJutgeApiUrl()
    return client
}

let browserClient: JutgeApiClient | null = null

export function getBrowserJutgeClient(): JutgeApiClient {
    if (!browserClient) {
        browserClient = createBrowserJutgeClient()
    }
    return browserClient
}

export function configureBrowserJutgeClient(token: string | null, userUid: string | null): JutgeApiClient {
    const client = getBrowserJutgeClient()
    if (token && userUid) {
        client.meta = { token, user_uid: userUid }
    } else {
        client.meta = null
    }
    return client
}

export function resetBrowserJutgeClient(): JutgeApiClient {
    browserClient = createBrowserJutgeClient()
    return browserClient
}
