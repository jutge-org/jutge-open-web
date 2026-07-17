'use client'

import { useCallback, useEffect, useState } from 'react'

import { HomeDaySubmissions } from '@/components/general/HomeDaySubmissions'
import { SUMMARY_METRICS } from '@/components/statistics/StatisticsSummaryCards'
import { SubmissionCalendar, SUBMISSION_CALENDAR_HEIGHT_PX } from '@/components/statistics/SubmissionCalendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { fetchDashboardOverview, type DashboardOverview } from '@/lib/data/statistics'
import { fetchSubmissionsForDay } from '@/lib/data/submissions'
import jutge from '@/lib/jutge'
import { dashboardSummary, type DashboardSummary } from '@/lib/statistics/data'
import { buildHeatmapWeekGrid } from '@/lib/statistics/heatmap'
import type { SubmissionRow } from '@/lib/submissions'
import { cn } from '@/lib/utils'

export function HomeActivityStats() {
    const [overview, setOverview] = useState<DashboardOverview | null>(null)
    const [failed, setFailed] = useState(false)
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    // Submissions of the selected day, fetched per day via student.submissions.getRange.
    const [dayRows, setDayRows] = useState<SubmissionRow[] | null>(null)

    useEffect(() => {
        let active = true
        void fetchDashboardOverview(jutge)
            .then((data) => {
                if (active) setOverview(data)
            })
            .catch(() => {
                if (active) setFailed(true)
            })
        return () => {
            active = false
        }
    }, [])

    // Ask for just the selected day, so opening a day never pulls the whole history.
    useEffect(() => {
        if (selectedDay === null) {
            return
        }

        let active = true
        setDayRows(null)
        void fetchSubmissionsForDay(jutge, selectedDay)
            .then((rows) => {
                if (active) setDayRows(rows)
            })
            .catch(() => {
                if (active) setDayRows([])
            })
        return () => {
            active = false
        }
    }, [selectedDay])

    const toggleDay = useCallback((dateTs: number) => {
        setSelectedDay((current) => (current === dateTs ? null : dateTs))
    }, [])

    if (failed) {
        return null
    }

    const summary = overview ? dashboardSummary(overview.dashboard, overview.level) : null
    const heatmap = overview ? buildHeatmapWeekGrid(overview.dashboard.heatmap) : null

    return (
        <div className="grid gap-4 lg:grid-cols-5">
            <Card className="gap-4 rounded-2xl border border-border shadow-sm lg:col-span-3">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Submission calendar</CardTitle>
                </CardHeader>
                <CardContent>
                    {heatmap === null ? (
                        <div
                            aria-busy="true"
                            aria-label="Loading submission calendar"
                            className="flex items-center justify-center"
                            // Same height as the loaded calendar, so the card never resizes.
                            style={{ height: SUBMISSION_CALENDAR_HEIGHT_PX }}
                        >
                            <Spinner className="size-8 text-muted-foreground" />
                        </div>
                    ) : (
                        <SubmissionCalendar heatmap={heatmap} selectedDay={selectedDay} onSelectDay={toggleDay} />
                    )}
                </CardContent>
            </Card>

            {/* The calendar alone sets the row height. This column is absolutely filled on lg, so
                whatever it holds can never grow the row — swapping the summary for a day's
                submissions leaves the calendar exactly where it was. */}
            <div className="relative lg:col-span-2">
                <div className="lg:absolute lg:inset-0">
                    {selectedDay === null ? (
                        <SummaryMetricsCard summary={summary} />
                    ) : (
                        <HomeDaySubmissions dayTs={selectedDay} rows={dayRows} onClose={() => setSelectedDay(null)} />
                    )}
                </div>
            </div>
        </div>
    )
}

/** Compact stacked variant of the activity summary, sized to sit beside the calendar. */
function SummaryMetricsCard({ summary }: { summary: DashboardSummary | null }) {
    return (
        <Card className="h-full gap-4 rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col justify-around gap-3 overflow-y-auto">
                {SUMMARY_METRICS.map(({ key, label, icon: Icon, iconAccent }) => (
                    <div key={key} className="flex items-center gap-3">
                        <Icon className={cn('size-5 shrink-0 opacity-80', iconAccent)} aria-hidden />
                        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{label}</span>
                        {summary === null ? (
                            <Spinner className="size-4 shrink-0 text-muted-foreground" />
                        ) : (
                            <span className="shrink-0 text-lg font-semibold tracking-tight tabular-nums">
                                {key === 'level' ? summary.level : summary[key].toLocaleString()}
                            </span>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
