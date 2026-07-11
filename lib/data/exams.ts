import { getPreferredLanguageId } from '@/lib/data/auth'
import { buildExamDetail, buildExamRow, type ExamDetail, type ExamProblemRow, type ExamRow } from '@/lib/exams'
import { buildSubmissionRow, type LastSubmissionInfo } from '@/lib/submissions'
import type { AbstractProblem, JutgeApiClient } from '@/lib/jutge_api_client'

import {
    abstractProblemToRow,
    abstractProblemsToTitleMap,
    fetchLanguages,
    fetchStudentProblemStatuses,
} from './problems'
import { fetchLastSubmissionsByProblemNm } from './submissions'

function normalizeExamKey(raw: string): string {
    return decodeURIComponent(raw.trim())
}

export async function fetchExamsData(client: JutgeApiClient): Promise<ExamRow[]> {
    const examsMap = await client.student.exams.getAll()

    return Object.values(examsMap)
        .map((exam) => buildExamRow(exam))
        .sort((a, b) => b.exp_time_startMs - a.exp_time_startMs)
}

export async function fetchExamDetail(client: JutgeApiClient, examKey: string): Promise<ExamDetail | null> {
    const normalizedExamKey = normalizeExamKey(examKey)

    try {
        const exam = await client.student.exams.get(normalizedExamKey)
        const problemNms = exam.problems

        const [tables, abstractProblems, preferredLanguageId, languages, problemStatuses, lastSubmissionsByProblemNm] =
            await Promise.all([
                client.tables.get(),
                problemNms.length > 0
                    ? client.problems
                          .getAbstractProblems(problemNms.join(','))
                          .catch((): Record<string, AbstractProblem> => ({}))
                    : Promise.resolve<Record<string, AbstractProblem>>({}),
                getPreferredLanguageId(),
                fetchLanguages(),
                fetchStudentProblemStatuses(client),
                fetchLastSubmissionsByProblemNm(client),
            ])

        const problemTitles = abstractProblemsToTitleMap(abstractProblems, preferredLanguageId)
        const problems: ExamProblemRow[] = problemNms.map((problem_nm) => {
            const abstractProblem = abstractProblems[problem_nm]
            if (!abstractProblem) {
                return {
                    kind: 'problem' as const,
                    problem_nm,
                    title: problemTitles.get(problem_nm) ?? problem_nm,
                    language_ids: [],
                    driver_id: null,
                    author: null,
                    created_at: '',
                    updated_at: '',
                }
            }

            return { kind: 'problem' as const, ...abstractProblemToRow(abstractProblem, preferredLanguageId) }
        })

        const problemLastSubmissions = Object.fromEntries(
            problemNms.flatMap((problem_nm) => {
                const lastSubmission = lastSubmissionsByProblemNm.get(problem_nm)
                return lastSubmission ? [[problem_nm, lastSubmission] as const] : []
            }),
        ) as Record<string, LastSubmissionInfo>

        const submissions = exam.submissions.map((submission) => buildSubmissionRow(submission, tables, problemTitles))

        return buildExamDetail(exam, {
            problems,
            languages,
            problemStatuses,
            problemLastSubmissions,
            submissions,
        })
    } catch {
        return null
    }
}
