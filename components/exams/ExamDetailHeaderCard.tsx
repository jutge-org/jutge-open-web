import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CalendarPlusIcon, ClockIcon, HourglassIcon, MapPinIcon, SignatureIcon } from 'lucide-react'
import Link from 'next/link'

import { CourseIconImage } from '@/components/courses/CourseIconImage'
import { ExamCountdown } from '@/components/exams/ExamCountdown'
import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatExamDuration, type ExamDetail } from '@/lib/exams'
import { cn } from '@/lib/utils'

dayjs.extend(relativeTime)

type ExamDetailHeaderCardProps = {
    exam: ExamDetail
}

export function ExamDetailHeaderCard({ exam }: ExamDetailHeaderCardProps) {
    const isFinished = exam.statusTone === 'finished'
    const isInProgress = exam.statusTone === 'in-progress'

    return (
        <Card
            className={cn(
                'border border-border border-l-4 shadow-sm ring-0',
                isFinished ? 'border-l-border' : 'border-l-purple-500',
            )}
        >
            <CardContent className="flex flex-col gap-5 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <Link href={exam.courseHref} className="shrink-0">
                            <CourseIconImage iconUrl={exam.courseIconUrl} size="md" />
                        </Link>
                        <div className="min-w-0 flex-1">
                            <h1 className="line-clamp-2 text-xl font-bold tracking-tight text-foreground">
                                {exam.title}
                            </h1>
                            <Link
                                href={exam.courseHref}
                                className="mt-1 line-clamp-2 block text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                {exam.courseTitle}
                            </Link>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                                <SignatureIcon className="size-3.5 shrink-0" aria-hidden />
                                {exam.ownerName}
                            </p>
                        </div>
                    </div>
                    {isFinished ? null : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0 rounded-full" asChild>
                                    <a
                                        href={exam.calendarUrl}
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
                    )}
                </div>

                {/* Status + countdown hero line */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    {isFinished ? (
                        <Badge variant="outline" className="text-sm font-medium">
                            {exam.statusLabel}
                        </Badge>
                    ) : (
                        <span className="inline-flex items-center rounded-md bg-purple-600 px-2.5 py-1 text-sm font-semibold text-purple-50 dark:bg-purple-700">
                            {isInProgress ? 'In progress' : 'Upcoming'}
                        </span>
                    )}
                    {isInProgress ? null : (
                        <ExamCountdown
                            targetMs={exam.exp_time_startMs}
                            prefix="Starts in"
                            className="text-base font-semibold text-foreground"
                        />
                    )}
                    {isFinished && exam.time_end ? (
                        <span className="text-sm text-muted-foreground">
                            Ended {dayjs(exam.time_end).fromNow()}
                        </span>
                    ) : null}
                    {exam.contest ? <Badge variant="outline">Contest</Badge> : null}
                    {!exam.visible_submissions ? <Badge variant="outline">No visible submissions</Badge> : null}
                </div>

                {/* Meta: timeline, duration, place */}
                <div className="flex flex-col gap-1.5">
                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ClockIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                        <span>{exam.exp_time_start}</span>
                        <span className="text-muted-foreground/80">({dayjs(exam.exp_time_start).fromNow()})</span>
                    </p>
                    {exam.time_start ? (
                        <p className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-0.5 size-4 shrink-0" aria-hidden />
                            <span>Started {exam.time_start}</span>
                            <span className="text-muted-foreground/80">({dayjs(exam.time_start).fromNow()})</span>
                        </p>
                    ) : null}
                    {exam.time_end ? (
                        <p className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-0.5 size-4 shrink-0" aria-hidden />
                            <span>Ended {exam.time_end}</span>
                            <span className="text-muted-foreground/80">({dayjs(exam.time_end).fromNow()})</span>
                        </p>
                    ) : null}
                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                        <HourglassIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                        <span>{formatExamDuration(exam.runningTimeMinutes)}</span>
                    </p>
                    {exam.place ? (
                        <p className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                            <span>{exam.place}</span>
                        </p>
                    ) : null}
                </div>

                {exam.description ? (
                    <div className="border-t border-border pt-4">
                        <MarkdownText className="text-sm text-muted-foreground">{exam.description}</MarkdownText>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
