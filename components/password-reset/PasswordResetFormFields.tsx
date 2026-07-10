'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CircleAlertIcon, KeyRoundIcon } from 'lucide-react'

import { requestPasswordResetAction } from '@/actions/password-reset'
import { ProfileFormRow } from '@/components/profile/ProfileFormRow'
import { RecaptchaNotice } from '@/components/registration/RecaptchaNotice'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RECAPTCHA_PASSWORD_RESET_ACTION } from '@/lib/recaptcha'

type PasswordResetFormFieldsProps = {
    recaptchaConfigured: boolean
    executeRecaptcha?: (action?: string) => Promise<string>
}

export function PasswordResetFormFields({ recaptchaConfigured, executeRecaptcha }: PasswordResetFormFieldsProps) {
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    const canSubmit = email.trim().length > 0 && !pending

    async function handleSubmit() {
        setErrorMessage(null)

        if (!email.trim()) {
            setErrorMessage('Email is required.')
            return
        }

        if (!recaptchaConfigured) {
            setErrorMessage('Password reset is not available because reCAPTCHA is not configured.')
            return
        }

        setPending(true)
        try {
            if (!executeRecaptcha) {
                setErrorMessage('Security check is not ready yet. Please try again.')
                return
            }

            const token = await executeRecaptcha(RECAPTCHA_PASSWORD_RESET_ACTION)
            if (!token) {
                setErrorMessage('Security check failed. Please try again.')
                return
            }

            const result = await requestPasswordResetAction({
                email: email.trim(),
                recaptcha_token: token,
            })
            if (!result.ok) {
                setErrorMessage(result.error)
                return
            }
        } finally {
            setPending(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-3xl">
            <Alert className="mb-8 p-4">
                <CircleAlertIcon aria-hidden />
                <AlertTitle>Not available yet</AlertTitle>
                <AlertDescription>
                    Password reset is not implemented yet. You cannot recover your password through this form at this
                    time.
                </AlertDescription>
            </Alert>

            <Alert className="mb-8 p-4">
                <AlertDescription>
                    If you do not have an account yet,{' '}
                    <Link href="/registration" className="font-medium text-foreground">
                        register
                    </Link>
                    .
                </AlertDescription>
            </Alert>

            <section className="rounded-xl border border-border bg-card shadow-xs">
                <dl className="px-6">
                    <ProfileFormRow label="Email" htmlFor="password-reset-email">
                        <Input
                            id="password-reset-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Jutge.org email"
                            autoComplete="email"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && canSubmit) void handleSubmit()
                            }}
                        />
                    </ProfileFormRow>
                </dl>

                <div className="grid gap-4 border-t border-border px-6 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                    <div className="hidden sm:block" />
                    <div className="flex flex-col gap-3">
                        {errorMessage ? (
                            <p role="alert" className="text-sm text-destructive">
                                {errorMessage}
                            </p>
                        ) : null}
                        <Button
                            type="button"
                            onClick={() => void handleSubmit()}
                            disabled={!canSubmit}
                            className="w-full gap-2 sm:w-auto"
                        >
                            <KeyRoundIcon className="size-4" aria-hidden />
                            {pending ? 'Sending…' : 'Reset password'}
                        </Button>
                        <RecaptchaNotice configured={recaptchaConfigured} />
                    </div>
                </div>
            </section>
        </div>
    )
}
