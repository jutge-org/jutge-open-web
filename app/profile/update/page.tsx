import { ProfilePageClient } from '@/components/pages/ProfilePageClient'
import { UserProfileEdit } from '@/components/profile/UserProfileEdit'

export const metadata = { title: 'Update profile — Jutge.org' }

export default function ProfileUpdatePage() {
    return (
        <ProfilePageClient activeTab="update" subpage={{ title: 'Update', url: '/profile/update' }}>
            <UserProfileEdit />
        </ProfilePageClient>
    )
}
