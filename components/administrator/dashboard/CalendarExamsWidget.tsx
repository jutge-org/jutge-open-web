'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import {
    mdiNumeric0Circle,
    mdiNumeric0CircleOutline,
    mdiNumeric1Circle,
    mdiNumeric1CircleOutline,
    mdiNumeric2Circle,
    mdiNumeric2CircleOutline,
    mdiNumeric3Circle,
    mdiNumeric3CircleOutline,
    mdiNumeric4Circle,
    mdiNumeric4CircleOutline,
    mdiNumeric5Circle,
    mdiNumeric5CircleOutline,
    mdiNumeric6Circle,
    mdiNumeric6CircleOutline,
    mdiNumeric7Circle,
    mdiNumeric7CircleOutline,
    mdiNumeric8Circle,
    mdiNumeric8CircleOutline,
    mdiNumeric9Circle,
    mdiNumeric9CircleOutline,
} from '@mdi/js'
import Icon from '@mdi/react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { CalendarRangeIcon } from 'lucide-react'
import { JSX, useEffect, useState } from 'react'
import { UpcomingExams } from '@/lib/jutge_api_client'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Widget from '@/components/administrator/dashboard/Widget'

dayjs.extend(isoWeek)

export default function CalendarExamsWidget() {
    const { client } = useJutgeAuth()
    //

    const [exams, setExams] = useState<UpcomingExams | null>(null)

    async function fetchData() {
    const { client } = useJutgeAuth()

        setExams(await client.admin.dashboard.getUpcomingExams({ daysBefore: 31, daysAfter: 31 }))
    }

    useEffect(() => {
        void fetchData()
        const interval = setInterval(fetchData, 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const table = init_table(exams)
    const today = dayjs()

    const content = (
        <div className="w-full mx-1 grid grid-rows-5 gap-1 mb-2">
            {seq(5).map((i) => (
                <div key={i} className="grid grid-cols-7 gap-1">
                    {seq(7).map((j) => (
                        <Popover key={j}>
                            <PopoverTrigger asChild>
                                <div
                                    className={cn(
                                        'border-r border-b rounded-sm text-sm',
                                        table[i][j].date.isSame(today, 'day') ? 'border border-primary' : '',
                                        table[i][j].date.isBefore(today, 'day') ? 'text-gray-400' : '',
                                        table[i][j].date.isoWeekday() >= 6 ? 'no-border-red-100' : '',
                                        table[i][j].exams + table[i][j].contests > 0
                                            ? 'hover:bg-gray-100 cursor-pointer'
                                            : '',
                                    )}
                                >
                                    <div className="flex flex-col gap-1 text-xs">
                                        <div
                                            className={cn(
                                                'px-1 line-clamp-1',
                                                table[i][j].date.isSame(today, 'day') ? 'text-primary' : '',
                                            )}
                                        >
                                            {table[i][j].date.format(table[i][j].date.date() === 1 ? 'D MMM' : 'D')}
                                        </div>
                                        {table[i][j].exams + table[i][j].contests > 0 && (
                                            <div
                                                className={cn(
                                                    'flex flex-row gap-0 px-0',
                                                    table[i][j].date.isSame(today, 'day')
                                                        ? 'text-primary font-bold'
                                                        : '',
                                                )}
                                            >
                                                <div className="flex-grow" />
                                                <NumericValueOutline value={table[i][j].exams} />
                                                <NumericValue value={table[i][j].contests} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </PopoverTrigger>
                            {table[i][j].info && (
                                <PopoverContent className="w-96 shadow-xl">{table[i][j].info}</PopoverContent>
                            )}
                        </Popover>
                    ))}
                </div>
            ))}
        </div>
    )

    return <Widget icon=<CalendarRangeIcon size={18} /> title="Exams and contests" content={content} />
}

function count(exams: UpcomingExams, period: 'day' | 'week' | 'month'): string {
    const now = dayjs()
    const filteredExams = exams.filter((exam) => dayjs(exam.exp_time_start).isSame(now, period))
    const length = filteredExams.length
    const students = filteredExams.reduce((acc, exam) => acc + exam.students, 0)
    return `${length} (${students})`
}

function seq(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i)
}

export interface Entry {
    date: dayjs.Dayjs
    exams: number
    contests: number
    students: number
    info: JSX.Element | null
}

function init_table(exams: UpcomingExams | null): Entry[][] {
    const table = seq(5).map((i) =>
        seq(7).map((j) => ({
            date: dayjs(),
            exams: 0,
            contests: 0,
            students: 0,
            info: null as JSX.Element | null,
        })),
    )

    const today = dayjs()
    const startOfWeek = today.startOf('isoWeek')
    const oneWeekBefore = startOfWeek.subtract(1, 'week')

    let day = oneWeekBefore
    for (let w = 0; w < 5; w++) {
        for (let d = 0; d < 7; d++) {
            const filteredExams = exams
                ? exams
                      .filter((exam) => dayjs(exam.exp_time_start).isSame(day, 'day') && exam.contest == 0)
                      .sort((a, b) => dayjs(a.exp_time_start).unix() - dayjs(b.exp_time_start).unix())
                : []
            const filteredContests = exams
                ? exams
                      .filter((exam) => dayjs(exam.exp_time_start).isSame(day, 'day') && exam.contest > 0)
                      .sort((a, b) => dayjs(a.exp_time_start).unix() - dayjs(b.exp_time_start).unix())
                : []
            table[w][d] = {
                date: day,
                exams: filteredExams.length,
                contests: filteredContests.length,
                students: filteredExams.reduce((acc, exam) => acc + exam.students, 0),
                info:
                    filteredExams.length + filteredContests.length === 0 ? null : (
                        <div className="flex flex-col gap-2">
                            {filteredExams.concat(filteredContests).map((exam) => (
                                <div key={exam.exam_nm} className="text-sm line-clamp-1">
                                    <span className="">{exam.title}</span>
                                    <br />
                                    <span className="text-xs text-gray-500 line-clamp-1">
                                        {dayjs(exam.exp_time_start).format('DD/MM/YYYY HH:mm')} {''}({exam.students}){' '}
                                        {exam.name}
                                        {exam.contest ? ' [Contest]' : ' [Exam]'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
            }
            day = day.add(1, 'day')
        }
    }

    return table
}

function NumericValue({ value }: { value: number }) {
    if (value == 0) return null
    const size = 0.8
    const className = 'text-gray-600'
    const paths = [
        mdiNumeric0Circle,
        mdiNumeric1Circle,
        mdiNumeric2Circle,
        mdiNumeric3Circle,
        mdiNumeric4Circle,
        mdiNumeric5Circle,
        mdiNumeric6Circle,
        mdiNumeric7Circle,
        mdiNumeric8Circle,
        mdiNumeric9Circle,
    ]
    const path = paths[Math.min(value, paths.length - 1)]
    return <Icon path={path} size={size} className={className} />
}

function NumericValueOutline({ value }: { value: number }) {
    if (value == 0) return null
    const size = 0.8
    const className = 'text-gray-600'
    const paths = [
        mdiNumeric0CircleOutline,
        mdiNumeric1CircleOutline,
        mdiNumeric2CircleOutline,
        mdiNumeric3CircleOutline,
        mdiNumeric4CircleOutline,
        mdiNumeric5CircleOutline,
        mdiNumeric6CircleOutline,
        mdiNumeric7CircleOutline,
        mdiNumeric8CircleOutline,
        mdiNumeric9CircleOutline,
    ]
    const path = paths[Math.min(value, paths.length - 1)]
    return <Icon path={path} size={size} className={className} />
}
