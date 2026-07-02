'use server'

import { getCurrentClient, isAuthenticated } from '@/lib/auth'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

async function withAuthenticatedClient<T>(fn: (client: JutgeApiClient) => Promise<T>): Promise<T> {
    if (!(await isAuthenticated())) {
        throw new Error('Forbidden')
    }
    return fn(await getCurrentClient())
}

export async function fetchProblemsSearchCatalog() {
    return withAuthenticatedClient((c) => c.problems.getAllAbstractProblems())
}

export async function problemsSemanticSearch(query: string) {
    return withAuthenticatedClient((c) => c.problems.semanticSearch({ query, limit: 50 }))
}

export async function problemsFullTextSearch(query: string) {
    return withAuthenticatedClient((c) => c.problems.fullTextSearch({ query, limit: 50 }))
}

export async function fetchProblemSearchSuppl(problem_nm: string) {
    return withAuthenticatedClient((c) => c.problems.getAbstractProblemSuppl(problem_nm))
}

export async function fetchProblemSearchPdfStatement(problem_id: string) {
    return withAuthenticatedClient((c) => c.problems.getPdfStatement(problem_id))
}

export async function fetchProblemSearchHtmlStatement(problem_id: string) {
    return withAuthenticatedClient((c) => c.problems.getHtmlStatement(problem_id))
}

export async function fetchProblemSearchMarkdownStatement(problem_id: string) {
    return withAuthenticatedClient((c) => c.problems.getMarkdownStatement(problem_id))
}

export async function fetchProblemSearchTextStatement(problem_id: string) {
    return withAuthenticatedClient((c) => c.problems.getTextStatement(problem_id))
}
