import type { Metadata } from 'next'

import { DocumentationCompilerDetailPageClient } from '@/components/pages/DocumentationCompilersPageClient'
import { findCompilerBySlug } from '@/lib/documentation'
import { getAnonymousServerJutgeClient } from '@/lib/server-request-auth'
import { fetchCompilers } from '@/services/queries/tables'

type PageProps = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const client = await getAnonymousServerJutgeClient()
    const compilers = await fetchCompilers(client)
    const compiler = findCompilerBySlug(compilers, id)
    if (!compiler) return { title: 'Compiler — Documentation — Jutge.org' }
    return { title: `${compiler.compiler_id} — Compilers — Documentation — Jutge.org` }
}

export default async function DocumentationCompilerDetailPage({ params }: PageProps) {
    const { id } = await params

    return <DocumentationCompilerDetailPageClient compilerId={id} />
}
