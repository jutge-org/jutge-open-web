import jutge from '@/lib/jutge'
import { problemIconUrl } from '@/lib/problems'
import { getPreferredProblemVariant } from '@/lib/problemVariants'
import { JutgeApiClient, type AbstractProblem, type AbstractStatus, type Language } from '@/lib/jutge_api_client'

export type ProblemRow = {
    problem_nm: string
    title: string
    iconUrl: string | null
    language_ids: string[]
    driver_id: string | null
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

export function abstractProblemsToIconUrlMap(
    abstractProblems: Record<string, AbstractProblem>,
): Map<string, string | null> {
    const icons = new Map<string, string | null>()

    for (const ap of Object.values(abstractProblems)) {
        const iconUrl = problemIconUrl(ap.icon)
        icons.set(ap.problem_nm, iconUrl)
        for (const variant of Object.values(ap.problems)) {
            icons.set(variant.problem_id, iconUrl)
        }
    }

    return icons
}

export type AbstractProblemRowOptions = {
    allLanguageTitles?: boolean
}

export function abstractProblemToRow(
    ap: AbstractProblem,
    preferredLanguageId?: string | null,
    options?: AbstractProblemRowOptions,
): ProblemRow {
    const variants = Object.values(ap.problems).sort((a, b) => a.language_id.localeCompare(b.language_id))
    const language_ids = variants.map((p) => p.language_id)
    const title = options?.allLanguageTitles
        ? variants.map((p) => p.title).join(' / ') || ap.problem_nm
        : (getPreferredProblemVariant(ap, preferredLanguageId)?.title ?? ap.problem_nm)

    return {
        problem_nm: ap.problem_nm,
        title,
        iconUrl: problemIconUrl(ap.icon),
        language_ids,
        driver_id: ap.driver_id,
        author: ap.author,
        created_at: ap.created_at,
        updated_at: ap.updated_at,
    }
}

export function abstractProblemsToRows(
    abstractProblems: Record<string, AbstractProblem>,
    preferredLanguageId?: string | null,
    options?: AbstractProblemRowOptions,
): ProblemRow[] {
    return Object.values(abstractProblems)
        .map((ap) => abstractProblemToRow(ap, preferredLanguageId, options))
        .sort((a, b) => a.problem_nm.localeCompare(b.problem_nm))
}

async function loadAbstractProblemsDict(): Promise<Record<string, AbstractProblem>> {
    try {
        const client = jutge
        return await client.problems.getAllAbstractProblems()
    } catch {
        return {}
    }
}

async function loadLanguages(): Promise<Record<string, Language>> {
    try {
        const client = jutge
        return await client.tables.getLanguages()
    } catch {
        return {}
    }
}

export const fetchAbstractProblemsDict = loadAbstractProblemsDict

export const fetchLanguages = loadLanguages

export async function fetchAllAbstractProblems(
    preferredLanguageId?: string | null,
    options?: AbstractProblemRowOptions,
): Promise<ProblemRow[]> {
    const abstractProblems = await fetchAbstractProblemsDict()
    return abstractProblemsToRows(abstractProblems, preferredLanguageId, options)
}

export async function fetchStudentProblemStatuses(client: JutgeApiClient): Promise<Record<string, AbstractStatus>> {
    try {
        return await client.student.statuses.getAll()
    } catch {
        return {}
    }
}
