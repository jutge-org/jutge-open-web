import { getPreferredProblemVariant } from '@/lib/problemVariants'
import type { AbstractProblem, Profile } from '@/lib/jutge_api_client'
import type { Dict } from '@/lib/instructor/utils'

export function getProblemTitle(user: Profile, problem_nm: string, abstractProblems: Dict<AbstractProblem>): string {
    try {
        const abstractProblem = abstractProblems[problem_nm]
        const variant = getPreferredProblemVariant(abstractProblem, user.language_id)
        return variant?.title ?? problem_nm
    } catch {
        return problem_nm
    }
}
