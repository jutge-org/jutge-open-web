'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FileCode2 } from 'lucide-react'

import { CompilerDetail } from '@/components/documentation/CompilerDetail'
import { CompilersTable } from '@/components/documentation/CompilersTable'
import { DocumentationPageShell } from '@/components/documentation/DocumentationPageShell'
import { VerdictDetail } from '@/components/documentation/VerdictDetail'
import { VerdictsTable } from '@/components/documentation/VerdictsTable'
import { Button } from '@/components/ui/button'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { findCompilerBySlug } from '@/lib/documentation'
import type { Compiler, Verdict } from '@/lib/jutge_api_client'
import { fetchCompilers, fetchVerdicts } from '@/services/queries/tables'

export function DocumentationCompilersPageClient() {
    const { client, loading: authLoading } = useJutgeAuth()
    const [compilers, setCompilers] = useState<Compiler[] | null>(null)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        void fetchCompilers(client).then((data) => {
            if (!cancelled) setCompilers(data)
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client])

    if (authLoading || compilers === null) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return (
        <DocumentationPageShell
            activeTab="compilers"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Compilers', url: '/documentation/compilers' },
            ]}
        >
            {compilers.length === 0 ? (
                <p className="text-muted-foreground">Could not load compilers. Please try again later.</p>
            ) : (
                <CompilersTable compilers={compilers} />
            )}
        </DocumentationPageShell>
    )
}

type DocumentationCompilerDetailPageClientProps = {
    compilerId: string
}

export function DocumentationCompilerDetailPageClient({ compilerId }: DocumentationCompilerDetailPageClientProps) {
    const { client, loading: authLoading } = useJutgeAuth()
    const [compiler, setCompiler] = useState<Compiler | null | undefined>(undefined)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        void fetchCompilers(client).then((compilers) => {
            if (!cancelled) {
                setCompiler(findCompilerBySlug(compilers, compilerId))
            }
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client, compilerId])

    if (authLoading || compiler === undefined) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    if (!compiler) {
        notFound()
    }

    return (
        <DocumentationPageShell
            activeTab="compilers"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Compilers', url: '/documentation/compilers' },
                { title: compiler.compiler_id, url: `/documentation/compilers/${compilerId}` },
            ]}
        >
            <CompilerDetail compiler={compiler} />
        </DocumentationPageShell>
    )
}

export function DocumentationVerdictsPageClient() {
    const { client, loading: authLoading } = useJutgeAuth()
    const [verdicts, setVerdicts] = useState<Verdict[] | null>(null)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        void fetchVerdicts(client).then((data) => {
            if (!cancelled) setVerdicts(data)
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client])

    if (authLoading || verdicts === null) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return (
        <DocumentationPageShell
            activeTab="verdicts"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Verdicts', url: '/documentation/verdicts' },
            ]}
        >
            {verdicts.length === 0 ? (
                <p className="text-muted-foreground">Could not load verdicts. Please try again later.</p>
            ) : (
                <>
                    <VerdictsTable verdicts={verdicts} />
                    <div className="flex justify-end">
                        <Button variant="outline" asChild>
                            <Link href="/documentation/verdicts/all">
                                <FileCode2 aria-hidden />
                                All verdicts in one page
                            </Link>
                        </Button>
                    </div>
                </>
            )}
        </DocumentationPageShell>
    )
}

type DocumentationVerdictDetailPageClientProps = {
    verdictId: string
}

export function DocumentationVerdictDetailPageClient({ verdictId }: DocumentationVerdictDetailPageClientProps) {
    const { client, loading: authLoading } = useJutgeAuth()
    const [verdict, setVerdict] = useState<Verdict | null | undefined>(undefined)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        void fetchVerdicts(client).then((verdicts) => {
            if (!cancelled) {
                setVerdict(verdicts.find((v) => v.verdict_id === verdictId) ?? null)
            }
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client, verdictId])

    if (authLoading || verdict === undefined) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    if (!verdict) {
        notFound()
    }

    return (
        <DocumentationPageShell
            activeTab="verdicts"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Verdicts', url: '/documentation/verdicts' },
                { title: verdict.verdict_id, url: `/documentation/verdicts/${verdictId}` },
            ]}
        >
            <VerdictDetail verdict={verdict} />
        </DocumentationPageShell>
    )
}

export function DocumentationVerdictsAllPageClient() {
    const { client, loading: authLoading } = useJutgeAuth()
    const [verdicts, setVerdicts] = useState<Verdict[] | null>(null)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        void fetchVerdicts(client).then((data) => {
            if (!cancelled) setVerdicts(data)
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client])

    if (authLoading || verdicts === null) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return (
        <DocumentationPageShell
            activeTab="verdicts"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Verdicts', url: '/documentation/verdicts' },
                { title: 'All', url: '/documentation/verdicts/all' },
            ]}
        >
            {verdicts.length === 0 ? (
                <p className="text-muted-foreground">Could not load verdicts. Please try again later.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {verdicts.map((v) => (
                        <VerdictDetail key={v.verdict_id} verdict={v} />
                    ))}
                </div>
            )}
        </DocumentationPageShell>
    )
}
