import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUBMISSION_CODE_PATH = /^\/problems\/[^/]+\/submissions\/[^/]+\/code$/
const SUBMISSION_TESTCASE_DIFF_PATH = /^\/problems\/[^/]+\/submissions\/[^/]+\/diffs\/[^/]+\/diff$/

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    const isSubmissionCodePath = SUBMISSION_CODE_PATH.test(pathname)
    const isSubmissionTestcaseDiffPath = SUBMISSION_TESTCASE_DIFF_PATH.test(pathname)

    if (!isSubmissionCodePath && !isSubmissionTestcaseDiffPath) {
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
    matcher: [
        '/problems/:key/submissions/:submission_id/code',
        '/problems/:key/submissions/:submission_id/diffs/:testcase/diff',
    ],
}
