import type { AbstractProblem, BriefProblem } from '@/lib/jutge_api_client'

export function getPreferredProblemVariant(
    abstractProblem: AbstractProblem,
    preferredLanguageId: string | null | undefined,
): BriefProblem | null {
    const variants = Object.values(abstractProblem.problems)
    if (variants.length === 0) {
        return null
    }

    if (preferredLanguageId) {
        const problemId = `${abstractProblem.problem_nm}_${preferredLanguageId}`
        if (problemId in abstractProblem.problems) {
            return abstractProblem.problems[problemId]
        }
    }

    for (const problem of variants) {
        if (problem.translator === null) {
            return problem
        }
    }

    return variants[0]
}

export function resolveProblemIdFromAbstract(
    abstractProblem: AbstractProblem,
    preferredLanguageId: string | null | undefined,
): string | null {
    return getPreferredProblemVariant(abstractProblem, preferredLanguageId)?.problem_id ?? null
}
