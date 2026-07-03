'use client'

import { Gamepad2Icon, ImageIcon, ListChecksIcon, PuzzleIcon, type LucideIcon } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const problemTypeIcons: Record<string, LucideIcon> = {
    game: Gamepad2Icon,
    graphic: ImageIcon,
    quiz: ListChecksIcon,
    std: PuzzleIcon,
}

export function getProblemTypeIcon(type: string): LucideIcon {
    return problemTypeIcons[type] ?? PuzzleIcon
}

type ProblemTypeIconProps = {
    type: string
    className?: string
    showTooltip?: boolean
}

export function ProblemTypeIcon({ type, className, showTooltip = true }: ProblemTypeIconProps) {
    const Icon = getProblemTypeIcon(type)
    const icon = <Icon className={cn('size-4 shrink-0', className)} aria-hidden />

    if (!showTooltip) {
        return icon
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex cursor-default">{icon}</span>
            </TooltipTrigger>
            <TooltipContent side="left">{type}</TooltipContent>
        </Tooltip>
    )
}

export function ProblemTypeOption({ type }: { type: string }) {
    return (
        <span className="flex items-center gap-1">
            <ProblemTypeIcon type={type} showTooltip={false} className="size-3" />
            {type}
        </span>
    )
}
