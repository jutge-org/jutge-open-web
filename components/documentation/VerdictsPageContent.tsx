'use client'

import { useEffect, useState } from 'react'

import { PageSpinner } from '@/components/ClientGates'
import { VerdictsTable } from '@/components/documentation/VerdictsTable'
import { Button } from '@/components/ui/button'
import { fetchVerdicts } from '@/lib/data/tables'
import type { Verdict } from '@/lib/jutge_api_client'
import { FileCode2Icon } from 'lucide-react'
import Link from 'next/link'

export function VerdictsPageContent() {
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
        <>
            <VerdictsTable verdicts={verdicts} />
            <div className="flex justify-end">
                <Button variant="outline" asChild>
                    <Link href="/documentation/verdicts/all">
                        <FileCode2Icon aria-hidden />
                        All verdicts in one page
                    </Link>
                </Button>
            </div>
        </>
    )
}
