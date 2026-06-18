import { cache } from 'react'

import { JutgeApiClient, type AbstractProblem, type Language } from '@/lib/jutge_api_client'

export type ProblemRow = {
    problem_nm: string
    title: string
    language_ids: string[]
    type: string | null
}

export function abstractProblemToRow(ap: AbstractProblem): ProblemRow {
    const variants = Object.values(ap.problems).sort((a, b) => a.language_id.localeCompare(b.language_id))
    const language_ids = variants.map((p) => p.language_id)
    const title = variants.map((p) => p.title).join(' / ') || ap.problem_nm

    return { problem_nm: ap.problem_nm, title, language_ids, type: ap.type }
}

export const fetchAllAbstractProblems = cache(async (): Promise<ProblemRow[]> => {
    try {
        const client = new JutgeApiClient()
        const abstractProblems = await client.problems.getAllAbstractProblems()
        return Object.values(abstractProblems)
            .map(abstractProblemToRow)
            .sort((a, b) => a.problem_nm.localeCompare(b.problem_nm))
    } catch {
        return []
    }
})

export const fetchLanguages = cache(async (): Promise<Record<string, Language>> => {
    try {
        const client = new JutgeApiClient()
        return await client.tables.getLanguages()
    } catch {
        return {}
    }
})
