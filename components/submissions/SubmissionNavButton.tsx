import Link from 'next/link'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type SubmissionNavButtonProps = {
    href: string | null
    label: string
    children: ReactNode
}

export function SubmissionNavButton({ href, label, children }: SubmissionNavButtonProps) {
    if (href) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon-sm" asChild>
                        <Link href={href} aria-label={label}>
                            {children}
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{label}</TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" size="icon-sm" disabled aria-label={label}>
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="top">{label}</TooltipContent>
        </Tooltip>
    )
}
