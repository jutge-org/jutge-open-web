import { cache } from 'react'

import type { InstructorList, JutgeApiClient, List, ListItem } from '@/lib/jutge_api_client'
import type { ProblemRow } from '@/services/queries/problems'

export async function fetchListsMany(
    client: JutgeApiClient,
    listKeys: string[],
): Promise<Record<string, List>> {
    if (listKeys.length === 0) {
        return {}
    }

    try {
        return await client.student.lists.getMany(listKeys.join(','))
    } catch {
        return {}
    }
}

export function studentListToInstructorList(list: List): InstructorList {
    return {
        list_nm: list.list_nm,
        title: list.title ?? '',
        description: list.description ?? '',
        annotation: list.annotation ?? '',
        official: list.official,
        public: list.public,
        created_at: '',
        updated_at: '',
        items: list.items,
    }
}

function placeholderInstructorList(list_nm: string): InstructorList {
    return {
        list_nm,
        title: list_nm,
        description: '',
        annotation: '',
        official: 0,
        public: 0,
        created_at: '',
        updated_at: '',
        items: [],
    }
}

export async function fetchInstructorListsMany(
    client: JutgeApiClient,
    listNms: string[],
): Promise<InstructorList[]> {
    const listsByKey = await fetchListsMany(client, listNms)
    return listNms.map((list_nm) => {
        const list = listsByKey[list_nm]
        return list ? studentListToInstructorList(list) : placeholderInstructorList(list_nm)
    })
}

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

function mapListToCourseListData(
    listKey: string,
    list: List | undefined,
    problemByNm: Map<string, ProblemRow>,
): CourseListData {
    if (!list) {
        return {
            list_nm: listKey,
            title: listKey,
            items: [],
        }
    }

    return {
        list_nm: list.list_nm,
        title: list.title?.trim() || list.list_nm,
        items: list.items.map((item) => mapListItem(item, problemByNm)),
    }
}

export const fetchCourseListsData = cache(
    async (client: JutgeApiClient, listKeys: string[], problems: ProblemRow[]): Promise<CourseListData[]> => {
        if (listKeys.length === 0) {
            return []
        }

        const problemByNm = new Map(problems.map((problem) => [problem.problem_nm, problem]))
        const listsByKey = await fetchListsMany(client, listKeys)

        return listKeys.map((listKey) => mapListToCourseListData(listKey, listsByKey[listKey], problemByNm))
    },
)
