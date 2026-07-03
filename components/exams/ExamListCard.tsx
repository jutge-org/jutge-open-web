import Link from 'next/link'
import { BookOpenIcon, CalendarPlusIcon, ClockIcon, MapPinIcon, SignatureIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ExamRow } from '@/lib/exams'

type ExamListCardProps = {
    row: ExamRow
}

export function ExamListCard({ row }: ExamListCardProps) {
    return (
        <Card className="border border-border shadow-sm ring-0">
            <CardHeader className="border-b border-border px-5 py-4">
                <div className="flex items-start justify-between gap-2">
                    <Link
                        href={`/exams/${row.exam_nm}`}
                        className="min-w-0 text-lg font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        {row.title}
                    </Link>
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
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-5 py-4">
                <div className="flex flex-col gap-1">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <BookOpenIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                        <Link href={row.courseHref} className="text-primary hover:underline">
                            {row.courseTitle}
                        </Link>
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <SignatureIcon className="size-3.5 shrink-0" aria-hidden />
                        {row.ownerName}
                    </p>
                    <p className="flex items-start gap-2">
                        <ClockIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                        <span>{row.exp_time_start}</span>
                    </p>
                    {row.place ? (
                        <p className="flex items-start gap-2">
                            <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                            <span>{row.place}</span>
                        </p>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    )
}
