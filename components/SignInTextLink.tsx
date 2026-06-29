'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { SignInDialog } from '@/components/SignInDialog'
import { cn } from '@/lib/utils'

type SignInTextLinkProps = {
    className?: string
}

export function SignInTextLink({ className }: SignInTextLinkProps) {
    const pathname = usePathname()
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className={cn('text-primary underline-offset-4 hover:underline', className)}
            >
                Sign in
            </button>
            <SignInDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSignedIn={() => {
                    window.location.assign(pathname)
                }}
            />
        </>
    )
}
