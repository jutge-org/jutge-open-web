import { getCurrentClient, tryGetCurrentUser } from '@/lib/auth'
import { parseProblemKey } from '@/lib/problems'
import { fetchInstructorOwnsProblem, fetchProblemDetail, resolveProblemId } from '@/services/queries/problemDetail'
import { fetchProblemSolutionContent } from '@/services/queries/problemSolutions'
import { NextResponse } from 'next/server'

type RouteContext = {
    params: Promise<{ key: string; proglang: string }>
}

export async function GET(_request: Request, context: RouteContext) {
    const { key, proglang } = await context.params

    const user = await tryGetCurrentUser()
    if (!user) {
        return new NextResponse(null, { status: 401 })
    }

    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return new NextResponse(null, { status: 404 })
    }

    const data = await fetchProblemDetail(problemId)
    if (!data) {
        return new NextResponse(null, { status: 404 })
    }

    const parsed = parseProblemKey(problemId)
    const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : data.problem.problem_nm

    const isInstructorOwner = await fetchInstructorOwnsProblem(problem_nm)
    if (!isInstructorOwner && !user.administrator) {
        return new NextResponse(null, { status: 403 })
    }

    try {
        const client = await getCurrentClient()
        const solution = await fetchProblemSolutionContent(client, problemId, problem_nm, proglang)

        if (!solution) {
            return new NextResponse(null, { status: 404 })
        }

        return new NextResponse(solution.code, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-Disposition': `attachment; filename="${solution.codeFilename}"`,
            },
        })
    } catch {
        return new NextResponse(null, { status: 404 })
    }
}
