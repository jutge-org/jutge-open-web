import { parseProblemKey } from '@/lib/problems'
import type { MainBreadcrumbSegment } from '@/store/MainBreadcrumbs'

const LOADING_TITLE = '…'

export function problemProblemsUrl(authenticated: boolean): string {
    return authenticated ? '/problems' : '/problems/public'
}

export function problemNmFromKey(key: string): string | null {
    const parsed = parseProblemKey(key)
    if (parsed.kind === 'invalid') {
        return null
    }

    return parsed.problem_nm
}

export function problemBaseBreadcrumbs(key: string, authenticated = true): MainBreadcrumbSegment[] {
    const problemsUrl = problemProblemsUrl(authenticated)
    const problem_nm = problemNmFromKey(key)

    if (!problem_nm) {
        return [{ title: 'Problems', url: problemsUrl }]
    }

    return [
        { title: 'Problems', url: problemsUrl },
        { title: problem_nm, url: `/problems/${problem_nm}` },
        { title: LOADING_TITLE, url: `/problems/${key}` },
    ]
}

export function problemTrailBreadcrumbs(
    key: string,
    trail: readonly MainBreadcrumbSegment[],
    authenticated = true,
): MainBreadcrumbSegment[] {
    return [...problemBaseBreadcrumbs(key, authenticated), ...trail]
}

export function problemLoadedBreadcrumbs(
    key: string,
    problem_nm: string,
    title: string,
    trail: readonly MainBreadcrumbSegment[] = [],
    authenticated = true,
): MainBreadcrumbSegment[] {
    const problemsUrl = problemProblemsUrl(authenticated)

    return [
        { title: 'Problems', url: problemsUrl },
        { title: problem_nm, url: `/problems/${problem_nm}` },
        { title, url: `/problems/${key}` },
        ...trail,
    ]
}
