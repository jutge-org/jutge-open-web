'use client'

import Link from 'next/link'
import { useState } from 'react'
import { KeyRoundIcon } from 'lucide-react'

import { requestPasswordResetAction } from '@/actions/password-reset'
import { ProfileFormRow } from '@/components/profile/ProfileFormRow'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function PasswordResetForm() {
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

        setPending(true)
        try {
            const result = await requestPasswordResetAction(email.trim())
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
                    </div>
                </div>
            </section>
        </div>
    )
}
