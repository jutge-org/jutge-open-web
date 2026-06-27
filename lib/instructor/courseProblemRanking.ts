import type { Dict } from '@/lib/instructor/utils'
import { parseProblemKey } from '@/lib/problems'
import type {
    AbstractProblem,
    CourseSubmission,
    InstructorCourse,
    InstructorList,
} from '@/lib/jutge_api_client'

export type CourseProblemRankingRow = {
    rank: number
    problem_nm: string
    title: string
    ok: number
    ko: number
    sc: number
    nt: number
    totalSubmissions: number
    avgSubmissionsPerStudent: number
}

export function getAbstractProblemTitle(problem_nm: string, abstractProblems: Dict<AbstractProblem>): string {
    const abstractProblem = abstractProblems[problem_nm]
    if (!abstractProblem) return problem_nm

    const variants = Object.values(abstractProblem.problems)
    const canonical = variants.find((variant) => variant.translator === null) ?? variants[0]
    return canonical?.title ?? problem_nm
}

function problemNmFromSubmission(submission: CourseSubmission): string | null {
    const parsed = parseProblemKey(submission.problem_id)
    if (parsed.kind === 'problem_id' || parsed.kind === 'problem_nm') {
        return parsed.problem_nm
    }
    return null
}

function isProblemOk(submissions: CourseSubmission[]): boolean {
    return submissions.some((submission) => submission.verdict === 'AC')
}

function isProblemSc(submissions: CourseSubmission[]): boolean {
    if (submissions.length === 0) return false
    if (isProblemOk(submissions)) return false
    return submissions.some((submission) => submission.verdict === 'SC')
}

function isProblemKo(submissions: CourseSubmission[]): boolean {
    if (submissions.length === 0) return false
    if (isProblemOk(submissions)) return false
    if (isProblemSc(submissions)) return false
    return true
}

function collectAbstractProblemNames(lists: InstructorList[]): string[] {
    const seen = new Set<string>()
    const problemNms: string[] = []

    for (const list of lists) {
        for (const item of list.items) {
            if (!item.problem_nm || seen.has(item.problem_nm)) continue
            seen.add(item.problem_nm)
            problemNms.push(item.problem_nm)
        }
    }

    return problemNms
}

export function deriveCourseProblemRanking(
    course: InstructorCourse,
    lists: InstructorList[],
    submissions: CourseSubmission[],
    abstractProblems: Dict<AbstractProblem>,
): CourseProblemRankingRow[] {
    const problemNms = collectAbstractProblemNames(lists)
    const problemNmSet = new Set(problemNms)
    const submissionsByStudentProblem = new Map<string, CourseSubmission[]>()

    for (const submission of submissions) {
        const problem_nm = problemNmFromSubmission(submission)
        if (!problem_nm || !problemNmSet.has(problem_nm)) continue

        for (const studentKey of [submission.user_uid, submission.email]) {
            const key = `${studentKey}\0${problem_nm}`
            const bucket = submissionsByStudentProblem.get(key) ?? []
            bucket.push(submission)
            submissionsByStudentProblem.set(key, bucket)
        }
    }

    const uidByEmail = new Map<string, string>()
    for (const submission of submissions) {
        uidByEmail.set(submission.email, submission.user_uid)
    }

    const studentEmails = [...new Set([...course.students.enrolled, ...course.students.invited])]
    const studentCount = studentEmails.length

    const rows = problemNms.map((problem_nm) => {
        let ok = 0
        let ko = 0
        let sc = 0
        let nt = 0
        let totalSubmissions = 0

        for (const email of studentEmails) {
            const studentKey = uidByEmail.get(email) ?? email
            const problemSubmissions = submissionsByStudentProblem.get(`${studentKey}\0${problem_nm}`) ?? []
            totalSubmissions += problemSubmissions.length
            if (isProblemOk(problemSubmissions)) ok += 1
            else if (isProblemSc(problemSubmissions)) sc += 1
            else if (isProblemKo(problemSubmissions)) ko += 1
            else nt += 1
        }

        return {
            rank: 0,
            problem_nm,
            title: getAbstractProblemTitle(problem_nm, abstractProblems),
            ok,
            ko,
            sc,
            nt,
            totalSubmissions,
            avgSubmissionsPerStudent: studentCount > 0 ? totalSubmissions / studentCount : 0,
        }
    })

    rows.sort((left, right) => {
        if (right.ok !== left.ok) return right.ok - left.ok
        if (left.ko !== right.ko) return left.ko - right.ko
        const titleCompare = left.title.localeCompare(right.title)
        if (titleCompare !== 0) return titleCompare
        return left.problem_nm.localeCompare(right.problem_nm)
    })

    let rank = 0
    return rows.map((row, index) => {
        if (index === 0 || row.ok !== rows[index - 1]!.ok) {
            rank = index + 1
        }
        return { ...row, rank }
    })
}
