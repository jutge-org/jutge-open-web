'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SignInDialog } from '@/components/SignInDialog'
import { cn } from '@/lib/utils'
import { LogIn } from 'lucide-react'

export function HomeLoginCard() {
    const router = useRouter()
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <>
            <div className="flex w-full justify-center">
                <div className="w-full max-w-md">
                    <button
                        type="button"
                        onClick={() => setDialogOpen(true)}
                        className={cn(
                            'group flex min-h-22 w-full items-center gap-5 rounded-2xl border border-border bg-card px-6 py-5 text-left shadow-sm transition-[box-shadow,border-color,background-color] duration-200 ease-out',
                            'hover:border-primary/25 hover:bg-accent/40 hover:shadow-lg',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        )}
                    >
                        <span
                            className={cn(
                                'flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted/80 transition-colors group-hover:bg-muted',
                                'border-l-4 border-l-sky-500 text-sky-600 dark:text-sky-400',
                            )}
                        >
                            <LogIn className="size-7 shrink-0 group-hover:animate-pulse" aria-hidden />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="text-lg font-semibold tracking-tight text-foreground">Sign in</span>
                            <span className="text-sm font-normal leading-snug text-muted-foreground group-hover:text-foreground/80">
                                Sign in with your Jutge.org account
                            </span>
                        </span>
                    </button>
                </div>
            </div>

            <SignInDialog open={dialogOpen} onOpenChange={setDialogOpen} onSignedIn={() => router.refresh()} />
        </>
    )
}
