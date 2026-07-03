import { cache } from 'react'

import { buildExamDetail, buildExamRow, type ExamDetail, type ExamRow } from '@/lib/exams'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

function normalizeExamNm(raw: string): string {
    return decodeURIComponent(raw.trim())
}

export const fetchExamsData = cache(async (client: JutgeApiClient): Promise<ExamRow[]> => {
    const examsMap = await client.student.exams.getAll()

    return Object.entries(examsMap)
        .map(([exam_nm, exam]) => buildExamRow(exam_nm, exam))
        .sort((a, b) => b.exp_time_startMs - a.exp_time_startMs)
})

export const fetchExamDetail = cache(async (client: JutgeApiClient, exam_nm: string): Promise<ExamDetail | null> => {
    const normalizedExamNm = normalizeExamNm(exam_nm)

    try {
        const exam = await client.student.exams.get(normalizedExamNm)
        return buildExamDetail(normalizedExamNm, exam)
    } catch {
        return null
    }
})
