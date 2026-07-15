'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/components/AuthProvider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogInIcon } from 'lucide-react'
import Link from 'next/link'

export type SignInDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSignedIn?: () => void
    /** Called when the dialog is closed without a successful sign-in. */
    onDismiss?: () => void
    /** Prefills the email field when the dialog opens. */
    initialEmail?: string
}

export function SignInDialog({ open, onOpenChange, onSignedIn, onDismiss, initialEmail }: SignInDialogProps) {
    const router = useRouter()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()
    const signedInRef = useRef(false)

    useEffect(() => {
        if (open && initialEmail) {
            setEmail(initialEmail)
        }
    }, [open, initialEmail])

    function resetForm() {
        setEmail('')
        setPassword('')
        setErrorMessage(null)
    }

    function handleOpenChange(next: boolean) {
        if (!next && !signedInRef.current) {
            onDismiss?.()
        }
        onOpenChange(next)
        if (!next) {
            signedInRef.current = false
            resetForm()
        }
    }

    function handleResetPassword() {
        handleOpenChange(false)
        router.push('/password-reset')
    }

    function handleSignIn() {
        setErrorMessage(null)
        startTransition(async () => {
            const result = await login({ email: email.trim(), password })
            if (!result.ok) {
                setErrorMessage(result.error)
                return
            }
            signedInRef.current = true
            toast.success(`Signed in as ${result.userName}`)
            resetForm()
            handleOpenChange(false)
            onSignedIn?.()
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-sm p-6">
                <DialogHeader>
                    <DialogTitle>Sign in</DialogTitle>
                    <DialogDescription className="">Sign in with your Jutge.org email and password.</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="jutge-auth-email">Email</Label>
                        <Input
                            id="jutge-auth-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={errorMessage ? true : undefined}
                            aria-describedby={errorMessage ? 'jutge-auth-error' : undefined}
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="jutge-auth-password" className="flex items-center gap-2">
                            Password
                            <div className="flex-1"></div>
                            <Link
                                href="/password-reset"
                                className="flex text-muted-foreground text-xs gap-2 items-center hover:underline"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleResetPassword()
                                }}
                            >
                                Forgotten password?
                            </Link>
                        </Label>
                        <Input
                            id="jutge-auth-password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSignIn()
                            }}
                            aria-invalid={errorMessage ? true : undefined}
                            aria-describedby={errorMessage ? 'jutge-auth-error' : undefined}
                        />
                    </div>
                    {errorMessage ? (
                        <p id="jutge-auth-error" role="alert" className="text-sm text-destructive">
                            {errorMessage}
                        </p>
                    ) : null}
                </div>

                <Button type="button" onClick={handleSignIn} disabled={pending} className="mt-2 w-full gap-2">
                    <LogInIcon className="size-4" />
                    {pending ? 'Signing in…' : 'Sign in'}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
