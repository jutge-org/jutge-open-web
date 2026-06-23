import { cache } from 'react'

import { getAnonymousJutgeClient } from '@/lib/jutge-client-registry'
import { getPreferredProblemVariant } from '@/lib/problemVariants'
import { JutgeApiClient, type AbstractProblem, type AbstractStatus, type Language } from '@/lib/jutge_api_client'

export type ProblemRow = {
    problem_nm: string
    title: string
    language_ids: string[]
    type: string | null
    author: string | null
    created_at: string | number
    updated_at: string | number
}

export function abstractProblemsToTitleMap(
    abstractProblems: Record<string, AbstractProblem>,
    preferredLanguageId?: string | null,
): Map<string, string> {
    const titles = new Map<string, string>()

    for (const ap of Object.values(abstractProblems)) {
        const variants = Object.values(ap.problems).sort((a, b) => a.language_id.localeCompare(b.language_id))

        for (const variant of variants) {
            titles.set(variant.problem_id, variant.title)
        }

        const preferredVariant = getPreferredProblemVariant(ap, preferredLanguageId)
        titles.set(ap.problem_nm, preferredVariant?.title ?? ap.problem_nm)
    }

    return titles
}

export function abstractProblemToRow(ap: AbstractProblem, preferredLanguageId?: string | null): ProblemRow {
    const variants = Object.values(ap.problems).sort((a, b) => a.language_id.localeCompare(b.language_id))
    const language_ids = variants.map((p) => p.language_id)
    const preferredVariant = getPreferredProblemVariant(ap, preferredLanguageId)
    const title = preferredVariant?.title ?? ap.problem_nm

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

export function abstractProblemsToRows(
    abstractProblems: Record<string, AbstractProblem>,
    preferredLanguageId?: string | null,
): ProblemRow[] {
    return Object.values(abstractProblems)
        .map((ap) => abstractProblemToRow(ap, preferredLanguageId))
        .sort((a, b) => a.problem_nm.localeCompare(b.problem_nm))
}

async function loadAbstractProblemsDict(): Promise<Record<string, AbstractProblem>> {
    try {
        const client = getAnonymousJutgeClient()
        return await client.problems.getAllAbstractProblems()
    } catch {
        return {}
    }
}

async function loadLanguages(): Promise<Record<string, Language>> {
    try {
        const client = getAnonymousJutgeClient()
        return await client.tables.getLanguages()
    } catch {
        return {}
    }
}

export const fetchAbstractProblemsDict = cache(loadAbstractProblemsDict)

export const fetchLanguages = cache(loadLanguages)

export const fetchAllAbstractProblems = cache(async (preferredLanguageId?: string | null): Promise<ProblemRow[]> => {
    const abstractProblems = await fetchAbstractProblemsDict()
    return abstractProblemsToRows(abstractProblems, preferredLanguageId)
})

export const fetchStudentProblemStatuses = cache(
    async (client: JutgeApiClient): Promise<Record<string, AbstractStatus>> => {
        try {
            return await client.student.statuses.getAll()
        } catch {
            return {}
        }
    },
)
