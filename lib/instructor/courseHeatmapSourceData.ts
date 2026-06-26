import type { Dict } from '@/lib/instructor/utils'
import type {
    AbstractProblem,
    CourseSubmission,
    InstructorCourse,
    InstructorList,
    StudentProfile,
} from '@/lib/jutge_api_client'

export type HeatmapAxisItem = {
    key: string
    label: string
    title: string
    subtitle: string
    listNm: string
    listTitle: string
    problemNms: string[]
}

export type HeatmapSourceData = {
    submissions: CourseSubmission[]
    students: HeatmapAxisItem[]
    problemColumns: HeatmapAxisItem[]
    listColumns: HeatmapAxisItem[]
}

function getAbstractProblemTitle(problem_nm: string, abstractProblems: Dict<AbstractProblem>): string {
    const abstractProblem = abstractProblems[problem_nm]
    if (!abstractProblem) return problem_nm

    const variants = Object.values(abstractProblem.problems)
    const canonical = variants.find((variant) => variant.translator === null) ?? variants[0]
    return canonical?.title ?? problem_nm
}

function buildProblemColumns(lists: InstructorList[], abstractProblems: Dict<AbstractProblem>): HeatmapAxisItem[] {
    const seen = new Set<string>()
    const columns: HeatmapAxisItem[] = []

    for (const list of lists) {
        for (const item of list.items) {
            if (!item.problem_nm || seen.has(item.problem_nm)) continue
            seen.add(item.problem_nm)
            columns.push({
                key: item.problem_nm,
                label: item.problem_nm,
                title: getAbstractProblemTitle(item.problem_nm, abstractProblems),
                subtitle: list.list_nm,
                listNm: list.list_nm,
                listTitle: list.title?.trim() || list.list_nm,
                problemNms: [item.problem_nm],
            })
        }
    }

    return columns
}

function buildListColumns(lists: InstructorList[]): HeatmapAxisItem[] {
    return lists.map((list) => ({
        key: list.list_nm,
        label: list.list_nm,
        title: list.title?.trim() || list.list_nm,
        subtitle: `${list.items.filter((item) => item.problem_nm).length} problems`,
        listNm: list.list_nm,
        listTitle: list.title?.trim() || list.list_nm,
        problemNms: list.items
            .map((item) => item.problem_nm)
            .filter((problem_nm): problem_nm is string => !!problem_nm),
    }))
}

function buildStudentRows(
    course: InstructorCourse,
    profiles: Dict<StudentProfile>,
    submissions: CourseSubmission[],
): HeatmapAxisItem[] {
    const emails = [...new Set([...course.students.enrolled, ...course.students.invited])].sort((a, b) =>
        a.localeCompare(b),
    )
    const uidByEmail = new Map<string, string>()
    for (const submission of submissions) {
        uidByEmail.set(submission.email, submission.user_uid)
    }

    return emails.map((email) => {
        const profile = profiles[email]
        const uid = uidByEmail.get(email) ?? email
        return {
            key: uid,
            label: '',
            title: profile?.name?.trim() || email,
            subtitle: email,
            listNm: '',
            listTitle: '',
            problemNms: [],
        }
    })
}

function withStudentLabels(items: HeatmapAxisItem[]): HeatmapAxisItem[] {
    return items.map((item, index) => ({
        ...item,
        label: `S${index + 1}`,
    }))
}

export function buildHeatmapSourceData(
    course: InstructorCourse,
    profiles: Dict<StudentProfile>,
    submissions: CourseSubmission[],
    lists: InstructorList[],
    abstractProblems: Dict<AbstractProblem>,
): HeatmapSourceData {
    return {
        submissions,
        students: withStudentLabels(buildStudentRows(course, profiles, submissions)),
        problemColumns: buildProblemColumns(lists, abstractProblems),
        listColumns: buildListColumns(lists),
    }
}
