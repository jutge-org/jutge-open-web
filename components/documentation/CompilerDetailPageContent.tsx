'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import { PageSpinner } from '@/components/ClientGates'
import { CompilerDetail } from '@/components/documentation/CompilerDetail'
import { findCompilerBySlug } from '@/lib/documentation'
import { fetchCompilers } from '@/lib/data/tables'
import type { Compiler } from '@/lib/jutge_api_client'

type CompilerDetailPageContentProps = {
    id: string
}

export function CompilerDetailPageContent({ id }: CompilerDetailPageContentProps) {
    const [compiler, setCompiler] = useState<Compiler | null | undefined>(undefined)

    useEffect(() => {
        void fetchCompilers().then((compilers) => {
            setCompiler(findCompilerBySlug(compilers, id) ?? null)
        })
    }, [id])

    if (compiler === undefined) {
        return <PageSpinner />
    }

    if (!compiler) {
        notFound()
    }

    return <CompilerDetail compiler={compiler} />
}
