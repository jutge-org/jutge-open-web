'use server'

import { getCurrentClient } from '@/lib/auth'
import type { NewPassword, NewProfile } from '@/lib/jutge_api_client'
import { updateProfile, updateProfileAvatar, updateProfilePassword } from '@/services/mutations/users'

type ProfileActionResult = { ok: true } | { ok: false; error: string }

export async function updateProfileAction(data: NewProfile): Promise<ProfileActionResult> {
    const name = data.name.trim()
    if (!name) {
        return { ok: false, error: 'Name is required.' }
    }

    if (!data.country_id.trim()) {
        return { ok: false, error: 'Country is required.' }
    }

    if (!data.timezone_id.trim()) {
        return { ok: false, error: 'Timezone is required.' }
    }

    try {
        const client = await getCurrentClient()
        await updateProfile(client, {
            name,
            nickname: data.nickname.trim(),
            affiliation: data.affiliation.trim(),
            description: data.description.trim(),
            webpage: data.webpage.trim(),
            birth_year: data.birth_year,
            country_id: data.country_id.trim(),
            timezone_id: data.timezone_id.trim(),
        })
        return { ok: true }
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to update profile.'
        return { ok: false, error: message }
    }
}

export async function updateProfileAvatarAction(file: File): Promise<ProfileActionResult> {
    if (!file || file.size === 0) {
        return { ok: false, error: 'Avatar file is required.' }
    }

    if (file.type !== 'image/png') {
        return { ok: false, error: 'Avatar must be a PNG image.' }
    }

    try {
        const client = await getCurrentClient()
        await updateProfileAvatar(client, file)
        return { ok: true }
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to update avatar.'
        return { ok: false, error: message }
    }
}

export async function updateProfilePasswordAction(data: NewPassword): Promise<ProfileActionResult> {
    if (!data.oldPassword) {
        return { ok: false, error: 'Current password is required.' }
    }

    if (!data.newPassword) {
        return { ok: false, error: 'New password is required.' }
    }

    try {
        const client = await getCurrentClient()
        await updateProfilePassword(client, {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
        })
        return { ok: true }
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to update password.'
        return { ok: false, error: message }
    }
}
