'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/components/AuthProvider'
import { PageSpinner } from '@/components/ClientGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { RegistrationForm } from '@/components/registration/RegistrationForm'
import { fetchCountries } from '@/lib/data/tables'
import type { Country } from '@/lib/jutge_api_client'

export default function RegistrationPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [countries, setCountries] = useState<Country[] | null>(null)

    useEffect(() => {
        if (!loading && user) {
            router.replace('/')
        }
    }, [loading, user, router])

    useEffect(() => {
        if (loading || user) return
        void fetchCountries().then(setCountries)
    }, [loading, user])

    if (loading || user || !countries) {
        return <PageSpinner />
    }

    return (
        <div className="flex flex-col gap-6 pb-8">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Registration', url: '/registration' }]} />
            <PageTitle section="/registration" authenticated={false} hidden={false} />
            {countries.length === 0 ? (
                <p className="text-muted-foreground">Could not load registration form. Please try again later.</p>
            ) : (
                <RegistrationForm countries={countries} />
            )}
        </div>
    )
}
