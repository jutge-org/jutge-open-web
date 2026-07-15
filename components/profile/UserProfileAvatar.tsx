'use client'

import { PageSpinner } from '@/components/ClientGates'
import { UserProfileAvatarForm } from '@/components/profile/UserProfileAvatarForm'
import jutge from '@/lib/jutge'
import { fetchProfilePageData } from '@/lib/data/users'
import { useEffect, useState } from 'react'

export function UserProfileAvatar() {
    const [avatarDataUrl, setAvatarDataUrl] = useState<string | null | undefined>(undefined)

    useEffect(() => {
        void fetchProfilePageData(jutge).then(({ avatarDataUrl: dataUrl }) => setAvatarDataUrl(dataUrl))
    }, [])

    if (avatarDataUrl === undefined) {
        return <PageSpinner />
    }

    return <UserProfileAvatarForm avatarDataUrl={avatarDataUrl} />
}
