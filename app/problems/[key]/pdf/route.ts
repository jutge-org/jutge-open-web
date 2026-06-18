import { JutgeApiClient } from '@/lib/jutge_api_client'
import { resolveProblemId } from '@/services/queries/problemDetail'
import { NextResponse } from 'next/server'

type RouteContext = {
    params: Promise<{ key: string }>
}

export async function GET(_request: Request, context: RouteContext) {
    const { key } = await context.params
    const problemId = await resolveProblemId(key)
    if (!problemId) {
        return new NextResponse(null, { status: 404 })
    }

    try {
        const client = new JutgeApiClient()
        const download = await client.problems.getPdfStatement(problemId)

        return new NextResponse(Buffer.from(download.data), {
            headers: {
                'Content-Type': download.type || 'application/pdf',
                'Content-Disposition': `attachment; filename="${download.name}"`,
            },
        })
    } catch {
        return new NextResponse(null, { status: 404 })
    }
}
