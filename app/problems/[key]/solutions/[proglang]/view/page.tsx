import { SolutionCodeEditor } from '@/components/problems/SolutionCodeEditor'
import { getCurrentClient } from '@/lib/auth'
import { parseProblemKey } from '@/lib/problems'
import { renderAuthed } from '@/lib/renderAuthed'
import { solutionDownloadHref } from '@/lib/solutions'
import { fetchInstructorOwnsProblem, fetchProblemDetail, resolveProblemId } from '@/services/queries/problemDetail'
import { fetchProblemSolutionContent } from '@/services/queries/problemSolutions'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string; proglang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key, proglang } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return { title: `${proglang} solution — Jutge.org` }
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        return { title: `${proglang} solution — Jutge.org` }
    }

    return {
        title: `${data.problem.problem_nm} — ${proglang} solution — Jutge.org`,
    }
}

export default async function ProblemSolutionCodeViewPage({ params }: PageProps) {
    const { key, proglang } = await params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        notFound()
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        notFound()
    }

    const parsed = parseProblemKey(problemId)
    const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : data.problem.problem_nm
    const title = `${data.problem.problem_nm} — ${data.problem.title}`

    return renderAuthed(async (user) => {
        const isInstructorOwner = await fetchInstructorOwnsProblem(problem_nm)
        if (!isInstructorOwner && !user.administrator) {
            notFound()
        }

        const client = await getCurrentClient()
        const solution = await fetchProblemSolutionContent(client, problemId, problem_nm, proglang)
        if (!solution) {
            notFound()
        }

        const codeHref = solutionDownloadHref(key, proglang)

        return (
            <SolutionCodeEditor
                code={solution.code}
                codeExtension={solution.codeExtension}
                codeFilename={solution.codeFilename}
                codeHref={codeHref}
                title={title}
                proglang={proglang}
            />
        )
    })
}
