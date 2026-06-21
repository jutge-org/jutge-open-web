'use client'

import { ChartPieIcon, TableIcon } from 'lucide-react'
import { capitalize } from 'radash'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, XAxis, YAxis } from 'recharts'
import {
    fetchAdminStatsCounters,
    fetchAdminStatsDistributionOfCompilers,
    fetchAdminStatsDistributionOfDomains,
    fetchAdminStatsDistributionOfProglangs,
    fetchAdminStatsDistributionOfSubmissionsByHour,
    fetchAdminStatsDistributionOfSubmissionsByWeekday,
    fetchAdminStatsDistributionOfSubmissionsByDay,
    fetchAdminStatsDistributionOfSubmissionsByYear,
    fetchAdminStatsDistributionOfUsersByCountry,
    fetchAdminStatsDistributionOfUsersBySubmissions,
    fetchAdminStatsDistributionOfUsersByYear,
    fetchAdminStatsDistributionOfVerdicts,
    fetchProblemPopularityBuckets,
} from '@/actions/administrator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { type Distribution, type ProblemPopularityBucketEntry } from '@/lib/jutge_api_client'
import { compilerColor, proglangColor, verdictColor } from '@/lib/statistics/colors'

export default function StatisticsView() {
    return (
        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            <Counters />
            <CompilersDistribution />
            <VerdictsDistribution />
            <ProglangsDistribution />
            <RegisteredUsersByYear />
            <DistributionOfUsersByCountry />
            <SubmissionsByYear />
            <SubmissionsByWeekDay />
            <SubmissionsByHour />
            <DistributionOfUsersBySubmissions />
            <DomainsDistribution />
            <ProblemPopularity />
        </div>
    )
}

function MyCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">{children}</CardContent>
        </Card>
    )
}

function Counters() {
    const [data, setData] = useState<Distribution | null>(null)

    async function update() {
        setData(await fetchAdminStatsCounters())
    }

    useEffect(() => {
        update()
    }, [])

    let table = Loading()
    if (data !== null) {
        table = (
            <Table className="">
                <TableBody>
                    {Object.entries(data).map(([key, value]) => (
                        <TableRow key={key}>
                            <TableCell> {capitalize(key)}</TableCell>
                            <TableCell className="text-end">{value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return MyCard({ title: 'Counters', children: table })
}

function CompilersDistribution() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfCompilers())
        }
        update()
    }, [])

    return MyCard({ title: 'Compilers distribution', children: MyPieChart(data, 'compilers') })
}

function VerdictsDistribution() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfVerdicts())
        }
        update()
    }, [])

    return MyCard({ title: 'Verdicts distribution', children: MyPieChart(data, 'verdicts') })
}

function ProglangsDistribution() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfProglangs())
        }
        update()
    }, [])

    return MyCard({ title: 'Programming languages distribution', children: MyPieChart(data, 'proglangs') })
}

function DistributionOfUsersByCountry() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfUsersByCountry())
        }
        update()
    }, [])

    return MyCard({ title: 'Users by country', children: MyPieChart(data) })
}

function SubmissionsByYear() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfSubmissionsByYear())
        }
        update()
    }, [])

    return MyCard({ title: 'Submissions by year', children: MyBarChart(data, CHART_THEME_COLORS[2], 'Submissions') })
}

function RegisteredUsersByYear() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfUsersByYear())
        }
        update()
    }, [])

    return MyCard({ title: 'Registered users by year', children: MyBarChart(data, CHART_THEME_COLORS[4], 'Users') })
}

function SubmissionsByWeekDay() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfSubmissionsByWeekday())
        }
        update()
    }, [])

    return MyCard({ title: 'Submissions by weekday', children: MyBarChart(data, CHART_THEME_COLORS[3], 'Submissions') })
}

function SubmissionsByDay() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfSubmissionsByDay())
        }
        update()
    }, [])

    return MyCard({ title: 'Submissions by day', children: MyBarChart(data) })
}

function SubmissionsByHour() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfSubmissionsByHour())
        }
        update()
    }, [])

    return MyCard({ title: 'Submissions by hour', children: MyBarChart(data, CHART_THEME_COLORS[1], 'Submissions') })
}

function DistributionOfUsersBySubmissions() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfUsersBySubmissions(100))
        }
        update()
    }, [])

    return MyCard({ title: 'Users by submissions', children: MyBarChart(data, CHART_THEME_COLORS[5], 'Users') })
}

function DomainsDistribution() {
    const [data, setData] = useState<Distribution | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchAdminStatsDistributionOfDomains())
        }
        update()
    }, [])

    return MyCard({ title: 'Users by domain', children: MyPieChart(data) })
}

function ProblemPopularity() {
    const [data, setData] = useState<ProblemPopularityBucketEntry[] | null>(null)

    useEffect(() => {
        async function update() {
            setData(await fetchProblemPopularityBuckets())
        }
        update()
    }, [])

    return MyCard({ title: 'Problem Popularity', children: ProblemPopularityBarChart(data) })
}

//

