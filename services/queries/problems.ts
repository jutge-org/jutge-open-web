import { unstable_cache } from 'next/cache'

import { JutgeApiClient, type AbstractProblem, type Language } from '@/lib/jutge_api_client'

const PROBLEMS_LIST_CACHE_SECONDS = 300

export type ProblemRow = {
    problem_nm: string
    title: string
    language_ids: string[]
    type: string | null
    author: string | null
    created_at: string | number
    updated_at: string | number
}

export function abstractProblemsToTitleMap(abstractProblems: Record<string, AbstractProblem>): Map<string, string> {
    const titles = new Map<string, string>()

    for (const ap of Object.values(abstractProblems)) {
        const variants = Object.values(ap.problems).sort((a, b) => a.language_id.localeCompare(b.language_id))

        for (const variant of variants) {
            titles.set(variant.problem_id, variant.title)
        }

        titles.set(ap.problem_nm, variants.map((p) => p.title).join(' / ') || ap.problem_nm)
    }

    return titles
}

export function abstractProblemToRow(ap: AbstractProblem): ProblemRow {
    const variants = Object.values(ap.problems).sort((a, b) => a.language_id.localeCompare(b.language_id))
    const language_ids = variants.map((p) => p.language_id)
    const title = variants.map((p) => p.title).join(' / ') || ap.problem_nm

    return {
        problem_nm: ap.problem_nm,
        title,
        language_ids,
        type: ap.type,
        author: ap.author,
        created_at: ap.created_at,
        updated_at: ap.updated_at,
    }
}

async function loadAllAbstractProblems(): Promise<ProblemRow[]> {
    try {
        const client = new JutgeApiClient()
        const abstractProblems = await client.problems.getAllAbstractProblems()
        return Object.values(abstractProblems)
            .map(abstractProblemToRow)
            .sort((a, b) => a.problem_nm.localeCompare(b.problem_nm))
    } catch {
        return []
    }
}

async function loadLanguages(): Promise<Record<string, Language>> {
    try {
        const client = new JutgeApiClient()
        return await client.tables.getLanguages()
    } catch {
        return {}
    }
}

export const fetchAllAbstractProblems = unstable_cache(
    loadAllAbstractProblems,
    ['all-abstract-problems'],
    { revalidate: PROBLEMS_LIST_CACHE_SECONDS },
)

export const fetchLanguages = unstable_cache(loadLanguages, ['languages'], {
    revalidate: PROBLEMS_LIST_CACHE_SECONDS,
})
