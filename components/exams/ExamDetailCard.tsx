import Link from 'next/link'
import { BookOpenIcon, CalendarPlusIcon, SignatureIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { ExamDetail, ExamStatusTone } from '@/lib/exams'
import { cn } from '@/lib/utils'

type ExamDetailCardProps = {
    exam: ExamDetail
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-foreground sm:text-right">{label}</dt>
            <dd className="text-sm text-muted-foreground">{children}</dd>
        </div>
    )
}

function statusClassName(tone: ExamStatusTone): string {
    switch (tone) {
        case 'finished':
            return 'text-destructive'
        case 'in-progress':
            return 'text-orange-600 dark:text-orange-400'
        case 'upcoming':
            return 'text-emerald-600 dark:text-emerald-400'
        default:
            return ''
    }
}

export function ExamDetailCard({ exam }: ExamDetailCardProps) {
    return (
        <Card className="overflow-hidden border border-border shadow-sm ring-0">
            <CardHeader className="border-b border-border bg-muted/40 px-6 py-4">
                <CardTitle className="text-lg font-semibold text-foreground">{exam.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-6 py-4">
                <div className="flex flex-col gap-1">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <BookOpenIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                        <Link href={exam.courseHref} className="text-primary hover:underline">
                            {exam.courseTitle}
                        </Link>
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <SignatureIcon className="size-3.5 shrink-0" aria-hidden />
                        {exam.ownerName}
                    </p>
                </div>
                <dl>
                    <DetailRow label="Description">
                        {exam.description ? (
                            <span className="whitespace-pre-wrap text-foreground/90">{exam.description}</span>
                        ) : (
                            '—'
                        )}
                    </DetailRow>
                    <DetailRow label="Place">{exam.place || '—'}</DetailRow>
                    <DetailRow label="Start time">{exam.exp_time_start}</DetailRow>
                    <DetailRow label="Status">
                        <span className={cn('font-medium', statusClassName(exam.statusTone))}>{exam.statusLabel}</span>
                    </DetailRow>
                </dl>
            </CardContent>
            <CardFooter className="border-t border-border px-6 py-4">
                <Button asChild>
                    <a href={exam.calendarUrl} target="_blank" rel="noopener noreferrer">
                        <CalendarPlusIcon aria-hidden />
                        Add to calendar
                    </a>
                </Button>
            </CardFooter>
        </Card>
    )
}
