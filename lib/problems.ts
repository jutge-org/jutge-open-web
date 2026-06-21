import { includesForSearch } from '@/lib/utils'
import type { ProblemRow } from '@/services/queries/problems'

export type ProblemsColumnField = 'status' | 'problem_nm' | 'title' | 'author' | 'language_ids' | 'type'

export type ProblemsColumnVisibility = Record<ProblemsColumnField, boolean>

export const DEFAULT_PROBLEMS_COLUMN_VISIBILITY: ProblemsColumnVisibility = {
    status: true,
    problem_nm: true,
    title: true,
    author: true,
    language_ids: true,
    type: true,
}

export const PROBLEMS_COLUMN_LABELS: Record<ProblemsColumnField, string> = {
    status: 'Status',
    problem_nm: 'Problem',
    title: 'Title',
    author: 'Author',
    language_ids: 'Languages',
    type: 'Type',
}

function buildProblemSearchHaystack(problem: ProblemRow): string {
    return [
        problem.problem_nm,
        problem.title,
        problem.author ?? '',
        problem.type ?? '',
        ...problem.language_ids,
    ].join(' ')
}

export function filterProblems(problems: ProblemRow[], searchQuery: string): ProblemRow[] {
    const query = searchQuery.trim()
    if (!query) {
        return problems
    }

    return problems.filter((problem) => includesForSearch(buildProblemSearchHaystack(problem), query))
}

export const PROBLEM_ID_RE = /^([A-Z]\d{5})_([a-z]{2})$/
export const PROBLEM_NM_RE = /^[A-Z]\d{5}$/

export type ParsedProblemKey =
    | { kind: 'problem_id'; problem_id: string; problem_nm: string; language_id: string }
    | { kind: 'problem_nm'; problem_nm: string }
    | { kind: 'invalid' }

export function parseProblemCompilerIds(compilers: string | null): string[] {
    if (!compilers) return []
    return compilers.trim().split(/\s+/).filter(Boolean)
}

export function splitProblemId(problemId: string): { main: string; suffix: string | null } {
    const underscoreIndex = problemId.indexOf('_')
    if (underscoreIndex === -1) {
        return { main: problemId, suffix: null }
    }

    return {
        main: problemId.slice(0, underscoreIndex),
        suffix: problemId.slice(underscoreIndex + 1),
    }
}

export function pickPreferredId(availableIds: string[], preferredId: string | null | undefined): string {
    if (preferredId && availableIds.includes(preferredId)) {
        return preferredId
    }
    return availableIds[0] ?? ''
}

export function parseProblemKey(key: string): ParsedProblemKey {
    const idMatch = key.match(PROBLEM_ID_RE)
    if (idMatch) {
        return {
            kind: 'problem_id',
            problem_id: key,
            problem_nm: idMatch[1],
            language_id: idMatch[2],
        }
    }

    if (PROBLEM_NM_RE.test(key)) {
        return { kind: 'problem_nm', problem_nm: key }
    }

    return { kind: 'invalid' }
}
