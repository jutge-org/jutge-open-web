'use client'

import { ExternalLink } from '@/components/ExternalLink'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { GITHUB_ISSUES_URL } from '@/lib/github'
import { CircleDotIcon } from 'lucide-react'

export function ReportIssueButton() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-4" asChild>
                        <ExternalLink href={GITHUB_ISSUES_URL} aria-label="Report an issue">
                            <CircleDotIcon className="size-4.5 text-muted-foreground" aria-hidden />
                        </ExternalLink>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Report an issue on GitHub</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
