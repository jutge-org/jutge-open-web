'use client'

import { AuthedGate } from '@/components/ClientGates'
import { ProfilePageShell } from '@/components/profile/ProfilePageShell'
import { UserProfileView } from '@/components/profile/UserProfileView'

export default function ProfilePage() {
    return (
        <AuthedGate>
            {(user) => (
                <ProfilePageShell activeTab="index">
                    <UserProfileView user={user} />
                </ProfilePageShell>
            )}
        </AuthedGate>
    )
}
