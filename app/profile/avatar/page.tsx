import { ProfilePageShell } from '@/components/profile/ProfilePageShell'
import { UserProfileAvatar } from '@/components/profile/UserProfileAvatar'
import { renderAuthed } from '@/lib/renderAuthed'

export const metadata = { title: 'Avatar — Jutge.org' }

export default async function ProfileAvatarPage() {
    return renderAuthed(() => (
        <ProfilePageShell activeTab="avatar" subpage={{ title: 'Avatar', url: '/profile/avatar' }}>
            <UserProfileAvatar />
        </ProfilePageShell>
    ))
}
