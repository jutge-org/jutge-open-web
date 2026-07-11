export type PasswordResetActionInput = {
    email: string
    recaptcha_token: string
}

export type PasswordResetResult = { ok: true } | { ok: false; error: string }

export async function requestPasswordResetAction(data: PasswordResetActionInput): Promise<PasswordResetResult> {
    const email = data.email.trim()
    const recaptchaToken = data.recaptcha_token.trim()

    if (!email) {
        return { ok: false, error: 'Email is required.' }
    }

    if (!recaptchaToken) {
        return { ok: false, error: 'Security check failed. Please try again.' }
    }

    void recaptchaToken
    return { ok: false, error: 'Password reset is not available yet. Please try again later.' }
}
