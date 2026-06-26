'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { getCategoryColor, type VolumeOverTimePoint } from '@/lib/instructor/courseSubmissionStatistics'
import type { ColorMapping } from '@/lib/jutge_api_client'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

type SubmissionVolumeAreaChartProps = {
    data: VolumeOverTimePoint[]
    colors: ColorMapping
}

export function SubmissionVolumeAreaChart({ data, colors }: SubmissionVolumeAreaChartProps) {
    const chartConfig = {
        label: { label: 'Period', color: 'hsl(var(--muted-foreground))' },
        ok: {
            label: 'OK (AC)',
            color: getCategoryColor('OK', 'statuses', colors),
        },
        ko: {
            label: 'KO',
            color: getCategoryColor('KO', 'statuses', colors),
        },
    }
    const formatCount = (value: unknown) => [String(value), 'Submissions'] as [string, string]
    if (data.length === 0) {
        return (
            <div className="flex h-[260px] w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                No submission data
            </div>
        )
    }
    return (
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={formatCount}
                            labelFormatter={(_, payload) => {
                                const p = payload?.[0]?.payload as VolumeOverTimePoint | undefined
                                return p?.label ?? ''
                            }}
                        />
                    }
                />
                <Area
                    type="monotone"
                    dataKey="ok"
                    stackId="a"
                    stroke="var(--color-ok)"
                    fill="var(--color-ok)"
                    fillOpacity={0.6}
                    name="OK (AC)"
                />
                <Area
                    type="monotone"
                    dataKey="ko"
                    stackId="a"
                    stroke="var(--color-ko)"
                    fill="var(--color-ko)"
                    fillOpacity={0.6}
                    name="KO"
                />
            </AreaChart>
        </ChartContainer>
    )
}
