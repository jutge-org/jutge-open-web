import { redirect } from 'next/navigation'

import { PasswordResetForm } from '@/components/password-reset/PasswordResetForm'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Password reset — Jutge.org' }

export default async function PasswordResetPage() {
    if (await isAuthenticated()) {
        redirect('/')
    }

    return (
        <div className="flex flex-col gap-6 pb-8">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Password reset', url: '/password-reset' }]} />
            <PageTitle section="/password-reset" authenticated={false} hidden={false} />
            <PasswordResetForm />
        </div>
    )
}
