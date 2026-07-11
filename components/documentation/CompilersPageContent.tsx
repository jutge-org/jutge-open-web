'use client'

import { useEffect, useState } from 'react'

import { PageSpinner } from '@/components/ClientGates'
import { CompilersTable } from '@/components/documentation/CompilersTable'
import { fetchCompilers } from '@/lib/data/tables'
import type { Compiler } from '@/lib/jutge_api_client'

export function CompilersPageContent() {
    const [compilers, setCompilers] = useState<Compiler[] | null>(null)

    useEffect(() => {
        void fetchCompilers().then(setCompilers)
    }, [])

    if (!compilers) {
        return <PageSpinner />
    }

    if (compilers.length === 0) {
        return <p className="text-muted-foreground">Could not load compilers. Please try again later.</p>
    }

    return <CompilersTable compilers={compilers} />
}
