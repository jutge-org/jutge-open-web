import { ProfilePageClient } from '@/components/pages/ProfilePageClient'
import { UserProfileAvatar } from '@/components/profile/UserProfileAvatar'

export const metadata = { title: 'Avatar — Jutge.org' }

export default function ProfileAvatarPage() {
    return (
        <ProfilePageClient activeTab="avatar" subpage={{ title: 'Avatar', url: '/profile/avatar' }}>
            <UserProfileAvatar />
        </ProfilePageClient>
    )
}
