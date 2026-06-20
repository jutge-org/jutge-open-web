import { readFile } from 'fs/promises'
import path from 'path'

import { parseHljsThemeSelection } from '@/lib/hljsThemes'
import { NextResponse } from 'next/server'

type RouteContext = {
    params: Promise<{ theme: string[] }>
}

export async function GET(_request: Request, context: RouteContext) {
    const theme = parseHljsThemeSelection((await context.params).theme.join('/'))

    if (!theme || theme === 'auto') {
        return new NextResponse(null, { status: 404 })
    }

    try {
        const cssPath = path.join(process.cwd(), 'node_modules/highlight.js/styles', `${theme}.min.css`)
        const css = await readFile(cssPath, 'utf8')

        return new NextResponse(css, {
            headers: {
                'Content-Type': 'text/css; charset=utf-8',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch {
        return new NextResponse(null, { status: 404 })
    }
}
