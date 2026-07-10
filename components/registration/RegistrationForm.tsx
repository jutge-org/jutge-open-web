'use client'

import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { getRecaptchaSiteKey } from '@/lib/recaptcha'
import type { Country } from '@/lib/jutge_api_client'

import { RegistrationFormFields } from './RegistrationFormFields'

type RegistrationFormProps = {
    countries: Country[]
}

function RegistrationFormWithRecaptcha({ countries }: RegistrationFormProps) {
    const { executeRecaptcha } = useGoogleReCaptcha()

    return (
        <RegistrationFormFields
            countries={countries}
            recaptchaConfigured
            executeRecaptcha={executeRecaptcha ?? undefined}
        />
    )
}

export function RegistrationForm({ countries }: RegistrationFormProps) {
    const siteKey = getRecaptchaSiteKey()

    if (!siteKey) {
        return <RegistrationFormFields countries={countries} recaptchaConfigured={false} />
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
            <RegistrationFormWithRecaptcha countries={countries} />
        </GoogleReCaptchaProvider>
    )
}
