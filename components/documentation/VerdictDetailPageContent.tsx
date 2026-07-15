'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import { PageSpinner } from '@/components/ClientGates'
import { VerdictDetail } from '@/components/documentation/VerdictDetail'
import { fetchVerdicts } from '@/lib/data/tables'
import type { Verdict } from '@/lib/jutge_api_client'

type VerdictDetailPageContentProps = {
    id: string
}

export function VerdictDetailPageContent({ id }: VerdictDetailPageContentProps) {
    const [verdict, setVerdict] = useState<Verdict | null | undefined>(undefined)

    useEffect(() => {
        void fetchVerdicts().then((verdicts) => {
            setVerdict(verdicts.find((v) => v.verdict_id === id) ?? null)
        })
    }, [id])

    if (verdict === undefined) {
        return <PageSpinner />
    }

    if (!verdict) {
        notFound()
    }

    return <VerdictDetail verdict={verdict} />
}
