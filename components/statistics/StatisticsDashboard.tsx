'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Cell, Legend, Line, LineChart, Pie, PieChart, Bar, BarChart, XAxis, YAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { SolvedProblemsCard } from '@/components/statistics/SolvedProblemsCard'
import { StatisticsSummaryCards } from '@/components/statistics/StatisticsSummaryCards'
import { SubmissionCalendar } from '@/components/statistics/SubmissionCalendar'
import { buildHeatmapWeekGrid } from '@/lib/statistics/heatmap'
import {
    buildAcceptedProblemsSeries,
    buildAccuracySeries,
    buildActivityIntervals,
    buildRecentSubmissions,
    buildSubmissionSeries,
    dashboardSummary,
    distributionToSlices,
    hourDistributionToBars,
    weekdayDistributionToBars,
} from '@/lib/statistics/data'
import type { StatisticsData } from '@/lib/data/statistics'

type StatisticsDashboardProps = {
    data: StatisticsData | null
}

function WidgetSpinner({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center justify-center py-8', className)}>
            <Spinner className="size-8 text-muted-foreground" />
        </div>
    )
}

function PanelCard({
    title,
    children,
    className,
    loading,
}: {
    title: string
    children?: ReactNode
    className?: string
    loading?: boolean
}) {
    return (
        <Card className={cn('gap-4 rounded-2xl border border-border shadow-sm', className)}>
            <CardHeader className="">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>{loading ? <WidgetSpinner /> : children}</CardContent>
        </Card>
    )
}

function StatisticsDashboardLoading() {
    return (
        <div className="flex flex-col gap-6">
            <StatisticsSummaryCards summary={null} />

            <section className="grid gap-4 xl:grid-cols-3">
                <PanelCard title="Verdict distribution" loading />
                <PanelCard title="Problems along time" loading />
                <PanelCard title="Submissions along time" loading />
            </section>

            <PanelCard title="Submission calendar" loading />

            <section className="grid gap-4 lg:grid-cols-2">
                <PanelCard title="Accepted / rejected submissions" loading />
                <PanelCard title="Recent submissions" loading />
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
                <PanelCard title="Language distribution" loading />
                <PanelCard title="Compiler distribution" loading />
                <PanelCard title="Accuracy along time" loading />
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <PanelCard title="Submissions by hour of the day" loading />
                <PanelCard title="Submissions by day of week" loading />
            </section>

            <SolvedProblemsCard problems={[]} loading />
        </div>
    )
}

