import { getCurrentClient } from '@/lib/auth'
import { UserProfileAvatarForm } from '@/components/profile/UserProfileAvatarForm'
import { fetchProfilePageData } from '@/services/queries/users'

export async function UserProfileAvatar() {
    const client = await getCurrentClient()
    const { avatarDataUrl } = await fetchProfilePageData(client)

    return <UserProfileAvatarForm avatarDataUrl={avatarDataUrl} />
}
