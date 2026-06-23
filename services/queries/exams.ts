import { buildExamRow, type ExamRow } from '@/lib/exams'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

export async function fetchExamsData(client: JutgeApiClient): Promise<ExamRow[]> {
    const exams = await client.student.exam.getReadyExams()
    return exams.map(buildExamRow).sort((a, b) => b.exp_time_startMs - a.exp_time_startMs)
}
