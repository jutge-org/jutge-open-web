import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'

import type { AbstractStatus } from '@/lib/jutge_api_client'

type ProblemStatusProps = {
    status: AbstractStatus
}

const statRows = [
    { key: 'nb_submissions' as const, label: 'Submissions' },
    { key: 'nb_accepted_submissions' as const, label: 'Accepted submissions' },
    { key: 'nb_rejected_submissions' as const, label: 'Rejected submissions' },
]

export function ProblemStatus({ status }: ProblemStatusProps) {
    const hasStatus = status.status.length > 0
    const accepted = status.status === 'accepted'
    const showIcon = status.status === 'accepted' || status.status === 'rejected'
    const Icon = accepted ? ThumbsUpIcon : ThumbsDownIcon
    const visibleStats = statRows.filter(({ key }) => status[key] !== 0)

    return (
        <div className="border-t">
            {showIcon || visibleStats.length > 0 ? (
                <div className="flex items-center gap-8 px-6 pt-4">
                    {showIcon ? (
                        <Icon
                            className={`size-16 shrink-0 stroke-[1.5] ${accepted ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                            aria-hidden
                        />
                    ) : null}
                    {visibleStats.length > 0 ? (
                        <dl className="grid grid-cols-[max-content_max-content] gap-x-4 gap-y-1 text-sm">
                            {visibleStats.map(({ key, label }) => (
                                <div key={key} className="contents">
                                    <dt className="text-right font-semibold text-foreground">{label}</dt>
                                    <dd className="text-right tabular-nums text-foreground">{status[key]}</dd>
                                </div>
                            ))}
                        </dl>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}
