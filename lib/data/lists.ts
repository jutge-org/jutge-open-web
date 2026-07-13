import { isCourseOwnedByUser, listTitleFromKey } from '@/lib/courses'
import { withInstructorClient } from '@/lib/instructor/client'
import type { InstructorList, JutgeApiClient, List, ListItem, Profile } from '@/lib/jutge_api_client'
import type { ProblemRow } from '@/lib/data/problems'

export async function fetchListsMany(client: JutgeApiClient, listKeys: string[]): Promise<Record<string, List>> {
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

export async function fetchInstructorListsMany(listNms: string[]): Promise<InstructorList[]> {
    if (listNms.length === 0) {
        return []
    }

    return withInstructorClient((client) => Promise.all(listNms.map((list_nm) => client.instructor.lists.get(list_nm))))
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
    isOwner: boolean
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
        iconUrl: null,
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
    profile: Pick<Profile, 'email' | 'username'>,
): CourseListData {
    const listNm = listTitleFromKey(listKey)

    if (!list) {
        return {
            list_nm: listNm,
            title: listNm,
            items: [],
            isOwner: false,
        }
    }

    return {
        list_nm: listNm,
        title: list.title?.trim() || listNm,
        items: list.items.map((item) => mapListItem(item, problemByNm)),
        isOwner: isCourseOwnedByUser(list.owner, profile),
    }
}

export async function fetchCourseListsData(
    client: JutgeApiClient,
    listKeys: string[],
    problems: ProblemRow[],
    profile: Pick<Profile, 'email' | 'username'>,
): Promise<CourseListData[]> {
    if (listKeys.length === 0) {
        return []
    }

    const problemByNm = new Map(problems.map((problem) => [problem.problem_nm, problem]))
    const listsByKey = await fetchListsMany(client, listKeys)

    return listKeys.map((listKey) => mapListToCourseListData(listKey, listsByKey[listKey], problemByNm, profile))
}
