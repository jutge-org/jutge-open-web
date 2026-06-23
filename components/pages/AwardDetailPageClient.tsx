'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import { AwardDetailCard } from '@/components/awards/AwardDetailCard'
import { AuthedGate } from '@/components/auth/AuthGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import type { AwardDetail } from '@/lib/awards'
import { fetchAwardDetail } from '@/services/queries/awards'

type AwardDetailPageClientProps = {
    awardId: string
}

export function AwardDetailPageClient({ awardId }: AwardDetailPageClientProps) {
    const { client, loading: authLoading } = useJutgeAuth()
    const [award, setAward] = useState<AwardDetail | null | undefined>(undefined)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        void fetchAwardDetail(client, awardId).then((data) => {
            if (!cancelled) {
                setAward(data)
            }
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client, awardId])

    if (authLoading || award === undefined) {
        return (
            <AuthedGate>
                <p className="py-16 text-center text-muted-foreground">Loading…</p>
            </AuthedGate>
        )
    }

    if (!award) {
        notFound()
    }

    return (
        <AuthedGate>
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Awards', url: '/awards' },
                        { title: award.title, url: `/awards/${encodeURIComponent(award.award_id)}` },
                    ]}
                />
                <AwardDetailCard award={award} />
            </div>
        </AuthedGate>
    )
}
