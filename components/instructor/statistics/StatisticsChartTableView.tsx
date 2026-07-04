'use client'

import { StatisticsSaveButtonGroup } from '@/components/instructor/statistics/StatisticsSaveButtonGroup'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { saveStatisticsCsv, saveStatisticsSvg } from '@/lib/saveStatisticsExport'
import { cn } from '@/lib/utils'
import { BarChart3Icon, TableIcon, type LucideIcon } from 'lucide-react'
import { useRef, useState } from 'react'

type StatisticsChartTableViewProps = {
    exportFileName: string
    csvRecords: Record<string, unknown>[]
    hasData: boolean
    table: React.ReactNode
    children: React.ReactNode
    chartHiddenHeight?: number
    chartHiddenWidth?: number
    chartToggleIcon?: LucideIcon
    showChartLabel?: string
}

export function StatisticsChartTableView({
    exportFileName,
    csvRecords,
    hasData,
    table,
    children,
    chartHiddenHeight = 260,
    chartHiddenWidth = 480,
    chartToggleIcon: ChartToggleIcon = BarChart3Icon,
    showChartLabel = 'chart',
}: StatisticsChartTableViewProps) {
    const [chartVisible, setChartVisible] = useState(true)
    const chartContainerRef = useRef<HTMLDivElement>(null)

    async function saveSvgHandle() {
        const svg = chartContainerRef.current?.querySelector('svg')
        await saveStatisticsSvg(svg, `${exportFileName}.svg`)
    }

    async function saveCsvHandle() {
        await saveStatisticsCsv(csvRecords, `${exportFileName}.csv`)
    }

    return (
        <>
            <div
                className={cn(
                    !chartVisible &&
                        'pointer-events-none fixed top-0 left-[-9999px] overflow-hidden opacity-0',
                )}
                style={!chartVisible ? { width: chartHiddenWidth, height: chartHiddenHeight } : undefined}
                aria-hidden={!chartVisible}
            >
                <div ref={chartContainerRef}>{children}</div>
            </div>
            <div className={cn(chartVisible && 'hidden')}>{table}</div>
            <TooltipProvider>
                <div className="mb-2 flex items-center justify-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                variant="outline"
                                className="size-8"
                                pressed={!chartVisible}
                                onPressedChange={(pressed) => setChartVisible(!pressed)}
                                aria-label={chartVisible ? 'Show table' : `Show ${showChartLabel}`}
                            >
                                {chartVisible ? (
                                    <ChartToggleIcon className="size-4" aria-hidden />
                                ) : (
                                    <TableIcon className="size-4" aria-hidden />
                                )}
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            {chartVisible ? 'Show table' : `Show ${showChartLabel}`}
                        </TooltipContent>
                    </Tooltip>
                    <StatisticsSaveButtonGroup
                        onSaveSvg={saveSvgHandle}
                        onSaveCsv={saveCsvHandle}
                        disabled={!hasData}
                    />
                </div>
            </TooltipProvider>
        </>
    )
}
