import type { ReadyExam } from '@/lib/jutge_api_client'

type ExamTimestamp = ReadyExam['exp_time_start']

export function parseExamTime(exp_time_start: ExamTimestamp): Date {
    if (typeof exp_time_start === 'number') return new Date(exp_time_start)
    return new Date(exp_time_start)
}

export function formatExamTime(exp_time_start: ExamTimestamp): string {
    return parseExamTime(exp_time_start).toLocaleString()
}

export function formatRunningTime(minutes: number): string {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainder = minutes % 60
    return remainder === 0 ? `${hours} h` : `${hours} h ${remainder} min`
}

export type ExamRow = {
    exam_key: string
    title: string
    place: string
    description: string
    exp_time_start: string
    exp_time_startMs: number
    running_time: string
    contest: boolean
}

export function buildExamRow(exam: ReadyExam): ExamRow {
    return {
        exam_key: exam.exam_key,
        title: exam.title,
        place: exam.place,
        description: exam.description,
        exp_time_start: formatExamTime(exam.exp_time_start),
        exp_time_startMs: parseExamTime(exam.exp_time_start).getTime(),
        running_time: formatRunningTime(exam.running_time),
        contest: exam.contest,
    }
}
