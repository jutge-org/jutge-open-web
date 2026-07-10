'use client'

import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { getRecaptchaSiteKey } from '@/lib/recaptcha'

import { PasswordResetFormFields } from './PasswordResetFormFields'

function PasswordResetFormWithRecaptcha() {
    const { executeRecaptcha } = useGoogleReCaptcha()

    return <PasswordResetFormFields recaptchaConfigured executeRecaptcha={executeRecaptcha ?? undefined} />
}

export function PasswordResetForm() {
    const siteKey = getRecaptchaSiteKey()

    if (!siteKey) {
        return <PasswordResetFormFields recaptchaConfigured={false} />
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
            <PasswordResetFormWithRecaptcha />
        </GoogleReCaptchaProvider>
    )
}
