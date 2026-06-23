import { JutgeApiClient, type NewPassword, type NewProfile } from '@/lib/jutge_api_client'

export async function updateProfile(client: JutgeApiClient, data: NewProfile): Promise<void> {
    await client.student.profile.update(data)
}

export async function updateProfileAvatar(client: JutgeApiClient, file: File): Promise<void> {
    await client.student.profile.updateAvatar(file)
}

export async function updateProfilePassword(client: JutgeApiClient, data: NewPassword): Promise<void> {
    await client.student.profile.updatePassword(data)
}
