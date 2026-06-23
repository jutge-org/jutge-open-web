import { ProfilePageClient } from '@/components/pages/ProfilePageClient'
import { UserProfileView } from '@/components/profile/UserProfileView'

export const metadata = { title: 'Profile — Jutge.org' }

export default function ProfilePage() {
    return (
        <ProfilePageClient activeTab="index">
            <UserProfileView />
        </ProfilePageClient>
    )
}
