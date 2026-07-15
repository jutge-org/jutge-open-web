'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'

import { AuthedGate } from '@/components/ClientGates'
import { FullscreenEditorLoading } from '@/components/general/FullscreenEditorLoading'
import { SolutionCodeEditor } from '@/components/problems/SolutionCodeEditor'
import jutge from '@/lib/jutge'
import { parseProblemKey } from '@/lib/problems'
import { solutionDownloadHref } from '@/lib/solutions'
import { fetchInstructorOwnsProblem, fetchProblemDetail, resolveProblemId } from '@/lib/data/problemDetail'
import { fetchProblemSolutionContent } from '@/lib/data/problemSolutions'

type PageData = {
    code: string
    codeExtension: string
    codeFilename: string
    codeHref: string
    title: string
    proglang: string
}

export default function ProblemSolutionCodeViewPage() {
    return (
        <AuthedGate>{(user) => <ProblemSolutionCodeViewPageContent isAdministrator={user.administrator} />}</AuthedGate>
    )
}

function ProblemSolutionCodeViewPageContent({ isAdministrator }: { isAdministrator: boolean }) {
    const params = useParams<{ key: string; proglang: string }>()
    const key = params.key
    const proglang = params.proglang
    const [pageData, setPageData] = useState<PageData | null | undefined>(undefined)

    useEffect(() => {
        void (async () => {
            const problemId = await resolveProblemId(key)
            if (!problemId) {
                setPageData(null)
                return
            }

            const data = await fetchProblemDetail(problemId)
            if (!data) {
                setPageData(null)
                return
            }

            const parsed = parseProblemKey(problemId)
            const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : data.problem.problem_nm
            const title = `${data.problem.problem_nm} — ${data.problem.title}`

            const isInstructorOwner = await fetchInstructorOwnsProblem(problem_nm)
            if (!isInstructorOwner && !isAdministrator) {
                setPageData(null)
                return
            }

            const solution = await fetchProblemSolutionContent(jutge, problemId, problem_nm, proglang)
            if (!solution || !solution.codeFilename) {
                setPageData(null)
                return
            }

            setPageData({
                code: solution.code,
                codeExtension: solution.codeExtension ?? '',
                codeFilename: solution.codeFilename,
                codeHref: solutionDownloadHref(key, proglang),
                title,
                proglang,
            })
        })()
    }, [isAdministrator, key, proglang])

    if (pageData === undefined) {
        return <FullscreenEditorLoading title={`${key} — ${proglang} solution`} />
    }

    if (!pageData) {
        notFound()
    }

    return (
        <SolutionCodeEditor
            code={pageData.code}
            codeExtension={pageData.codeExtension}
            codeFilename={pageData.codeFilename}
            codeHref={pageData.codeHref}
            title={pageData.title}
            proglang={pageData.proglang}
        />
    )
}
