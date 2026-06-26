'use client'

import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'

import { signInAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogInIcon } from 'lucide-react'

export type SignInDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSignedIn?: () => void
    /** Called when the dialog is closed without a successful sign-in. */
    onDismiss?: () => void
}

export function SignInDialog({ open, onOpenChange, onSignedIn, onDismiss }: SignInDialogProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()
    const signedInRef = useRef(false)

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

    function handleSignIn() {
        setErrorMessage(null)
        startTransition(async () => {
            const result = await signInAction(email, password)
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

                <div className="flex flex-col gap-3">
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
                        <Label htmlFor="jutge-auth-password">Password</Label>
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
