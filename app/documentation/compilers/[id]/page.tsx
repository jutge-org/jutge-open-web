import { CompilerDetail } from '@/components/documentation/CompilerDetail'
import { DocumentationPageShell } from '@/components/documentation/DocumentationPageShell'
import { findCompilerBySlug } from '@/lib/documentation'
import { fetchCompilers } from '@/services/queries/tables'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const compilers = await fetchCompilers()
    const compiler = findCompilerBySlug(compilers, id)
    if (!compiler) return { title: 'Compiler — Documentation — Jutge.org' }
    return { title: `${compiler.compiler_id} — Compilers — Documentation — Jutge.org` }
}

export default async function DocumentationCompilerDetailPage({ params }: PageProps) {
    const { id } = await params
    const compilers = await fetchCompilers()
    const compiler = findCompilerBySlug(compilers, id)

    if (!compiler) notFound()

    return (
        <DocumentationPageShell
            activeTab="compilers"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'Compilers', url: '/documentation/compilers' },
                { title: compiler.compiler_id, url: `/documentation/compilers/${id}` },
            ]}
        >
            <CompilerDetail compiler={compiler} />
        </DocumentationPageShell>
    )
}
