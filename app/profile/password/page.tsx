import { ProfilePageClient } from '@/components/pages/ProfilePageClient'
import { UserProfilePasswordForm } from '@/components/profile/UserProfilePasswordForm'

export const metadata = { title: 'Password — Jutge.org' }

export default function ProfilePasswordPage() {
    return (
        <ProfilePageClient activeTab="password" subpage={{ title: 'Password', url: '/profile/password' }}>
            <UserProfilePasswordForm />
        </ProfilePageClient>
    )
}
