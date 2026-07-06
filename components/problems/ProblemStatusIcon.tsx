'use client'

import { GaugeIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { AbstractStatus } from '@/lib/jutge_api_client'

const statusTooltipFields = [
    { key: 'status' as const, label: 'Status', always: true },
    { key: 'nb_submissions' as const, label: 'Submissions' },
    { key: 'nb_pending_submissions' as const, label: 'Pending submissions' },
    { key: 'nb_accepted_submissions' as const, label: 'Accepted submissions' },
    { key: 'nb_rejected_submissions' as const, label: 'Rejected submissions' },
    { key: 'nb_scored_submissions' as const, label: 'Scored submissions' },
]

function formatStatusTooltipValue(key: (typeof statusTooltipFields)[number]['key'], value: string | number): string {
    if (key === 'status' && typeof value === 'string') {
        return value.charAt(0).toUpperCase() + value.slice(1)
    }

    return String(value)
}

function ProblemStatusTooltipContent({ data }: { data: AbstractStatus }) {
    const entries = statusTooltipFields.filter(({ key, always }) => {
        if (always) return true
        return data[key] !== 0
    })

    return (
        <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-left">
            {entries.map(({ key, label }) => (
                <div key={key} className="contents">
                    <dt className="text-background/70">{label}</dt>
                    <dd className="font-medium tabular-nums">{formatStatusTooltipValue(key, data[key])}</dd>
                </div>
            ))}
        </dl>
    )
}

type ProblemStatusIconProps = {
    status: AbstractStatus
    className?: string
}

export function ProblemStatusIcon({ status, className }: ProblemStatusIconProps) {
    const { status: statusValue } = status
    const accepted = statusValue === 'accepted'
    const scored = statusValue === 'scored'
    const showIcon = accepted || statusValue === 'rejected' || scored

    if (!showIcon) {
        return null
    }

    let Icon = ThumbsDownIcon
    let iconClassName = 'text-red-600 dark:text-red-400'

    if (accepted) {
        Icon = ThumbsUpIcon
        iconClassName = 'text-emerald-600 dark:text-emerald-400'
    } else if (scored) {
        Icon = GaugeIcon
        iconClassName = 'text-orange-600 dark:text-orange-400'
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex cursor-default items-center">
                    <Icon className={className ?? `size-6 shrink-0 ${iconClassName}`} aria-hidden />
                </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="flex flex-col items-start px-3 py-2">
                <ProblemStatusTooltipContent data={status} />
            </TooltipContent>
        </Tooltip>
    )
}
