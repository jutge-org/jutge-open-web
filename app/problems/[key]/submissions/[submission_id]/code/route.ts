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

        return new NextResponse(new Uint8Array(codeData.body), {
            headers: {
                'Content-Type': codeData.contentType,
                'Content-Disposition': `attachment; filename="${codeData.filename}"`,
            },
        })
    } catch {
        return new NextResponse(null, { status: 404 })
    }
}
