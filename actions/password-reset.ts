'use server'

export type PasswordResetResult = { ok: true } | { ok: false; error: string }

export async function requestPasswordResetAction(email: string): Promise<PasswordResetResult> {
    void email
    return { ok: false, error: 'Password reset is not available yet. Please try again later.' }
}
