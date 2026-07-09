import { CourseIconImage } from '@/components/courses/CourseIconImage'
import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ExamRow } from '@/lib/exams'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CalendarPlusIcon, ClockIcon, MapPinIcon, SignatureIcon } from 'lucide-react'
import Link from 'next/link'

dayjs.extend(relativeTime)

type ExamListCardProps = {
    row: ExamRow
}

export function ExamListCard({ row }: ExamListCardProps) {
    return (
        <Card className="border border-border shadow-sm ring-0">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:gap-6">
                <div className="flex min-w-0 flex-1 flex-col gap-4">
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

                    <div className="flex flex-col gap-1">
                        <p className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ClockIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                            <span>{row.exp_time_start}</span>
                            <span>({dayjs(row.exp_time_start).fromNow()})</span>
                        </p>
                        {row.place ? (
                            <p className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                                <span>{row.place}</span>
                            </p>
                        ) : null}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <Badge variant="outline" className={cn('font-medium')}>
                                {row.statusLabel}
                            </Badge>
                            {row.contest ? <Badge variant="outline">Contest</Badge> : null}
                        </div>
                    </div>
                </div>

                {row.description ? (
                    <div className="min-w-0 md:w-2/5 md:border-l md:border-border md:pl-6">
                        <MarkdownText className="text-sm text-muted-foreground">{row.description}</MarkdownText>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
