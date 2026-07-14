import { ProfilePageShell } from '@/components/profile/ProfilePageShell'
import { UserProfileView } from '@/components/profile/UserProfileView'
import { renderAuthed } from '@/lib/renderAuthed'

export const metadata = { title: 'Profile — Jutge.org' }

export default async function ProfilePage() {
    return renderAuthed((user) => (
        <ProfilePageShell activeTab="index">
            <UserProfileView user={user} />
        </ProfilePageShell>
    ))
}
