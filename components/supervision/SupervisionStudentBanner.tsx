'use client'

import { EyeIcon } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { supervisionHref, type SupervisionContext } from '@/lib/supervision'

type SupervisionStudentBannerProps = {
    context: SupervisionContext
    courseTitle?: string
}

export function SupervisionStudentBanner({ context, courseTitle }: SupervisionStudentBannerProps) {
    const studentLabel = context.studentName?.trim() || context.email
    const overviewHref = supervisionHref(context.courseKey, context.email)

    return (
        <div
            className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm"
            role="status"
            aria-label={`Supervising ${studentLabel}`}
        >
            <EyeIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="text-muted-foreground">Supervising</span>
            <Link href={overviewHref} className="font-medium text-foreground hover:text-primary hover:underline">
                {studentLabel}
            </Link>
            {courseTitle ? (
                <>
                    <span className="text-muted-foreground">in</span>
                    <span className="text-foreground">{courseTitle}</span>
                </>
            ) : null}
            <Badge variant="outline" className="ml-auto">
                Read-only
            </Badge>
        </div>
    )
}
