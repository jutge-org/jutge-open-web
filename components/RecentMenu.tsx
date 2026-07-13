'use client'

import { CourseIconImage } from '@/components/courses/CourseIconImage'
import { ProblemIconImage } from '@/components/problems/ProblemIconImage'
import { useRecents } from '@/components/RecentsProvider'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    formatRecentProblemTitle,
    recentCourseHref,
    recentProblemHref,
    recentSubmissionHref,
    type RecentCourseItem,
    type RecentProblemItem,
    type RecentSubmissionItem,
} from '@/lib/recents'
import { courseIconUrl } from '@/lib/courses'
import { BookOpenIcon, Clock3Icon, FileBracesCornerIcon, SendIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

type RecentSectionProps<T> = {
    label: string
    icon: ReactNode
    items: T[]
    renderHref: (item: T) => string
    renderTitle: (item: T) => ReactNode
    renderLeading?: (item: T) => ReactNode
    emptyLabel: string
}

function RecentSection<T>({
    label,
    icon,
    items,
    renderHref,
    renderTitle,
    renderLeading,
    emptyLabel,
}: RecentSectionProps<T>) {
    return (
        <>
            <DropdownMenuLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                {icon}
                {label}
            </DropdownMenuLabel>
            {items.length === 0 ? (
                <DropdownMenuItem disabled className="text-muted-foreground">
                    {emptyLabel}
                </DropdownMenuItem>
            ) : (
                items.map((item) => (
                    <DropdownMenuItem key={renderHref(item)} asChild>
                        <Link href={renderHref(item)} className="flex min-w-0 items-center gap-1.5">
                            {renderLeading ? renderLeading(item) : null}
                            <span className="truncate">{renderTitle(item)}</span>
                        </Link>
                    </DropdownMenuItem>
                ))
            )}
        </>
    )
}

export function RecentMenu() {
    const { recents, clearCourses, clearProblems, clearSubmissions, clearAll } = useRecents()
    const hasAnyRecents = recents.courses.length > 0 || recents.problems.length > 0 || recents.submissions.length > 0

    return (
        <DropdownMenu>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" aria-label="Recent items">
                                <Clock3Icon className="size-4.5" aria-hidden />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Recent items</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent
                align="end"
                className="min-w-64 max-w-80 **:data-[slot=dropdown-menu-item]:py-1.5 **:data-[slot=dropdown-menu-item]:text-base"
            >
                <RecentSection<RecentCourseItem>
                    label="Courses"
                    icon={<BookOpenIcon className="size-4" aria-hidden />}
                    items={recents.courses}
                    renderHref={recentCourseHref}
                    renderTitle={(item) => item.title}
                    renderLeading={(item) => (
                        <CourseIconImage
                            iconUrl={item.iconUrl ?? courseIconUrl(null)}
                            className="size-4 shrink-0 rounded"
                        />
                    )}
                    emptyLabel="No recent courses"
                />
                <DropdownMenuSeparator />
                <RecentSection<RecentProblemItem>
                    label="Problems"
                    icon={<FileBracesCornerIcon className="size-4" aria-hidden />}
                    items={recents.problems}
                    renderHref={recentProblemHref}
                    renderTitle={formatRecentProblemTitle}
                    renderLeading={(item) =>
                        item.iconUrl ? (
                            <ProblemIconImage iconUrl={item.iconUrl} className="size-4 shrink-0 rounded" />
                        ) : null
                    }
                    emptyLabel="No recent problems"
                />
                <DropdownMenuSeparator />
                <RecentSection<RecentSubmissionItem>
                    label="Submissions"
                    icon={<SendIcon className="size-4" aria-hidden />}
                    items={recents.submissions}
                    renderHref={recentSubmissionHref}
                    renderTitle={(item) => (
                        <>
                            {item.verdictEmoji ? (
                                <span aria-hidden className="mr-2">
                                    {item.verdictEmoji}
                                </span>
                            ) : null}
                            {item.title}
                        </>
                    )}
                    emptyLabel="No recent submissions"
                />
                {hasAnyRecents ? (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Trash2Icon className="size-4" aria-hidden />
                            Clear
                        </DropdownMenuLabel>
                        {recents.courses.length > 0 ? (
                            <DropdownMenuItem className="text-muted-foreground" onClick={clearCourses}>
                                Clear recent courses
                            </DropdownMenuItem>
                        ) : null}
                        {recents.problems.length > 0 ? (
                            <DropdownMenuItem className="text-muted-foreground" onClick={clearProblems}>
                                Clear recent problems
                            </DropdownMenuItem>
                        ) : null}
                        {recents.submissions.length > 0 ? (
                            <DropdownMenuItem className="text-muted-foreground" onClick={clearSubmissions}>
                                Clear recent submissions
                            </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem className="text-muted-foreground" onClick={clearAll}>
                            Clear all
                        </DropdownMenuItem>
                    </>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
