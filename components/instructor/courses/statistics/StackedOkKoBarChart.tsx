'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { getCategoryColor, type OkKoPoint } from '@/lib/instructor/courseSubmissionStatistics'
import type { ColorMapping } from '@/lib/jutge_api_client'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

type StackedOkKoBarChartProps = {
    data: OkKoPoint[]
    colors: ColorMapping
}

export function StackedOkKoBarChart({ data, colors }: StackedOkKoBarChartProps) {
    const chartConfig = {
        ok: { label: 'OK', color: getCategoryColor('OK', 'statuses', colors) },
        ko: { label: 'KO', color: getCategoryColor('KO', 'statuses', colors) },
    }
    return (
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="ko" fill="var(--color-ko)" radius={[0, 0, 4, 4]} stackId="a" />
                <Bar dataKey="ok" fill="var(--color-ok)" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
        </ChartContainer>
    )
}