export function StatisticsDashboard({ data }: StatisticsDashboardProps) {
    if (!data) {
        return <StatisticsDashboardLoading />
    }

    const { dashboard, level, tables, hexColors, submissions, solvedProblems } = data
    const summary = dashboardSummary(dashboard, level)
    const verdictSlices = distributionToSlices(dashboard.distributions.verdicts, tables, hexColors, 'verdicts')
    const languageSlices = distributionToSlices(dashboard.distributions.proglangs, tables, hexColors, 'proglangs')
    const compilerSlices = distributionToSlices(dashboard.distributions.compilers, tables, hexColors, 'compilers')
    const hourBars = hourDistributionToBars(dashboard.distributions.submissions_by_hour)
    const weekdayBars = weekdayDistributionToBars(dashboard.distributions.submissions_by_weekday)
    const heatmap = buildHeatmapWeekGrid(dashboard.heatmap)
    const activity = buildActivityIntervals(submissions)
    const recent = buildRecentSubmissions(submissions, tables, hexColors)
    const acceptedSeries = buildAcceptedProblemsSeries(submissions)
    const submissionSeries = buildSubmissionSeries(submissions)
    const accuracySeries = buildAccuracySeries(submissions)

    const verdictChartConfig = Object.fromEntries(
        verdictSlices.map((slice) => [slice.key, { label: slice.label, color: slice.color }]),
    )
    const languageChartConfig = Object.fromEntries(
        languageSlices.map((slice) => [slice.key, { label: slice.label, color: slice.color }]),
    )
    const compilerChartConfig = Object.fromEntries(
        compilerSlices.map((slice) => [slice.key, { label: slice.label, color: slice.color }]),
    )

    return (
        <div className="flex flex-col gap-6">
            <StatisticsSummaryCards summary={summary} />

            <section className="grid gap-4 xl:grid-cols-3">
                <PanelCard title="Verdict distribution">
                    {verdictSlices.length > 0 ? (
                        <ChartContainer config={verdictChartConfig} className="mx-auto aspect-square max-h-72 w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={verdictSlices}
                                    dataKey="count"
                                    nameKey="key"
                                    innerRadius="45%"
                                    strokeWidth={2}
                                >
                                    {verdictSlices.map((slice) => (
                                        <Cell key={slice.key} fill={slice.color} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ChartContainer>
                    ) : (
                        <p className="text-sm text-muted-foreground">No submissions yet.</p>
                    )}
                </PanelCard>

                <PanelCard title="Problems along time">
                    {acceptedSeries.length > 0 ? (
                        <ChartContainer
                            config={{ value: { label: 'Accepted problems', color: 'var(--color-chart-2)' } }}
                            className="aspect-[4/3] w-full"
                        >
                            <LineChart data={acceptedSeries} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                                <XAxis dataKey="year" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} width={36} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--color-chart-2)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    ) : (
                        <p className="text-sm text-muted-foreground">No accepted problems yet.</p>
                    )}
                </PanelCard>

                <PanelCard title="Submissions along time">
                    {submissionSeries.length > 0 ? (
                        <ChartContainer
                            config={{
                                accepted: { label: 'Accepted', color: 'var(--color-chart-2)' },
                                rejected: { label: 'Rejected', color: 'var(--color-chart-5)' },
                                total: { label: 'Total', color: 'var(--color-chart-1)' },
                            }}
                            className="aspect-[4/3] w-full"
                        >
                            <LineChart data={submissionSeries} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                                <XAxis dataKey="year" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} width={36} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="accepted"
                                    stroke="var(--color-chart-2)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rejected"
                                    stroke="var(--color-chart-5)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="var(--color-chart-1)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Legend />
                            </LineChart>
                        </ChartContainer>
                    ) : (
                        <p className="text-sm text-muted-foreground">No submissions yet.</p>
                    )}
                </PanelCard>
            </section>

            <PanelCard title="Submission calendar">
                <SubmissionCalendar heatmap={heatmap} />
            </PanelCard>

            <section className="grid gap-4 lg:grid-cols-2">
                <PanelCard title="Accepted / rejected submissions">
                    <Table>
                        <TableBody>
                            {activity.map((row) => (
                                <TableRow key={row.label}>
                                    <TableCell className="text-muted-foreground">{row.label}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                                                {row.accepted}
                                            </Badge>
                                            <Badge variant="destructive">{row.rejected}</Badge>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </PanelCard>

                <PanelCard title="Recent submissions">
                    {recent.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10" />
                                    <TableHead>ID</TableHead>
                                    <TableHead>Problem</TableHead>
                                    <TableHead className="text-right">When</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recent.map((row) => (
                                    <TableRow key={row.rowKey}>
                                        <TableCell>
                                            <span
                                                className="inline-block size-2.5 rounded-full"
                                                style={{ backgroundColor: row.verdictColor }}
                                                title={row.verdict}
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{row.submission_id}</TableCell>
                                        <TableCell>
                                            <Link href={row.problemHref} className="hover:text-primary hover:underline">
                                                {row.problemLabel}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                            {row.ago}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground">No recent submissions.</p>
                    )}
                </PanelCard>
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
                <PanelCard title="Language distribution">
                    {languageSlices.length > 0 ? (
                        <ChartContainer config={languageChartConfig} className="mx-auto aspect-square max-h-72 w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={languageSlices}
                                    dataKey="count"
                                    nameKey="label"
                                    innerRadius="45%"
                                    strokeWidth={2}
                                >
                                    {languageSlices.map((slice) => (
                                        <Cell key={slice.key} fill={slice.color} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ChartContainer>
                    ) : (
                        <p className="text-sm text-muted-foreground">No language data yet.</p>
                    )}
                </PanelCard>

                <PanelCard title="Compiler distribution">
                    {compilerSlices.length > 0 ? (
                        <ChartContainer config={compilerChartConfig} className="mx-auto aspect-square max-h-72 w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={compilerSlices}
                                    dataKey="count"
                                    nameKey="key"
                                    innerRadius="45%"
                                    strokeWidth={2}
                                >
                                    {compilerSlices.map((slice) => (
                                        <Cell key={slice.key} fill={slice.color} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ChartContainer>
                    ) : (
                        <p className="text-sm text-muted-foreground">No compiler data yet.</p>
                    )}
                </PanelCard>

                <PanelCard title="Accuracy along time">
                    {accuracySeries.length > 0 ? (
                        <ChartContainer
                            config={{ accuracy: { label: 'Accuracy %', color: 'var(--color-chart-4)' } }}
                            className="aspect-[4/3] w-full"
                        >
                            <LineChart data={accuracySeries} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                                <XAxis dataKey="year" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} width={36} domain={[0, 100]} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="accuracy"
                                    stroke="var(--color-chart-4)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    ) : (
                        <p className="text-sm text-muted-foreground">No accuracy data yet.</p>
                    )}
                </PanelCard>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <PanelCard title="Submissions by hour of the day">
                    <ChartContainer
                        config={{ count: { label: 'Submissions', color: 'var(--color-chart-1)' } }}
                        className="aspect-[5/3] w-full"
                    >
                        <BarChart data={hourBars} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                            <XAxis dataKey="hour" tickLine={false} axisLine={false} interval={2} />
                            <YAxis tickLine={false} axisLine={false} width={28} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-chart-1)" radius={2} />
                        </BarChart>
                    </ChartContainer>
                </PanelCard>

                <PanelCard title="Submissions by day of week">
                    <ChartContainer
                        config={{ count: { label: 'Submissions', color: 'var(--color-chart-3)' } }}
                        className="aspect-[5/3] w-full"
                    >
                        <BarChart data={weekdayBars} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                            <XAxis dataKey="label" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} width={28} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-chart-3)" radius={2} />
                        </BarChart>
                    </ChartContainer>
                </PanelCard>
            </section>

            <SolvedProblemsCard problems={solvedProblems} />
        </div>
    )
}
