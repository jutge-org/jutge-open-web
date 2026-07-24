import { CourseIconImage } from '@/components/courses/CourseIconImage'
import { ExamCountdown } from '@/components/exams/ExamCountdown'
import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatExamDuration, type ExamRow } from '@/lib/exams'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AlignLeftIcon, CalendarPlusIcon, ClockIcon, HourglassIcon, MapPinIcon, SignatureIcon } from 'lucide-react'
import Link from 'next/link'

dayjs.extend(relativeTime)

type ExamListCardProps = {
    row: ExamRow
    tone?: 'upcoming' | 'past'
}

export function ExamListCard({ row, tone = 'upcoming' }: ExamListCardProps) {
    return tone === 'past' ? <PastExamListCard row={row} /> : <UpcomingExamListCard row={row} />
}

// Compact single-row card: past exams are reference material, so they stay short.
function PastExamListCard({ row }: { row: ExamRow }) {
    return (
        <Card className="rounded-lg border border-border border-l-4 border-l-border shadow-sm ring-0">
            <CardContent className="flex items-center gap-3 px-4 py-2.5">
                <Link href={row.courseHref} className="shrink-0">
                    <CourseIconImage iconUrl={row.courseIconUrl} size="2sm" className="opacity-70" />
                </Link>
                <Link
                    href={`/exams/${row.exam_key}`}
                    className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground/80 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {row.title}
                </Link>
                <span className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                    <ClockIcon className="size-3.5 shrink-0" aria-hidden />
                    {dayjs(row.exp_time_start).format('D MMM YYYY')}
                </span>
                {row.place ? (
                    <span className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground md:flex">
                        <MapPinIcon className="size-3.5 shrink-0" aria-hidden />
                        <span className="max-w-40 truncate">{row.place}</span>
                    </span>
                ) : null}
                {row.contest ? (
                    <Badge variant="outline" className="hidden lg:inline-flex">
                        Contest
                    </Badge>
                ) : null}
                <Badge variant="outline" className="shrink-0 font-medium">
                    {row.statusLabel}
                </Badge>
            </CardContent>
        </Card>
    )
}

function UpcomingExamListCard({ row }: { row: ExamRow }) {
    const isInProgress = row.statusTone === 'in-progress'
    const dateLabel = dayjs(row.exp_time_start).format('ddd, D MMM YYYY · HH:mm')

    return (
        <Card className="border border-border border-l-4 border-l-purple-500 shadow-sm ring-0">
            <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <Link href={row.courseHref} className="shrink-0">
                            <CourseIconImage iconUrl={row.courseIconUrl} size="md" />
                        </Link>
                        <div className="min-w-0 flex-1">
                            <Link
                                href={`/exams/${row.exam_key}`}
                                className="line-clamp-2 text-lg font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                {row.title}
                            </Link>
                            <Link
                                href={row.courseHref}
                                className="mt-1 line-clamp-2 block text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                {row.courseTitle}
                            </Link>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                                <SignatureIcon className="size-3.5 shrink-0" aria-hidden />
                                {row.ownerName}
                            </p>
                        </div>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 rounded-full" asChild>
                                <a
                                    href={row.calendarUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Add to calendar"
                                >
                                    <CalendarPlusIcon aria-hidden />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Add to calendar</TooltipContent>
                    </Tooltip>
                </div>

                <div className="flex flex-col gap-1.5">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon className="size-4 shrink-0" aria-hidden />
                        <span>{dateLabel}</span>
                        <span className="text-muted-foreground/80">({dayjs(row.exp_time_start).fromNow()})</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <HourglassIcon className="size-4 shrink-0" aria-hidden />
                        <span>{formatExamDuration(row.runningTimeMinutes)}</span>
                    </p>
                    {row.place ? (
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPinIcon className="size-4 shrink-0" aria-hidden />
                            <span>{row.place}</span>
                        </p>
                    ) : null}
                    {row.description ? (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <AlignLeftIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                            <MarkdownText className="min-w-0 text-sm text-muted-foreground">
                                {row.description}
                            </MarkdownText>
                        </div>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {isInProgress ? (
                            <span className="inline-flex items-center rounded-md bg-purple-600 px-2 py-0.5 text-xs font-semibold text-purple-50 dark:bg-purple-700">
                                In progress
                            </span>
                        ) : (
                            <ExamCountdown
                                targetMs={row.exp_time_startMs}
                                prefix="Starts in"
                                className="inline-flex items-center rounded-md bg-purple-600 px-2 py-0.5 text-xs font-semibold text-purple-50 dark:bg-purple-700"
                            />
                        )}
                        {row.contest ? <Badge variant="outline">Contest</Badge> : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
