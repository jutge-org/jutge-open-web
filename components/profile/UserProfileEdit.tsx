'use client'

import { PageSpinner } from '@/components/ClientGates'
import { UserProfileEditForm } from '@/components/profile/UserProfileEditForm'
import jutge from '@/lib/jutge'
import { fetchProfilePageData } from '@/lib/data/users'
import { useEffect, useState } from 'react'

type ProfileEditData = Pick<Awaited<ReturnType<typeof fetchProfilePageData>>, 'profile' | 'countries'>

export function UserProfileEdit() {
    const [data, setData] = useState<ProfileEditData | null>(null)

    useEffect(() => {
        void fetchProfilePageData(jutge).then(({ profile, countries }) => setData({ profile, countries }))
    }, [])

    if (!data) {
        return <PageSpinner />
    }

    return <UserProfileEditForm profile={data.profile} countries={data.countries} />
}
