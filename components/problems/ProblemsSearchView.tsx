'use client'

import { useSearchParams } from 'next/navigation'

import {
    fetchProblemSearchHtmlStatement,
    fetchProblemSearchMarkdownStatement,
    fetchProblemSearchPdfStatement,
    fetchManyProblemSearchSuppl,
    fetchProblemSearchTextStatement,
    fetchProblemsSearchCatalog,
    problemsFullTextSearch,
    problemsSemanticSearch,
} from '@/actions/problems'
import {
    ProblemSearchView,
    type ProblemSearchActions,
} from '@/components/problems/search/ProblemSearchView'

const problemsSearchActions: ProblemSearchActions = {
    fetchCatalog: fetchProblemsSearchCatalog,
    semanticSearch: problemsSemanticSearch,
    fullTextSearch: problemsFullTextSearch,
    fetchManySuppl: fetchManyProblemSearchSuppl,
    fetchPdfStatement: fetchProblemSearchPdfStatement,
    fetchHtmlStatement: fetchProblemSearchHtmlStatement,
    fetchMarkdownStatement: fetchProblemSearchMarkdownStatement,
    fetchTextStatement: fetchProblemSearchTextStatement,
}

export function ProblemsSearchView() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get('q') ?? ''

    return <ProblemSearchView actions={problemsSearchActions} initialQuery={initialQuery} />
}
