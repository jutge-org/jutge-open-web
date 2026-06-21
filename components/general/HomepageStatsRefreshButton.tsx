'use client'

import { RefreshCwIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function HomepageStatsRefreshButton() {
    const router = useRouter()
    const [isRefreshing, startTransition] = useTransition()

    function handleRefresh() {
        startTransition(() => {
            router.refresh()
        })
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        aria-label="Refresh statistics"
                    >
                        <RefreshCwIcon className={cn('size-3.5', isRefreshing && 'animate-spin')} aria-hidden />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-56">
                    Refresh values.
                    <br />
                    These values are updated periodically and approximated.
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
