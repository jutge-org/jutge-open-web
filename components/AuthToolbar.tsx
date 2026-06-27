'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { signOutAction } from '@/actions/auth'
import { SignInDialog } from '@/components/SignInDialog'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import {
    ActivityIcon,
    Award,
    CrownIcon,
    GraduationCapIcon,
    LogIn as SignIn,
    LogOut as SignOut,
    User,
} from 'lucide-react'
import { toast } from 'sonner'

type AuthToolbarProps = {
    authenticated: boolean
    instructor?: boolean
    administrator?: boolean
    userName?: string
}

export function AuthToolbar({ authenticated, instructor = false, administrator = false, userName }: AuthToolbarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [signOutPending, startSignOut] = useTransition()

    function handleSignOut() {
        startSignOut(async () => {
            await signOutAction()
            toast.success(userName ? `Bye ${userName}, you signed out` : 'Signed out')
            if (pathname === '/') {
                router.refresh()
            } else {
                router.push('/')
            }
        })
    }

    if (authenticated) {
        return (
            <DropdownMenu>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="outline" size="icon" aria-label="Account menu">
                                    {administrator ? (
                                        <CrownIcon className="size-4.5" aria-hidden />
                                    ) : instructor ? (
                                        <GraduationCapIcon className="size-4.5" aria-hidden />
                                    ) : (
                                        <User className="size-4.5" aria-hidden />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Account menu</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent
                    align="end"
                    className="min-w-48 **:data-[slot=dropdown-menu-item]:py-1.5 **:data-[slot=dropdown-menu-item]:text-base mr-4"
                >
                    {userName ? (
                        <>
                            <DropdownMenuLabel className="text-base font-bold text-foreground">
                                {userName}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                        </>
                    ) : null}
                    <DropdownMenuItem asChild>
                        <Link href="/activity">
                            <ActivityIcon aria-hidden />
                            Activity
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/awards">
                            <Award aria-hidden />
                            Awards
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <User aria-hidden />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled={signOutPending} onClick={handleSignOut}>
                        <SignOut aria-hidden />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <>
            <Button size="icon" type="button" aria-label="Sign in" onClick={() => setDialogOpen(true)}>
                <SignIn aria-hidden />
            </Button>

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
