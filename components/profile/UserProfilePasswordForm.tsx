'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { updateProfilePasswordAction } from '@/lib/data/profileActions'
import { ProfileFormRow } from '@/components/profile/ProfileFormRow'
import { ProfileFormShell } from '@/components/profile/ProfileFormShell'
import { Input } from '@/components/ui/input'

export function UserProfilePasswordForm() {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()

    const canSave =
        oldPassword.length > 0 &&
        newPassword.length > 0 &&
        confirmPassword.length > 0 &&
        newPassword === confirmPassword

    function handleSave() {
        setErrorMessage(null)

        if (!oldPassword || !newPassword) {
            setErrorMessage('Current and new password are required.')
            return
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('New passwords do not match.')
            return
        }

        startTransition(async () => {
            const result = await updateProfilePasswordAction({
                oldPassword,
                newPassword,
            })

            if (!result.ok) {
                setErrorMessage(result.error)
                return
            }

            toast.success('Password updated.')
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
        })
    }

    return (
        <ProfileFormShell
            errorMessage={errorMessage}
            onSave={handleSave}
            pending={pending}
            saveDisabled={!canSave}
            saveLabel="Update password"
            pendingLabel="Updating password…"
        >
            <ProfileFormRow label="Current password" htmlFor="profile-old-password">
                <Input
                    id="profile-old-password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    autoComplete="current-password"
                />
            </ProfileFormRow>

            <ProfileFormRow label="New password" htmlFor="profile-new-password">
                <Input
                    id="profile-new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                />
            </ProfileFormRow>

            <ProfileFormRow label="Confirm new password" htmlFor="profile-confirm-password">
                <Input
                    id="profile-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && canSave) handleSave()
                    }}
                />
            </ProfileFormRow>
        </ProfileFormShell>
    )
}
