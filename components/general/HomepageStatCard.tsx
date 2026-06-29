'use client'

import type { LucideIcon } from 'lucide-react'

import { AnimatedStatValue } from '@/components/general/AnimatedStatValue'
import { cn } from '@/lib/utils'

type HomepageStatCardProps = {
    label: string
    value: number
    icon: LucideIcon
    borderAccent: string
    iconAccent: string
    replayKey: number
}

export function HomepageStatCard({
    label,
    value,
    icon: Icon,
    borderAccent,
    iconAccent,
    replayKey,
}: HomepageStatCardProps) {
    return (
        <div
            className={cn(
                'group flex flex-col gap-3 rounded-2xl border border-border border-t-4 bg-card px-5 py-5 shadow-sm',
                borderAccent,
            )}
        >
            <div className="flex items-center gap-2">
                <Icon className={cn('size-5 shrink-0 opacity-80', iconAccent)} aria-hidden />
                <span className={cn('text-sm font-medium line-clamp-1', iconAccent)}>{label}</span>
            </div>
            <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground group-hover:animate-pulse">
                <AnimatedStatValue value={value} replayKey={replayKey} />
            </p>
        </div>
    )
}
