import { type JutgeApiClient } from '@/lib/jutge_api_client'

/** Data URL suitable for `<img src={...} />`, or `null` when the user has no avatar or fetch fails. */
export async function fetchStudentAvatarDataUrl(client: JutgeApiClient): Promise<string | null> {
    try {
        const avatar = await client.student.profile.getAvatar()
        if (avatar.data.length === 0) return null
        const b64 = Buffer.from(avatar.data).toString('base64')
        const mime = avatar.type || 'image/png'
        return `data:${mime};base64,${b64}`
    } catch {
        return null
    }
}
