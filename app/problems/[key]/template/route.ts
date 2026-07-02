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

    const template = new URL(request.url).searchParams.get('file')
    if (!template) {
        return new NextResponse(null, { status: 400 })
    }

    try {
        const client = await getProblemsApiClient()
        const templates = await client.problems.getTemplates(problemId)
        if (!templates.includes(template)) {
            return new NextResponse(null, { status: 404 })
        }

        const download = await client.problems.getTemplate({ problem_id: problemId, template })

        return new NextResponse(Buffer.from(download.data), {
            headers: {
                'Content-Type': download.type || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${download.name}"`,
            },
        })
    } catch {
        return new NextResponse(null, { status: 404 })
    }
}
