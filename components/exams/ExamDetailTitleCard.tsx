import { CourseIconImage } from '@/components/courses/CourseIconImage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ExamDetail } from '@/lib/exams'
import { CalendarPlusIcon, SignatureIcon } from 'lucide-react'
import Link from 'next/link'

type ExamDetailTitleCardProps = {
    exam: ExamDetail
}

export function ExamDetailTitleCard({ exam }: ExamDetailTitleCardProps) {
    return (
        <Card className="border border-border shadow-sm ring-0">
            <CardContent className="flex items-start justify-between gap-3 px-5">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Link href={exam.courseHref} className="shrink-0">
                        <CourseIconImage iconUrl={exam.courseIconUrl} size="md" />
                    </Link>
                    <div className="min-w-0 flex-1">
                        <h1 className="line-clamp-1 text-lg font-semibold text-foreground">{exam.title}</h1>
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
            </CardContent>
        </Card>
    )
}
