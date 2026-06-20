import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { getCurrentClient, isAuthenticated } from '@/lib/auth'
import { fetchProblemDetail, fetchProblemStatus, resolveProblemId } from '@/services/queries/problemDetail'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return { title: 'Problem — Jutge.org' }
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        return { title: 'Problem — Jutge.org' }
    }

    return { title: `${data.problem.title} — Problems — Jutge.org` }
}

export default async function ProblemPage({ params }: PageProps) {
    const { key } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        notFound()
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        notFound()
    }

    const authenticated = await isAuthenticated()
    let status: Awaited<ReturnType<typeof fetchProblemStatus>> | undefined
    let defaultCompilerId: string | null | undefined

    if (authenticated) {
        const client = await getCurrentClient()
        const [statusResult, profile] = await Promise.all([
            fetchProblemStatus(client, data.problem.problem_nm),
            client.student.profile.get(),
        ])
        status = statusResult
        defaultCompilerId = profile.compiler_id
    }

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs
                breadcrumbs={[
                    { title: 'Problems', url: '/problems' },
                    { title: data.problem.problem_nm, url: `/problems/${data.problem.problem_nm}` },
                    { title: data.problem.title, url: `/problems/${key}` },
                ]}
            />
            <ProblemDetail pageKey={key} data={data} status={status} defaultCompilerId={defaultCompilerId} />
        </div>
    )
}
