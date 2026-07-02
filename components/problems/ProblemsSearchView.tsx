'use client'

import { useSearchParams } from 'next/navigation'

import {
    fetchProblemSearchHtmlStatement,
    fetchProblemSearchMarkdownStatement,
    fetchProblemSearchPdfStatement,
    fetchProblemSearchSuppl,
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
    fetchSuppl: fetchProblemSearchSuppl,
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
