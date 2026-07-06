'use server'

import { getCurrentClient, getCurrentUser } from '@/lib/auth'
import { decodeSolutionB64, extensionForProglang, solutionFilename } from '@/lib/solutions'
import { fetchCompilers } from '@/services/queries/tables'
import { fetchInstructorOwnsProblem } from '@/services/queries/problemDetail'

export type ProblemSolutionActionResult =
    | {
          ok: true
          code: string
          codeExtension: string | null
          codeFilename: string
      }
    | { ok: false; error: string }

export async function fetchProblemSolutionAction(data: {
    problem_id: string
    problem_nm: string
    proglang: string
}): Promise<ProblemSolutionActionResult> {
    const user = await getCurrentUser()
    const isInstructorOwner = await fetchInstructorOwnsProblem(data.problem_nm)

    if (!isInstructorOwner && !user.administrator) {
        return { ok: false, error: 'Forbidden' }
    }

    try {
        const client = await getCurrentClient()
        const [contentB64, compilers] = await Promise.all([
            client.instructor.problems.getSolutionAsB64({
                problem_id: data.problem_id,
                proglang: data.proglang,
            }),
            fetchCompilers(),
        ])

        const codeExtension = extensionForProglang(data.proglang, compilers)

        return {
            ok: true,
            code: decodeSolutionB64(contentB64),
            codeExtension,
            codeFilename: solutionFilename(data.problem_nm, data.proglang, codeExtension),
        }
    } catch {
        return { ok: false, error: 'Failed to load solution' }
    }
}
