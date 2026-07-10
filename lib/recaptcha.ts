export const RECAPTCHA_REGISTRATION_ACTION = 'registration'

export function getRecaptchaSiteKey(): string | null {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim()
    return siteKey || null
}
