import { cache } from 'react'

import { parseProblemKey } from '@/lib/problems'
import { JutgeApiClient, type Language, type Problem, type Testcase } from '@/lib/jutge_api_client'

import { fetchLanguages } from './problems'

export type DecodedTestcase = {
    name: string
    input: string
    output: string
    outputImageSrc?: string
}

export type LanguageVariant = {
    problem_id: string
    language_id: string
    title: string
}

export type ProblemDetailData = {
    problem: Problem
    shortHtmlStatement: string
    publicTestcases: DecodedTestcase[]
    languageVariants: LanguageVariant[]
    officialSolutions: string[]
    brokenOfficialSolutions: string[]
    userSolutions: string[]
    languages: Record<string, Language>
}

function decodeTestcase(testcase: Testcase, outputAsImage: boolean): DecodedTestcase {
    const decoded: DecodedTestcase = {
        name: testcase.name,
        input: Buffer.from(testcase.input_b64, 'base64').toString('utf-8'),
        output: '',
    }

    if (outputAsImage) {
        decoded.outputImageSrc = `data:image/png;base64,${testcase.correct_b64}`
        return decoded
    }

    decoded.output = Buffer.from(testcase.correct_b64, 'base64').toString('utf-8')
    return decoded
}

export async function resolveProblemId(key: string): Promise<string | null> {
    const parsed = parseProblemKey(key)

    if (parsed.kind === 'problem_id') {
        return parsed.problem_id
    }

    if (parsed.kind === 'problem_nm') {
        try {
            const client = new JutgeApiClient()
            const abstractProblem = await client.problems.getAbstractProblem(parsed.problem_nm)
            const variants = Object.values(abstractProblem.problems)
            if (variants.length === 0) {
                return null
            }

            const originalLanguageId = variants[0].original_language_id
            return `${parsed.problem_nm}_${originalLanguageId}`
        } catch {
            return null
        }
    }

    return null
}

export const fetchProblemDetail = cache(async (problemId: string): Promise<ProblemDetailData | null> => {
    try {
        const client = new JutgeApiClient()
        const problem = await client.problems.getProblem(problemId)

        const [shortHtmlStatement, sampleTestcases, publicTestcases, problemSuppl, abstractProblem, languages] =
            await Promise.all([
                client.problems.getShortHtmlStatement(problemId),
                client.problems.getSampleTestcases(problemId),
                client.problems.getPublicTestcases(problemId),
                client.problems.getProblemSuppl(problemId),
                client.problems.getAbstractProblem(problem.problem_nm),
                fetchLanguages(),
            ])

        const languageVariants = Object.values(abstractProblem.problems)
            .map((variant) => ({
                problem_id: variant.problem_id,
                language_id: variant.language_id,
                title: variant.title,
            }))
            .sort((a, b) => a.language_id.localeCompare(b.language_id))

        const officialSolutions = Object.entries(problemSuppl.official_solution_checks)
            .filter(([, checked]) => checked)
            .map(([proglang]) => proglang)
            .sort()

        const brokenOfficialSolutions = Object.entries(problemSuppl.official_solution_checks)
            .filter(([, checked]) => !checked)
            .map(([proglang]) => proglang)
            .sort()

        const userSolutions = [...problemSuppl.proglangs_with_ac].sort()

        return {
            problem,
            shortHtmlStatement,
            publicTestcases: [...sampleTestcases, ...publicTestcases].map((testcase) =>
                decodeTestcase(testcase, problem.abstract_problem.type === 'graphic'),
            ),
            languageVariants,
            officialSolutions,
            brokenOfficialSolutions,
            userSolutions,
            languages,
        }
    } catch {
        return null
    }
})
