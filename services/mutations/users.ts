import { JutgeApiClient } from '@/lib/jutge_api_client'

export async function loginUser(email: string, password: string) {
    const client = new JutgeApiClient()
    const trimmed = email.trim()
    const credentials = await client.login({ email: trimmed, password })
    const profile = await client.student.profile.get()
    return { credentials, profile }
}
