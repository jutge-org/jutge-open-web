import { registerAuthenticatedJutgeClient } from '@/lib/jutge-client-registry'
import { JutgeApiClient, type NewPassword, type NewProfile } from '@/lib/jutge_api_client'

export async function loginUser(email: string, password: string) {
    const client = new JutgeApiClient()
    const trimmed = email.trim()
    const credentials = await client.login({ email: trimmed, password })
    const profile = await client.student.profile.get()
    registerAuthenticatedJutgeClient(client)
    return { credentials, profile }
}

export async function updateProfile(client: JutgeApiClient, data: NewProfile): Promise<void> {
    await client.student.profile.update(data)
}

export async function updateProfileAvatar(client: JutgeApiClient, file: File): Promise<void> {
    await client.student.profile.updateAvatar(file)
}

export async function updateProfilePassword(client: JutgeApiClient, data: NewPassword): Promise<void> {
    await client.student.profile.updatePassword(data)
}
