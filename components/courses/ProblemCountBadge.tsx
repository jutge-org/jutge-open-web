'use client'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

/** Shared so the course strips and the lists inside a course always look the same. */
export type ProblemCountTone = 'ok' | 'scored' | 'ko' | 'total'

const toneClassName: Record<ProblemCountTone, string> = {
    ok: 'bg-emerald-600 text-white hover:bg-emerald-600',
    scored: 'bg-orange-400 text-white hover:bg-orange-400',
    ko: 'bg-red-500 text-white hover:bg-red-500',
    // The default badge, same dark pill the lists inside a course use for their total.
    total: '',
}

type ProblemCountBadgeProps = {
    tone: ProblemCountTone
    count: number
    /** When given, the badge explains itself on hover and to screen readers. */
    label?: string
    className?: string
}

export function ProblemCountBadge({ tone, count, label, className }: ProblemCountBadgeProps) {
    const badge = (
        <Badge className={cn('min-w-6 tabular-nums', toneClassName[tone], className)}>
            {count}
            {label ? <span className="sr-only">{label}</span> : null}
        </Badge>
    )

    if (!label) {
        return badge
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{badge}</TooltipTrigger>
            <TooltipContent side="top">{label}</TooltipContent>
        </Tooltip>
    )
}
