'use client'

import { useEffect, useState } from 'react'

import { UserProfileEditForm } from '@/components/profile/UserProfileEditForm'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import type { Country, Profile } from '@/lib/jutge_api_client'
import { fetchProfilePageData } from '@/services/queries/users'

export function UserProfileEdit() {
    const { client, loading: authLoading } = useJutgeAuth()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [countries, setCountries] = useState<Country[]>([])

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        void fetchProfilePageData(client).then((data) => {
            if (!cancelled) {
                setProfile(data.profile)
                setCountries(data.countries)
            }
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client])

    if (authLoading || !profile) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return <UserProfileEditForm profile={profile} countries={countries} />
}
