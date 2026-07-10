import { redirect } from 'next/navigation'

import { RegistrationForm } from '@/components/registration/RegistrationForm'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { isAuthenticated } from '@/lib/auth'
import { fetchCountries } from '@/services/queries/tables'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Registration — Jutge.org' }

export default async function RegistrationPage() {
    if (await isAuthenticated()) {
        redirect('/')
    }

    const countries = await fetchCountries()

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
