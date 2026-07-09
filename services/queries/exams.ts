import { cache } from 'react'

import { buildExamDetail, buildExamRow, type ExamDetail, type ExamRow } from '@/lib/exams'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

function normalizeExamKey(raw: string): string {
    return decodeURIComponent(raw.trim())
}

export const fetchExamsData = cache(async (client: JutgeApiClient): Promise<ExamRow[]> => {
    const examsMap = await client.student.exams.getAll()

    return Object.values(examsMap)
        .map((exam) => buildExamRow(exam))
        .sort((a, b) => b.exp_time_startMs - a.exp_time_startMs)
})

export const fetchExamDetail = cache(async (client: JutgeApiClient, examKey: string): Promise<ExamDetail | null> => {
    const normalizedExamKey = normalizeExamKey(examKey)

    try {
        const exam = await client.student.exams.get(normalizedExamKey)
        return buildExamDetail(exam)
    } catch {
        return null
    }
})
