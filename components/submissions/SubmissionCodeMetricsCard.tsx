import { InfoIcon } from 'lucide-react'
import Link from 'next/link'

import { Gauge } from '@/components/Gauge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
    CCN_GAUGE_INTERVALS,
    DOCUMENTATION_GAUGE_INTERVALS,
    HALSTEAD_DIFFICULTY_GAUGE_INTERVALS,
    MAINTAINABILITY_GAUGE_INTERVALS,
    RATIO_GAUGE_INTERVALS,
    type SubmissionCodeMetricsData,
} from '@/lib/codeMetrics'
import { cn } from '@/lib/utils'

type SubmissionCodeMetricsCardProps = {
    data: SubmissionCodeMetricsData
}

type MetricGaugeProps = {
    value: number
    minimum: number
    maximum: number
    tickInterval: number
    intervals: readonly { minimum: number; maximum: number; color: string }[]
    title?: string
    caption: string
    captionClassName?: string
}

function MetricGauge({
    value,
    minimum,
    maximum,
    tickInterval,
    intervals,
    title,
    caption,
    captionClassName,
}: MetricGaugeProps) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="border-none rounded-t-full p-2">
                <Gauge
                    value={value}
                    minimum={minimum}
                    maximum={maximum}
                    tickInterval={tickInterval}
                    intervals={[...intervals]}
                    size={150}
                    title={title}
                    textScale={1}
                    handleWidth={4}
                    strokeWidth={10}
                />
            </div>
            <p className={cn('max-w-24 text-center leading-snug text-muted-foreground', captionClassName)}>{caption}</p>
        </div>
    )
}

export function SubmissionCodeMetricsCard({ data }: SubmissionCodeMetricsCardProps) {
    return (
        <Card className="ring-0 border border-border shadow-sm">
            <CardHeader className="border-b border-border">
                <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-semibold">Code metrics</CardTitle>
                <CardAction>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon-sm" asChild>
                                <Link href="/documentation/code-metrics" aria-label="Code metrics documentation">
                                    <InfoIcon />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Learn about code metrics</TooltipContent>
                    </Tooltip>
                </CardAction>
            </CardHeader>
            <CardContent className="px-6 py-6">
                <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:gap-12">
                    <div className="min-w-0 shrink-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Metric</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                    <TableHead className="text-right">Ref</TableHead>
                                    <TableHead className="text-right">Ratio</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.rows.map((row) => (
                                    <TableRow key={row.metric}>
                                        <TableCell>{row.metric}</TableCell>
                                        <TableCell className="text-right tabular-nums">{row.value}</TableCell>
                                        <TableCell className="text-right tabular-nums">{row.ref}</TableCell>
                                        <TableCell className="text-right tabular-nums">{row.ratio}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-wrap items-start justify-center gap-x-2 gap-y-6 xl:justify-end">
                        <MetricGauge
                            value={data.cyclomaticComplexity}
                            minimum={0}
                            maximum={18}
                            tickInterval={3}
                            intervals={CCN_GAUGE_INTERVALS}
                            caption="cyclomatic complexity"
                        />
                        <MetricGauge
                            value={data.halsteadDifficulty}
                            minimum={0}
                            maximum={30}
                            tickInterval={5}
                            intervals={HALSTEAD_DIFFICULTY_GAUGE_INTERVALS}
                            caption="halstead difficulty"
                        />
                        <MetricGauge
                            value={data.maintainabilityIndex}
                            minimum={0}
                            maximum={100}
                            tickInterval={20}
                            intervals={MAINTAINABILITY_GAUGE_INTERVALS}
                            caption="maintainability index"
                        />
                        <MetricGauge
                            value={data.documentationIndex}
                            minimum={0}
                            maximum={100}
                            tickInterval={20}
                            intervals={DOCUMENTATION_GAUGE_INTERVALS}
                            caption="documentation index"
                        />

                        <div aria-hidden className="hidden w-6 shrink-0 xl:block" />

                        {data.ccnRatio !== null ? (
                            <MetricGauge
                                value={data.ccnRatio}
                                minimum={0}
                                maximum={3}
                                tickInterval={0.5}
                                intervals={RATIO_GAUGE_INTERVALS}
                                title="ccn"
                                caption="ccn ratio (complexity)"
                                captionClassName="font-semibold text-foreground"
                            />
                        ) : null}
                        {data.difRatio !== null ? (
                            <MetricGauge
                                value={data.difRatio}
                                minimum={0}
                                maximum={3}
                                tickInterval={0.5}
                                intervals={RATIO_GAUGE_INTERVALS}
                                title="dif"
                                caption="dif ratio (length)"
                                captionClassName="font-semibold text-foreground"
                            />
                        ) : null}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    TODO: The Api should report ref and ratio to add ratio gauges. We should also adjust the intervals
                </p>
            </CardContent>
        </Card>
    )
}
