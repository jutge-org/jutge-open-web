'use client'

import { BookOpenIcon, EyeIcon, MailIcon } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import type { PublicProfile } from '@/lib/jutge_api_client'
import type { SupervisionCourseOption } from '@/lib/supervision'
import { cn } from '@/lib/utils'

type SupervisionStudentProfileCardProps = {
    profile: PublicProfile
    course: Pick<SupervisionCourseOption, 'title'>
}

function formatOptional(value: string | null | undefined): string {
    const trimmed = value?.trim()
    return trimmed ? trimmed : '—'
}

function useSupervisionHeaderClassName() {
    return cn(
        '-mt-4 flex min-h-22 items-center gap-5 rounded-b-2xl border-l border-r border-b border-t-none px-6 py-5 text-left shadow-sm',
    )
}

/** PageTitle-style header: overlaps the sticky bar and uses the supervision contextual gradient. */
export function SupervisionStudentProfileCard({ profile, course }: SupervisionStudentProfileCardProps) {
    const className = useSupervisionHeaderClassName()

    return (
        <div className={className}>
            <span
                className="flex size-14 shrink-0 items-center justify-center rounded-xl border-l-4 border-l-emerald-500 bg-muted/80 text-emerald-600 dark:text-emerald-400"
                aria-hidden
            >
                <EyeIcon className="size-7" />
            </span>
            <div className="min-w-0 flex-1">
                <h1 className="my-0 text-lg font-semibold tracking-tight text-foreground">
                    {formatOptional(profile.name)}
                </h1>
                <dl className="mt-1 flex flex-row gap-2 text-sm text-muted-foreground items-center">
                    <MailIcon className="size-3 shrink-0" />
                    <span className="min-w-0 break-all">{profile.email}</span>
                </dl>
                <dl className="flex flex-row gap-2 text-sm text-muted-foreground items-center">
                    <BookOpenIcon className="size-3 shrink-0" />
                    <span className="min-w-0 break-all">{course.title}</span>
                </dl>
            </div>
        </div>
    )
}

export function SupervisionStudentProfileCardLoading() {
    const className = useSupervisionHeaderClassName()

    return (
        <div className={className} aria-busy="true" aria-label="Loading student profile">
            <Skeleton className="size-14 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72 max-w-full" />
                <Skeleton className="h-4 w-56 max-w-full" />
            </div>
        </div>
    )
}
