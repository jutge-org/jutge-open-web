'use client'

import { AuthedGate } from '@/components/ClientGates'
import { ProfilePageShell } from '@/components/profile/ProfilePageShell'
import { UserProfileEdit } from '@/components/profile/UserProfileEdit'

export default function ProfileUpdatePage() {
    return (
        <AuthedGate>
            <ProfilePageShell activeTab="update" subpage={{ title: 'Update', url: '/profile/update' }}>
                <UserProfileEdit />
            </ProfilePageShell>
        </AuthedGate>
    )
}
