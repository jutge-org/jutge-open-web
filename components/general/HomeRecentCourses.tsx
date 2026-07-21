'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BookOpenIcon } from 'lucide-react'
import Link from 'next/link'

import { CourseIconImage } from '@/components/courses/CourseIconImage'
import { HomeWidgetCard, HomeWidgetMessage } from '@/components/general/HomeWidgetCard'
import { useRecents } from '@/components/RecentsProvider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { courseIconUrl } from '@/lib/courses'
import { recentCourseHref, type RecentCourseItem } from '@/lib/recents'

dayjs.extend(relativeTime)

// Taller than the other rows because a course row carries a full-size icon.
const ROW_HEIGHT_REM = 2.75

// Titles are filled in from the API by RecentsProvider. Until that lands the store may still hold
// the course key, which is shown rather than leaving the row blank.
function recentCourseTitle(course: RecentCourseItem): string {
    return course.title.trim() || course.courseKey
}

// Recent courses come straight from the client-side recents store (sorted by accessedAt).
export function HomeRecentCourses() {
    const { recents } = useRecents()

    return (
        <HomeWidgetCard
            title="Recently visited courses"
            href="/courses"
            accentClassName="border-t-amber-500"
            icon={<BookOpenIcon className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />}
        >
            {recents.courses.length === 0 ? (
                <HomeWidgetMessage>No recent courses.</HomeWidgetMessage>
            ) : (
                <TooltipProvider>
                    {recents.courses.map((course) => (
                        <RecentCourseRow key={course.courseKey} course={course} />
                    ))}
                </TooltipProvider>
            )}
        </HomeWidgetCard>
    )
}

function RecentCourseRow({ course }: { course: RecentCourseItem }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={recentCourseHref(course)}
                    style={{ height: `${ROW_HEIGHT_REM}rem` }}
                    className="flex items-center gap-2 border-b border-border/50 px-3 text-xs transition-colors last:border-b-0 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                    <CourseIconImage
                        iconUrl={course.iconUrl ?? courseIconUrl(null)}
                        size="2sm"
                        className="rounded-md"
                    />
                    <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                        {recentCourseTitle(course)}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-muted-foreground tabular-nums">
                        {dayjs(course.accessedAt).fromNow(true)}
                    </span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="top">
                {recentCourseTitle(course)} · accessed {dayjs(course.accessedAt).fromNow()}
            </TooltipContent>
        </Tooltip>
    )
}