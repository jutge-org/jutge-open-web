import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUBMISSION_CODE_PATH = /^\/problems\/[^/]+\/submissions\/[^/]+\/code$/

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (!SUBMISSION_CODE_PATH.test(pathname)) {
        return NextResponse.next()
    }

    const accept = request.headers.get('accept') ?? ''
    if (!accept.includes('text/html')) {
        return NextResponse.next()
    }

    const url = request.nextUrl.clone()
    url.pathname = `${pathname}/view`
    return NextResponse.rewrite(url)
}

export const config = {
    matcher: ['/problems/:key/submissions/:submission_id/code'],
}