function ProblemPopularityBarChart(data: ProblemPopularityBucketEntry[] | null) {
    if (data === null) return Loading()

    const chartData = [...data]
        .sort((a, b) => a.log2_bucket - b.log2_bucket)
        .map((entry) => ({
            bucketLabel: `2^${entry.log2_bucket}`,
            value: entry.problem_count,
            bucketMin: entry.bucket_min,
            bucketMax: entry.bucket_max,
        }))

    const chartConfig = {
        value: {
            label: 'Problems',
            color: CHART_THEME_COLORS[2],
        },
    } satisfies ChartConfig

    return (
        <ChartContainer config={chartConfig} className="min-h-[320px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ left: 8, right: 8, bottom: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="bucketLabel"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={70}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            hideLabel
                            formatter={(value, _name, tooltipItem) => {
                                const row = tooltipItem?.payload as {
                                    bucketMin: number
                                    bucketMax: number
                                }
                                return (
                                    <div className="space-y-1">
                                        <div>
                                            Submissions ∈ [{row.bucketMin}, {row.bucketMax})
                                        </div>
                                        <div className="font-medium">Problems: {value}</div>
                                    </div>
                                )
                            }}
                        />
                    }
                />
                <Bar dataKey="value" fill="var(--color-value)" radius={2} name="Problems" />
            </BarChart>
        </ChartContainer>
    )
}

function MyBarChart(data: Distribution | null, color: string = CHART_THEME_COLORS[1], label = 'Count') {
    if (data === null) return Loading()

    const chartData = Object.entries(data).map(([key, value]) => ({
        Day: key,
        value: value,
    }))

    const chartConfig = {
        value: {
            label,
            color,
        },
    } satisfies ChartConfig

    return (
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ left: 8, right: 8, bottom: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="Day" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={2} />
            </BarChart>
        </ChartContainer>
    )
}

type PieChartColorMode = 'default' | 'verdicts' | 'compilers' | 'proglangs'

function sliceColor(key: string, index: number, mode: PieChartColorMode): string {
    switch (mode) {
        case 'verdicts':
            return verdictColor(key)
        case 'compilers':
            return compilerColor(key)
        case 'proglangs':
            return proglangColor(key, index)
        default:
            return PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]!
    }
}

function MyPieChart(data: Distribution | null, colorMode: PieChartColorMode = 'default') {
    const [chartVisible, setChartVisible] = useState(true)

    if (data === null) return Loading()

    let total = 0
    for (const key of Object.keys(data)) {
        total += data[key]
    }
    for (const key of Object.keys(data)) {
        data[key] = Math.round((data[key] / total) * 1000) / 10
    }

    const minimum = 5

    const chartConfig: Record<string, { label: string; color: string }> = {
        value: {
            label: 'Percentage',
            color: 'var(--chart-1)',
        },
    }

    let colorIndex = 0
    let others = 0
    for (const key of Object.keys(data)) {
        if (data[key] < minimum) {
            others += data[key]
        } else {
            chartConfig[key] = {
                label: key,
                color: sliceColor(key, colorIndex++, colorMode),
            }
        }
    }

    const chartData = Object.entries(data)
        .filter(([, value]) => value > minimum)
        .map(([key, value]) => ({
            label: key,
            value,
            fill: chartConfig[key]!.color,
        }))
    if (others > 0) {
        chartData.push({
            label: 'Others',
            value: others,
            fill: OTHERS_SLICE_COLOR,
        })
        chartConfig.Others = {
            label: 'Others',
            color: OTHERS_SLICE_COLOR,
        }
    }

    const chart = (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-96 [&_.recharts-pie-label-text]:fill-neutral-800 [&_.recharts-pie-label-text]:stroke-white/90 [&_.recharts-pie-label-text]:stroke-[1.25px] dark:[&_.recharts-pie-label-text]:fill-neutral-100 dark:[&_.recharts-pie-label-text]:stroke-black/60"
        >
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                <Pie data={chartData} dataKey="value" stroke="var(--background)" strokeWidth={2}>
                    {chartData.map((entry) => (
                        <Cell key={entry.label} fill={entry.fill} />
                    ))}
                    <LabelList
                        dataKey="label"
                        className="fill-neutral-800 dark:fill-neutral-100"
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth={1.25}
                        fontSize={11}
                        formatter={(value) => chartConfig[String(value)]?.label}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    )

    const table = (
        <ScrollArea className="h-96 w-full">
            <Table>
                <TableBody>
                    {Object.entries(data)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell className="text-end">{value.toFixed(1)}%</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </ScrollArea>
    )

    return (
        <>
            {chartVisible ? chart : table}
            <ToggleGroup
                type="single"
                onValueChange={(value) => setChartVisible(value === 'pie')}
                className="mb-2"
                defaultValue="pie"
            >
                <ToggleGroupItem value={'pie'} aria-label="Toggle bold">
                    <ChartPieIcon className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value={'table'} aria-label="Toggle italic">
                    <TableIcon className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </>
    )
}

const CHART_THEME_COLORS = {
    1: 'var(--chart-1)',
    2: 'var(--chart-2)',
    3: 'var(--chart-3)',
    4: 'var(--chart-4)',
    5: 'var(--chart-5)',
} as const

const PIE_CHART_COLORS = Object.values(CHART_THEME_COLORS)

const OTHERS_SLICE_COLOR = 'var(--muted-foreground)'

function Loading() {
    return <Skeleton className="h-[400px] w-full" />
}
