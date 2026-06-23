import { getClientFromRequestCookies, getAnonymousServerJutgeClient } from '@/lib/server-request-auth'
import { resolveProblemId } from '@/services/queries/problemDetail'
import { NextResponse } from 'next/server'

type RouteContext = {
    params: Promise<{ key: string }>
}

export async function GET(request: Request, context: RouteContext) {
    const { key } = await context.params
    const client = getClientFromRequestCookies(request) ?? (await getAnonymousServerJutgeClient())
    const problemId = await resolveProblemId(client, key)
    if (!problemId) {
        return new NextResponse(null, { status: 404 })
    }

    try {
        const download = await client.problems.getZipStatement(problemId)

        return new NextResponse(Buffer.from(download.data), {
            headers: {
                'Content-Type': download.type || 'application/zip',
                'Content-Disposition': `attachment; filename="${download.name}"`,
            },
        })
    } catch {
        return new NextResponse(null, { status: 404 })
    }
}
