import { cache } from 'react'

import { tryGetCurrentUser } from '@/lib/auth'
import type { JutgeApiClient } from '@/lib/jutge_api_client'
import { decodeSolutionB64, extensionForProglang, solutionFilename } from '@/lib/solutions'

import { fetchCompilers } from './tables'
import { fetchInstructorOwnsProblem } from './problemDetail'

export type ProblemSolutionContent = {
    code: string
    codeExtension: string | null
    codeFilename: string
}

async function canAccessProblemSolutions(problem_nm: string): Promise<boolean> {
    const user = await tryGetCurrentUser()
    if (!user) {
        return false
    }

    if (user.administrator) {
        return true
    }

    return fetchInstructorOwnsProblem(problem_nm)
}

export async function fetchProblemSolutionProglangs(client: JutgeApiClient, problem_id: string): Promise<string[]> {
    const proglangs = await client.instructor.problems.getSolutions(problem_id)
    return [...proglangs].sort((a, b) => a.localeCompare(b))
}

export const fetchProblemSolutionContent = cache(
    async (
        client: JutgeApiClient,
        problem_id: string,
        problem_nm: string,
        proglang: string,
    ): Promise<ProblemSolutionContent | null> => {
        if (!(await canAccessProblemSolutions(problem_nm))) {
            return null
        }

        try {
            const [contentB64, compilers] = await Promise.all([
                client.instructor.problems.getSolutionAsB64({ problem_id, proglang }),
                fetchCompilers(),
            ])

            const codeExtension = extensionForProglang(proglang, compilers)

            return {
                code: decodeSolutionB64(contentB64),
                codeExtension,
                codeFilename: solutionFilename(problem_nm, proglang, codeExtension),
            }
        } catch {
            return null
        }
    },
)
