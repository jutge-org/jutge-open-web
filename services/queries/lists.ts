import { cache } from 'react'

import type { JutgeApiClient, ListItem } from '@/lib/jutge_api_client'
import type { ProblemRow } from '@/services/queries/problems'

export type CourseListSeparatorRow = {
    kind: 'separator'
    description: string
}

export type CourseListProblemRow = {
    kind: 'problem'
} & ProblemRow

export type CourseListItemRow = CourseListSeparatorRow | CourseListProblemRow

export type CourseListData = {
    list_nm: string
    title: string
    items: CourseListItemRow[]
}

function mapListItem(item: ListItem, problemByNm: Map<string, ProblemRow>): CourseListItemRow {
    if (!item.problem_nm) {
        return {
            kind: 'separator',
            description: item.description?.trim() || '—',
        }
    }

    const problem = problemByNm.get(item.problem_nm)
    if (problem) {
        return { kind: 'problem', ...problem }
    }

    return {
        kind: 'problem',
        problem_nm: item.problem_nm,
        title: item.problem_nm,
        language_ids: [],
        driver_id: null,
        author: null,
        created_at: '',
        updated_at: '',
    }
}

export const fetchCourseListsData = cache(
    async (client: JutgeApiClient, listKeys: string[], problems: ProblemRow[]): Promise<CourseListData[]> => {
        if (listKeys.length === 0) {
            return []
        }

        const problemByNm = new Map(problems.map((problem) => [problem.problem_nm, problem]))

        return Promise.all(
            listKeys.map(async (listKey) => {
                try {
                    const list = await client.student.lists.get(listKey)
                    return {
                        list_nm: list.list_nm,
                        title: list.title?.trim() || list.list_nm,
                        items: list.items.map((item) => mapListItem(item, problemByNm)),
                    }
                } catch {
                    return {
                        list_nm: listKey,
                        title: listKey,
                        items: [],
                    }
                }
            }),
        )
    },
)
