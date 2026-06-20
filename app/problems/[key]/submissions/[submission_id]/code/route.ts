import { getCurrentClient, tryGetCurrentUser } from '@/lib/auth'
import { fetchSubmissionCode } from '@/services/queries/submissions'
import { NextResponse } from 'next/server'

type RouteContext = {
    params: Promise<{ key: string; submission_id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
    const { key, submission_id } = await context.params

    const user = await tryGetCurrentUser()
    if (!user) {
        return new NextResponse(null, { status: 401 })
    }

    try {
        const client = await getCurrentClient()
        const codeData = await fetchSubmissionCode(client, key, submission_id)

        if (!codeData) {
            return new NextResponse(null, { status: 404 })
        }

        return new NextResponse(codeData.code, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        })
    } catch {
        return new NextResponse(null, { status: 404 })
    }
}
