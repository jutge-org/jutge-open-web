'use client'

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
    return <ProblemSearchView actions={problemsSearchActions} />
}
