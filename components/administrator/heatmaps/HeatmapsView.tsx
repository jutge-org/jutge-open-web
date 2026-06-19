'use client'

import dayjs, { Dayjs } from 'dayjs'
import { fetchAdminHeatmapCalendar } from '@/actions/administrator'
import { ReactNode, useEffect, useState } from 'react'
import type { HeatmapCalendar } from '@/lib/jutge_api_client'
import { Skeleton } from '@/components/ui/skeleton'

export default function HeatmapsView() {
    return (
        <div className="pt-2 flex flex-col gap-4">
            <HeatmapWidget title="Latest month" start={dayjs().subtract(1, 'month')} end={dayjs()} sizeFactor={2} />
            <HeatmapWidget title="2026" start={dayjs('2026-01-01')} end={dayjs()} />
            <HeatmapWidget title="2025" start={dayjs('2025-01-01')} end={dayjs('2026-01-01')} />
            <HeatmapWidget title="2024" start={dayjs('2024-01-01')} end={dayjs('2025-01-01')} />
            <HeatmapWidget title="2023" start={dayjs('2023-01-01')} end={dayjs('2024-01-01')} />
            <HeatmapWidget title="2022" start={dayjs('2022-01-01')} end={dayjs('2023-01-01')} />
            <HeatmapWidget title="2021" start={dayjs('2021-01-01')} end={dayjs('2022-01-01')} />
        </div>
    )
}

interface HeatmapWidgetProps {
    title: string
    start: Dayjs
    end: Dayjs
    sizeFactor?: number
}

function HeatmapWidget(props: HeatmapWidgetProps) {
    const [data, setData] = useState<HeatmapCalendar | null>(null)

    useEffect(() => {
        async function fetchData() {
            const data = await fetchAdminHeatmapCalendar({
                start: props.start.toISOString(),
                end: props.end.toISOString(),
            })
            setData(data)
        }

        fetchData()
    }, [props.start, props.end])

    return (
        <div className="border rounded-lg pl-2 pt-2 px-4">
            <h2 className="font-bold">{props.title}</h2>
            {data === null ? (
                <div className="p-4 flex flex-row gap-1">
                    <Skeleton className="w-[100px] h-[200px] rounded-lg" />
                    <Skeleton className="w-[100px] h-[200px] rounded-lg" />
                    <Skeleton className="w-[100px] h-[200px] rounded-lg" />
                    <Skeleton className="w-[100px] h-[200px] rounded-lg" />
                    <Skeleton className="w-[100px] h-[200px] rounded-lg" />
                    <Skeleton className="w-[100px] h-[200px] rounded-lg" />
                </div>
            ) : (
                <Heatmap data={data} start={props.start} end={props.end} sizeFactor={props.sizeFactor} />
            )}
        </div>
    )
}

export interface HeatmapProps {
    data: HeatmapCalendar
    start: Dayjs
    end: Dayjs
    sizeFactor?: number
}

function Heatmap(props: HeatmapProps) {
    //
    const sizeFactor = props.sizeFactor || 1
    const width = 10 * sizeFactor
    const height = 10 * sizeFactor
    const top = 52

    const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
    const days = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')

    const maxValue = 12000 // reasonable arbitrary value to get all colors in the same scale
    const cal: Record<string, number> = {}

    for (const item of props.data) {
        const d = dayjs.unix(item.date)
        if (d.isAfter(props.start) && d.isBefore(props.end)) {
            cal[d.format('YYYY-MM-DD')] = item.value
        }
    }

    const shapes: ReactNode[] = []

    // draw days of week
    for (let dow = 0; dow < 7; dow++) {
        const label = (
            <text
                key={random()}
                x={4 * width}
                y={(dow + 0.5) * (height + 4) + top}
                fill="currentColor"
                fontSize="12"
                textAnchor="end"
                dominantBaseline="middle"
            >
                {days[dow]}
            </text>
        )
        shapes.push(label)
    }

    // draw boxes
    let isFirstMonth = true
    let isFirstYear = true
    let week = 4
    for (let day = props.start; day.isBefore(props.end); day = day.add(1, 'day')) {
        const key = day.format('YYYY-MM-DD')
        const value = cal[key] || 0
        const dow = day.day()

        if (isFirstMonth || day.date() == 1) {
            week += 0.5
            const label = (
                <text key={random()} x={week * (width + 4)} y={top - 10} fill="currentColor" fontSize="12">
                    {months[day.month()]}
                </text>
            )
            shapes.push(label)
            isFirstMonth = false
        }
        if (isFirstYear || (day.date() == 1 && day.month() == 0)) {
            const label = (
                <text key={random()} x={week * (width + 4)} y={top - 24} fill="currentColor" fontSize="12">
                    {day.year()}
                </text>
            )
            shapes.push(label)
            isFirstYear = false
        }

        const x = week * (width + 4)
        const y = dow * (height + 4) + top
        const col = color(value, maxValue)
        const rect = (
            <rect
                key={random()}
                x={x + 0.5}
                y={y + 0.5}
                width={width}
                height={height}
                stroke={col}
                strokeWidth="1"
                fill={col}
                rx="2"
            >
                <title>{`${key}: ${value}`}</title>
            </rect>
        )
        shapes.push(rect)

        if (dow === 6) week++
    }

    // final element
    return (
        <div className="w-full overflow-x-auto">
            <svg width={(week + 2) * (width + 4)} height={8 * (height + 4) + top}>
                {shapes}
            </svg>
        </div>
    )
}

function color(value: number, maxValue: number) {
    const hue = (1 - value / maxValue) * 50
    return `hsl(${hue}, 100%, 50%)`
}

function random() {
    return Math.random().toString(36).substring(7)
}
