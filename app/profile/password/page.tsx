import { ProfilePageShell } from '@/components/profile/ProfilePageShell'
import { UserProfilePasswordForm } from '@/components/profile/UserProfilePasswordForm'
import { renderAuthed } from '@/lib/renderAuthed'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Password — Jutge.org' }

export default async function ProfilePasswordPage() {
    return renderAuthed(() => (
        <ProfilePageShell activeTab="password" subpage={{ title: 'Password', url: '/profile/password' }}>
            <UserProfilePasswordForm />
        </ProfilePageShell>
    ))
}
