import { ProfilePageShell } from '@/components/profile/ProfilePageShell'
import { UserProfileEdit } from '@/components/profile/UserProfileEdit'
import { renderAuthed } from '@/lib/renderAuthed'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Update profile — Jutge.org' }

export default async function ProfileUpdatePage() {
    return renderAuthed(() => (
        <ProfilePageShell activeTab="update" subpage={{ title: 'Update', url: '/profile/update' }}>
            <UserProfileEdit />
        </ProfilePageShell>
    ))
}
