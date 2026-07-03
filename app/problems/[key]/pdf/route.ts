import { getProblemsApiClient } from '@/lib/auth'
import { resolveProblemId } from '@/services/queries/problemDetail'
import { NextResponse } from 'next/server'

type RouteContext = {
    params: Promise<{ key: string }>
}

export async function GET(request: Request, context: RouteContext) {
    const { key } = await context.params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return new NextResponse(null, { status: 404 })
    }

    const inline = new URL(request.url).searchParams.get('inline') === '1'

    try {
        const client = await getProblemsApiClient()
        const download = await client.problems.getPdfStatement(problemId)

        return new NextResponse(Buffer.from(download.data), {
            headers: {
                'Content-Type': download.type || 'application/pdf',
                'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${download.name}"`,
            },
        })
    } catch {
        return new NextResponse(null, { status: 404 })
    }
}
