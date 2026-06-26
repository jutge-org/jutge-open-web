import type { Dict } from '@/lib/instructor/utils'
import { parseProblemKey } from '@/lib/problems'
import type { CourseSubmission, InstructorCourse, InstructorList, StudentProfile } from '@/lib/jutge_api_client'

export type CourseStudentRankingRow = {
    rank: number
    name: string
    email: string
    ok: number
    ko: number
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

function isProblemKo(submissions: CourseSubmission[]): boolean {
    if (submissions.length === 0) return false
    if (isProblemOk(submissions)) return false
    if (submissions.some((submission) => submission.verdict === 'SC')) return false
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

export function deriveCourseStudentRanking(
    course: InstructorCourse,
    profiles: Dict<StudentProfile>,
    lists: InstructorList[],
    submissions: CourseSubmission[],
): CourseStudentRankingRow[] {
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

    const emails = [...new Set([...course.students.enrolled, ...course.students.invited])]
    const rows = emails.map((email) => {
        const studentKey = uidByEmail.get(email) ?? email
        let ok = 0
        let ko = 0

        for (const problem_nm of problemNms) {
            const problemSubmissions = submissionsByStudentProblem.get(`${studentKey}\0${problem_nm}`) ?? []
            if (isProblemOk(problemSubmissions)) ok += 1
            else if (isProblemKo(problemSubmissions)) ko += 1
        }

        return {
            rank: 0,
            name: profiles[email]?.name?.trim() || '',
            email,
            ok,
            ko,
        }
    })

    rows.sort((left, right) => {
        if (right.ok !== left.ok) return right.ok - left.ok
        if (left.ko !== right.ko) return left.ko - right.ko
        const nameCompare = left.name.localeCompare(right.name)
        if (nameCompare !== 0) return nameCompare
        return left.email.localeCompare(right.email)
    })

    let rank = 0
    return rows.map((row, index) => {
        if (index === 0 || row.ok !== rows[index - 1]!.ok) {
            rank = index + 1
        }
        return { ...row, rank }
    })
}
