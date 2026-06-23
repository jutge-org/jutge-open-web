import { decodeBase64Utf8 } from '@/lib/base64'
import { parseProblemCompilerIds, parseProblemKey } from '@/lib/problems'
import { resolveProblemIdFromAbstract } from '@/lib/problemVariants'
import {
    type JutgeApiClient,
    type AbstractProblem,
    type AbstractStatus,
    type Compiler,
    type Language,
    type Problem,
    type Testcase,
} from '@/lib/jutge_api_client'

import { fetchCompilers } from './tables'
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
    compilers: Compiler[]
}

function decodeTestcase(testcase: Testcase, outputAsImage: boolean): DecodedTestcase {
    const decoded: DecodedTestcase = {
        name: testcase.name,
        input: decodeBase64Utf8(testcase.input_b64),
        output: '',
    }

    if (outputAsImage) {
        decoded.outputImageSrc = `data:image/png;base64,${testcase.correct_b64}`
        return decoded
    }

    decoded.output = decodeBase64Utf8(testcase.correct_b64)
    return decoded
}

export async function fetchAbstractProblem(
    client: JutgeApiClient,
    problem_nm: string,
): Promise<AbstractProblem | null> {
    try {
        return await client.problems.getAbstractProblem(problem_nm)
    } catch {
        return null
    }
}

export async function resolveProblemId(
    client: JutgeApiClient,
    key: string,
    preferredLanguageId?: string | null,
): Promise<string | null> {
    const parsed = parseProblemKey(key)

    if (parsed.kind === 'problem_id') {
        return parsed.problem_id
    }

    if (parsed.kind === 'problem_nm') {
        const abstractProblem = await fetchAbstractProblem(client, parsed.problem_nm)
        if (!abstractProblem) {
            return null
        }

        return resolveProblemIdFromAbstract(abstractProblem, preferredLanguageId)
    }

    return null
}

export async function fetchProblemStatus(
    client: JutgeApiClient,
    problem_nm: string,
): Promise<AbstractStatus | null> {
    try {
        return await client.student.statuses.getForAbstractProblem(problem_nm)
    } catch {
        return null
    }
}

export async function fetchProblemDetail(
    client: JutgeApiClient,
    problemId: string,
): Promise<ProblemDetailData | null> {
    try {
        const problem = await client.problems.getProblem(problemId)

        const [
            shortHtmlStatement,
            sampleTestcases,
            publicTestcases,
            problemSuppl,
            abstractProblem,
            languages,
            allCompilers,
        ] = await Promise.all([
            client.problems.getShortHtmlStatement(problemId),
            client.problems.getSampleTestcases(problemId),
            client.problems.getPublicTestcases(problemId),
            client.problems.getProblemSuppl(problemId),
            fetchAbstractProblem(client, problem.problem_nm),
            fetchLanguages(client),
            fetchCompilers(client),
        ])

        if (!abstractProblem) {
            return null
        }

        const allowedCompilerIds = parseProblemCompilerIds(problem.abstract_problem.compilers)
        const compilers =
            allowedCompilerIds.length > 0
                ? allCompilers.filter((compiler) => allowedCompilerIds.includes(compiler.compiler_id))
                : allCompilers

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
            compilers,
        }
    } catch {
        return null
    }
}
