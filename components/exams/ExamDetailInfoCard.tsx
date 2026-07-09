import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { ExamDetail } from '@/lib/exams'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ClockIcon, MapPinIcon } from 'lucide-react'

dayjs.extend(relativeTime)

type ExamDetailInfoCardProps = {
    exam: ExamDetail
}

export function ExamDetailInfoCard({ exam }: ExamDetailInfoCardProps) {
    return (
        <Card className="border border-border shadow-sm ring-0">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:gap-6">
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ClockIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                            <span>{exam.exp_time_start}</span>
                            <span>({dayjs(exam.exp_time_start).fromNow()})</span>
                        </p>
                        {exam.time_start ? (
                            <p className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="mt-0.5 size-4 shrink-0" aria-hidden />
                                <span>Started {exam.time_start}</span>
                                <span>({dayjs(exam.time_start).fromNow()})</span>
                            </p>
                        ) : null}
                        {exam.time_end ? (
                            <p className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="mt-0.5 size-4 shrink-0" aria-hidden />
                                <span>Ended {exam.time_end}</span>
                                <span>({dayjs(exam.time_end).fromNow()})</span>
                            </p>
                        ) : null}
                        {exam.place ? (
                            <p className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                                <span>{exam.place}</span>
                            </p>
                        ) : null}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <Badge variant="outline" className={cn('font-medium')}>
                                {exam.statusLabel}
                            </Badge>
                            {exam.contest ? <Badge variant="outline">Contest</Badge> : null}
                            {!exam.visible_submissions ? <Badge variant="outline">No visible submissions</Badge> : null}
                        </div>
                    </div>
                </div>

                {exam.description ? (
                    <div className="min-w-0 md:w-2/5 md:border-l md:border-border md:pl-6">
                        <MarkdownText className="text-sm text-muted-foreground">{exam.description}</MarkdownText>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
