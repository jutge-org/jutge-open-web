import type { AbstractProblem, Profile } from '@/lib/jutge_api_client'
import type { Dict } from '@/lib/instructor/utils'

export function getProblemTitle(user: Profile, problem_nm: string, abstractProblems: Dict<AbstractProblem>): string {
    try {
        const abstractProblem = abstractProblems[problem_nm]
        const prefLanguageId = user.language_id
        const problem_id = abstractProblem.problem_nm + '_' + prefLanguageId
        if (problem_id in abstractProblem.problems) {
            return abstractProblem.problems[problem_id].title
        }
        for (const problem of Object.values(abstractProblem.problems)) {
            if (problem.translator === null) {
                return problem.title
            }
        }
        for (const problem of Object.values(abstractProblem.problems)) {
            return problem.title
        }
        return problem_nm
    } catch {
        return problem_nm
    }
}
