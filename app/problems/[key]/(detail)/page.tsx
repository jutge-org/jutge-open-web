import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { QuizProblemUnsupportedCard } from '@/components/problems/QuizProblemUnsupportedCard'
import { getCurrentClient, getPreferredLanguageId, isAuthenticated } from '@/lib/auth'
import { getPreferredProblemVariant } from '@/lib/problemVariants'
import { isGameProblem, isQuizProblem, parseProblemKey } from '@/lib/problems'
import {
    fetchAbstractProblem,
    fetchProblemDetail,
    fetchProblemStatus,
    resolveProblemId,
} from '@/services/queries/problemDetail'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key } = await params
    const parsed = parseProblemKey(key)
    if (parsed.kind === 'invalid') {
        return { title: 'Problem — Jutge.org' }
    }

    const abstractProblem = await fetchAbstractProblem(parsed.problem_nm)
    if (!abstractProblem) {
        return { title: 'Problem — Jutge.org' }
    }

    if (isQuizProblem(abstractProblem.type)) {
        const preferredLanguageId = await getPreferredLanguageId()
        const title = getPreferredProblemVariant(abstractProblem, preferredLanguageId)?.title ?? parsed.problem_nm
        return { title: `${title} — Problems — Jutge.org` }
    }

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
    const parsed = parseProblemKey(key)
    if (parsed.kind === 'invalid') {
        notFound()
    }

    const { problem_nm } = parsed
    const abstractProblem = await fetchAbstractProblem(problem_nm)
    if (!abstractProblem) {
        notFound()
    }

    const authenticated = await isAuthenticated()

    if (isQuizProblem(abstractProblem.type)) {
        const preferredLanguageId = await getPreferredLanguageId()
        const variant = getPreferredProblemVariant(abstractProblem, preferredLanguageId)
        const title = variant?.title ?? problem_nm

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Problems', url: authenticated ? '/problems' : '/problems/public' },
                        { title: problem_nm, url: `/problems/${problem_nm}` },
                        { title, url: `/problems/${key}` },
                    ]}
                />
                {!authenticated ? <PageTitle section="/problems" authenticated={false} hidden={false} /> : null}
                <QuizProblemUnsupportedCard title={title} problemNm={problem_nm} author={abstractProblem.author} />
            </div>
        )
    }

    const problemId = await resolveProblemId(key)
    if (!problemId) {
        notFound()
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        notFound()
    }

    const { problem } = data

    let status: Awaited<ReturnType<typeof fetchProblemStatus>> | undefined
    let defaultCompilerId: string | null | undefined

    if (authenticated && !isGameProblem(abstractProblem.type)) {
        const client = await getCurrentClient()
        const [statusResult, profile] = await Promise.all([
            fetchProblemStatus(client, problem.problem_nm),
            client.student.profile.get(),
        ])
        status = statusResult
        defaultCompilerId = profile.compiler_id
    }

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs
                breadcrumbs={[
                    { title: 'Problems', url: authenticated ? '/problems' : '/problems/public' },
                    { title: problem.problem_nm, url: `/problems/${problem.problem_nm}` },
                    { title: problem.title, url: `/problems/${key}` },
                ]}
            />
            {!authenticated ? <PageTitle section="/problems" authenticated={false} hidden={false} /> : null}
            <ProblemDetail pageKey={key} data={data} status={status} defaultCompilerId={defaultCompilerId} />
        </div>
    )
}
