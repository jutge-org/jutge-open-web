'use client'

import { useEffect, useState } from 'react'

import { PageSpinner } from '@/components/ClientGates'
import { VerdictDetail } from '@/components/documentation/VerdictDetail'
import { fetchVerdicts } from '@/lib/data/tables'
import type { Verdict } from '@/lib/jutge_api_client'

export function VerdictsAllPageContent() {
    const [verdicts, setVerdicts] = useState<Verdict[] | null>(null)

    useEffect(() => {
        void fetchVerdicts().then(setVerdicts)
    }, [])

    if (!verdicts) {
        return <PageSpinner />
    }

    if (verdicts.length === 0) {
        return <p className="text-muted-foreground">Could not load verdicts. Please try again later.</p>
    }

    return (
        <div className="flex flex-col gap-6">
            {verdicts.map((verdict) => (
                <VerdictDetail key={verdict.verdict_id} verdict={verdict} />
            ))}
        </div>
    )
}
