'use client'

import { useEffect, useState } from 'react'

import { UserProfileAvatarForm } from '@/components/profile/UserProfileAvatarForm'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { fetchProfilePageData } from '@/services/queries/users'

export function UserProfileAvatar() {
    const { client, loading: authLoading } = useJutgeAuth()
    const [avatarDataUrl, setAvatarDataUrl] = useState<string | null | undefined>(undefined)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        void fetchProfilePageData(client).then((data) => {
            if (!cancelled) {
                setAvatarDataUrl(data.avatarDataUrl)
            }
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client])

    if (authLoading || avatarDataUrl === undefined) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return <UserProfileAvatarForm avatarDataUrl={avatarDataUrl} />
}
