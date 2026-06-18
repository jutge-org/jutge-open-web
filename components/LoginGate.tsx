'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { SignInDialog } from '@/components/SignInDialog'

export function LoginGate() {
    const router = useRouter()
    const pathname = usePathname()
    const [open, setOpen] = useState(true)

    return (
        <>
            <p className="py-16 text-center text-muted-foreground">Sign in to view this page.</p>
            <SignInDialog
                open={open}
                onOpenChange={setOpen}
                onDismiss={() => {
                    toast.info('Sign in required to view this page')
                    router.push('/')
                }}
                onSignedIn={() => {
                    window.location.assign(pathname)
                }}
            />
        </>
    )
}
