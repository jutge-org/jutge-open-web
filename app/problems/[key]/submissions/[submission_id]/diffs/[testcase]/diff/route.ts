import { getCurrentClient, tryGetCurrentUser } from '@/lib/auth'
import { fetchSubmissionTestcaseAnalysis } from '@/services/queries/submissions'
import { NextResponse } from 'next/server'

type RouteContext = {
    params: Promise<{ key: string; submission_id: string; testcase: string }>
}

export async function GET(_request: Request, context: RouteContext) {
    const { key, submission_id, testcase } = await context.params

    const user = await tryGetCurrentUser()
    if (!user) {
        return new NextResponse(null, { status: 401 })
    }

    try {
        const client = await getCurrentClient()
        const analysis = await fetchSubmissionTestcaseAnalysis(client, key, submission_id, testcase)

        if (!analysis) {
            return new NextResponse(null, { status: 404 })
        }

        return NextResponse.json(
            {
                output: analysis.output,
                expected: analysis.expected,
            },
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            },
        )
    } catch {
        return new NextResponse(null, { status: 404 })
    }
}
