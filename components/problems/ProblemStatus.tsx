'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ListIcon, SendIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'

import { SubmissionDialog } from '@/components/problems/SubmissionDialog'
import { Button } from '@/components/ui/button'
import type { AbstractStatus, Compiler } from '@/lib/jutge_api_client'

type ProblemStatusProps = {
    status: AbstractStatus
    problemId: string
    compilers: Compiler[]
    defaultCompilerId?: string | null
}

const statRows = [
    { key: 'nb_submissions' as const, label: 'Submissions' },
    { key: 'nb_accepted_submissions' as const, label: 'Accepted submissions' },
    { key: 'nb_rejected_submissions' as const, label: 'Rejected submissions' },
]

export function ProblemStatus({ status, problemId, compilers, defaultCompilerId }: ProblemStatusProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const accepted = status.status === 'accepted'
    const showIcon = status.status === 'accepted' || status.status === 'rejected'
    const Icon = accepted ? ThumbsUpIcon : ThumbsDownIcon
    const visibleStats = statRows.filter(({ key }) => status[key] !== 0)

    return (
        <>
            <div className="border-t">
                <div className="flex items-center gap-8 px-6 pt-6 pb-2">
                    <div className="flex flex-1 items-center gap-8">
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
                    <div className="flex shrink-0 items-center gap-4">
                        <Button
                            type="button"
                            variant="default"
                            size="icon-lg"
                            className="size-16 rounded-full"
                            aria-label="Submissions"
                            title="All submissions"
                            asChild
                        >
                            <Link href={`/problems/${problemId}/submissions`}>
                                <ListIcon className="size-8 stroke-[1.5] shrink-0" />
                            </Link>
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            size="icon-lg"
                            className="size-16 rounded-full"
                            aria-label="Submit"
                            title="New submission"
                            onClick={() => setDialogOpen(true)}
                        >
                            <SendIcon className="size-8 stroke-[1.5] shrink-0 -translate-x-0.5" />
                        </Button>
                    </div>
                </div>
            </div>
            <SubmissionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                problemId={problemId}
                compilers={compilers}
                defaultCompilerId={defaultCompilerId}
            />
        </>
    )
}
